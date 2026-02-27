// Fetch the manifesto markdown and render a short excerpt
async function loadExcerpt() {
  const container = document.getElementById('excerpt');
  try {
    const res = await fetch('manifesto.md');
    if (!res.ok) throw new Error('manifesto not found');
    const text = await res.text();
    // take first 600 characters (or full text if short)
    const excerpt = text.trim().slice(0, 1000);
    // split into paragraphs by double newlines
    const paras = excerpt.split(/\n\s*\n/).slice(0,3);
    container.innerHTML = '';
    paras.forEach(p => {
      const el = document.createElement('p');
      el.textContent = p.replace(/\n/g, ' ');
      container.appendChild(el);
    });

    if (text.length > 1000) {
      const more = document.createElement('p');
      more.style.opacity = '0.9';
      more.style.marginTop = '8px';
      more.style.color = 'rgba(255,255,255,0.7)';
      more.textContent = '…' ;
      container.appendChild(more);
    }
  } catch (err) {
    container.innerHTML = '<div class="loading">Could not load manifesto. Click "Read full manifesto" to open the file.</div>';
  }
}

document.addEventListener('DOMContentLoaded', loadExcerpt);
