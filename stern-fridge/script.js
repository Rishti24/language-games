(()=>{
  const items = Array.from(document.querySelectorAll('.item'));
  const observationEl = document.getElementById('observation');
  const predictionEl = document.getElementById('prediction');
  const logList = document.getElementById('log-list');
  const cursor = document.getElementById('cursor');

  const comments = {
    'Coke': ["Third Coke today.", "That's a lot of fizz." , "You're drinking more than yesterday."],
    'Ice Cream': ["The ice cream is disappearing faster this week.", "Cold comfort.", "That pint won't last the weekend."],
    'Chocolate': ["You seem to prefer sugar over everything else.", "A sweet pattern emerges.", "You're choosing treats more often."],
    'Spinach': ["A healthy choice — rare and revered.", "You might feel virtuous for an hour.", "Good for tonight's dinner plans."],
    'Yogurt': ["Practical and quiet choice.", "You'll likely snack again soon.", "Predictable and reliable."] ,
    'Leftovers': ["Rescued dinner — thrifty move.", "A repeat of yesterday is likely.", "Comfort food pattern detected."]
  };

  const predictions = {
    'Coke': ["You may be thirsty again in two hours.", "A similar choice is likely later tonight.", "Caffeine habit repeating."],
    'Ice Cream': ["You may crave sweets later.", "A cold snack repeat is likely.", "Tonight's dessert habit continues."],
    'Chocolate': ["You might reach for another piece soon.", "This habit tends to repeat.", "A sugary evening may follow."],
    'Spinach': ["A balanced meal could follow.", "You may maintain this streak.", "Healthy choices might increase."],
    'Yogurt': ["A light snack pattern continues.", "You may grab something else soon.", "Predictable morning habit likely."],
    'Leftovers': ["You'll probably finish the remaining portion.", "A similar choice is likely tomorrow.", "Comfort-repeat predicted."]
  };

  // load counts from localStorage or init
  const STORAGE_KEY = 'sternFridgeCountsV1';
  let counts = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  ['Coke','Ice Cream','Chocolate','Spinach','Yogurt','Leftovers'].forEach(k=>counts[k]=counts[k]||0);

  function renderLog(){
    logList.innerHTML = '';
    Object.keys(counts).forEach(k=>{
      const li = document.createElement('li');
      li.innerHTML = `<span>${k}</span><span class="count">${counts[k]}</span>`;
      logList.appendChild(li);
    })
  }

  function randomPick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

  function showResponse(item){
    // highlight
    items.forEach(i=>i.classList.toggle('selected', i.dataset.item===item));

    // set texts
    observationEl.textContent = randomPick(comments[item]);
    predictionEl.textContent = randomPick(predictions[item]);

    // animate fade-in
    observationEl.classList.remove('show');
    predictionEl.classList.remove('show');
    // Force reflow for restart
    void observationEl.offsetWidth;
    observationEl.classList.add('show');
    predictionEl.classList.add('show');
  }

  items.forEach(btn=>{
    btn.addEventListener('click', e=>{
      const name = btn.dataset.item;
      counts[name] = (counts[name]||0) + 1;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(counts));
      renderLog();
      showResponse(name);
    });
  });

  // init
  renderLog();

  // custom cursor movement
  document.addEventListener('mousemove', e=>{
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });

  // keyboard accessibility: Enter/Space triggers click when focused
  document.addEventListener('keydown', e=>{
    const active = document.activeElement;
    if((e.key === 'Enter' || e.key === ' ') && active && active.classList && active.classList.contains('item')){
      e.preventDefault(); active.click();
    }
  });

})();
