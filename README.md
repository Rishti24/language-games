<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>The Stern Fridge — Installation Interface</title>
  <style>
    :root{
      --bg:#000;
      --fridge:#051018;
      --glass: rgba(255,255,255,0.03);
      --cold:#dff6ff;
      --muted:#93a6b0;
      --accent:#66c9ff;
      --danger:#ff8b8b;
    }
    *{box-sizing:border-box}
    html,body{height:100%}
    body{
      margin:0;font-family:Inter,system-ui,Segoe UI,Arial,Helvetica,sans-serif;background:var(--bg);color:var(--cold);cursor:none;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:28px;
    }

    /* Atmosphere: dark room with subtle vignette and grain */
    .room{position:fixed;inset:0;pointer-events:none;background:
      radial-gradient(800px 360px at 50% 30%, rgba(50,80,110,0.22), transparent 22%),
      linear-gradient(180deg,#02101a 0%, #00040a 60%);
      z-index:0}
    /* subtle grain using repeating-linear-gradient overlay */
    .room::after{content:'';position:absolute;inset:0;pointer-events:none;background:repeating-linear-gradient(0deg, rgba(255,255,255,0.01) 0 1px, transparent 1px 3px);mix-blend-mode:overlay;opacity:0.08}

    header{position:relative;z-index:2;text-align:center;margin-bottom:14px}
    header h1{margin:0;font-size:20px;font-weight:600;letter-spacing:0.6px}
    header p{margin:6px 0 0;color:var(--muted);font-size:13px}
    header .hint{margin-top:8px;color:rgba(102,201,255,0.18);font-size:12px}

    /* Stage layout: strict fixed grid
       Columns: left spacer | fridge (approx 60vw) | log (approx 20vw) | right spacer
    */
    .stage{position:relative;display:grid;grid-template-columns:1fr 60vw 20vw 1fr;grid-template-rows:1fr auto;gap:36px;align-items:center;justify-items:center;z-index:2;width:100%;height:calc(100vh - 120px);}

    .fridge{
      position:relative;width:60vw;max-width:920px;height:56vh;min-height:420px;border-radius:14px;padding:28px;background:linear-gradient(180deg,#071424 0%, #031019 48%, #000610 100%);box-shadow:0 40px 120px rgba(0,0,0,0.8), 0 8px 48px rgba(12,22,28,0.6) inset;border:1px solid var(--glass);overflow:hidden;grid-column:2 / 3;grid-row:1 / 2;perspective:1200px}

    /* hum / living lighting */
    /* interior light / glow - off when door closed */
    .fridge::before{content:'';position:absolute;inset:0;background:radial-gradient(380px 160px at 50% 24%, rgba(102,201,255,0.06), transparent 28%);pointer-events:none;mix-blend-mode:screen;opacity:0;transition:opacity .5s ease, filter 1s ease;animation:fridge-breathe 6s ease-in-out infinite}
    .fridge.open::before{opacity:1}
    @keyframes fridge-breathe{0%{opacity:0.8}50%{opacity:1}100%{opacity:0.8}}

    /* shelves */
    .shelf{position:absolute;left:48px;right:48px;height:110px;border-radius:8px;display:flex;align-items:center;justify-content:space-around;padding:0 18px}
    .shelf.top{top:70px}
    .shelf.mid{top:210px}
    .shelf.bot{top:350px}
    .shelf .bar{position:absolute;left:0;right:0;height:6px;bottom:8px;border-radius:6px;background:linear-gradient(180deg, rgba(255,255,255,0.02), transparent);box-shadow:0 6px 14px rgba(0,0,0,0.6) inset}
    .shelf .glow{position:absolute;left:-12%;right:-12%;top:0;bottom:0;border-radius:10px;pointer-events:none;mix-blend-mode:screen;opacity:0;transition:opacity .28s ease, box-shadow .28s ease}
    .shelf.glowing .glow{opacity:1;background:linear-gradient(90deg, transparent 15%, rgba(102,201,255,0.06) 50%, transparent 85%);box-shadow:0 0 22px rgba(102,201,255,0.06)}

    /* items */
    .item{position:relative;min-width:130px;padding:14px 12px;border-radius:10px;border:1px solid rgba(255,255,255,0.03);background:linear-gradient(180deg,#ffffff03,#00000002);color:var(--cold);text-align:center;transition:transform .26s cubic-bezier(.2,.9,.2,1),box-shadow .26s,filter .26s;cursor:pointer}
    .item:hover{transform:translateY(-10px) scale(1.02);filter:brightness(1.06)}
    .item.surface{transform:translateY(-22px) scale(1.085);box-shadow:0 44px 90px rgba(0,0,0,0.75),0 0 46px rgba(102,201,255,0.12);z-index:6}

    .item[data-item="Coke"]{background:linear-gradient(180deg,#191919,#0f0f0f);color:#fff}
    .item[data-item="Ice Cream"]{background:linear-gradient(180deg,#fffdf8,#fff9f1);color:#222}
    .item[data-item="Chocolate"]{background:linear-gradient(180deg,#3b2b23,#24150f);color:#ffdcb8}
    .item[data-item="Spinach"]{background:linear-gradient(180deg,#072b1a,#0b3926);color:#cfeee0}
    .item[data-item="Yogurt"]{background:linear-gradient(180deg,#f7fbff,#e9f7ff);color:#0f2a3a}
    .item[data-item="Leftovers"]{background:linear-gradient(180deg,#2e2d28,#1f1f19);color:#fff9e0}

    /* projection / emergent response */

    /* Response panel lives below fridge (outside the fridge area) */
    .response-area{grid-column:2 / 3;grid-row:2 / 3;display:flex;flex-direction:column;align-items:center;gap:10px}
    .crit{background:linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.18));padding:12px 18px;border-radius:10px;color:var(--cold);font-weight:600;letter-spacing:0.2px;max-width:64vw;text-align:center;opacity:0;transform:translateY(8px);transition:opacity .36s ease,transform .36s ease}
    .crit.show{opacity:1;transform:translateY(0);filter:drop-shadow(0 14px 40px rgba(0,0,0,0.6))}
    .crit.sharp{color:var(--danger);font-weight:700}

    .proc{background:transparent;padding:6px 12px;border-radius:8px;color:var(--muted);font-size:13px;opacity:0;transform:translateY(8px);transition:opacity .28s ease,transform .28s ease}
    .proc.show{opacity:1;transform:translateY(0)}

    .pred{background:linear-gradient(180deg, rgba(102,201,255,0.06), rgba(0,0,0,0.06));padding:12px 16px;border-radius:12px;color:var(--accent);font-weight:600;opacity:0;transform:translateY(8px);transition:opacity .5s ease,transform .5s ease;position:relative}
    .pred.show{opacity:1;transform:translateY(0)}
    .pred.scan::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg, transparent 0 2px, rgba(255,255,255,0.02) 2px 3px);mix-blend-mode:overlay;opacity:0.16;animation:scanlines 900ms linear}
    @keyframes scanlines{from{background-position:0 0}to{background-position:0 40px}}

    /* meta message */
    .meta{position:absolute;top:18px;left:28px;padding:8px 12px;border-radius:8px;background:rgba(255,255,255,0.02);color:var(--muted);font-size:12px;opacity:0;transition:opacity .4s ease}
    .meta.show{opacity:1}

    /* log panel sits in grid column 3 and must not overlap fridge */
    .log{grid-column:3 / 4;grid-row:1 / 2;align-self:start;color:var(--muted);font-size:13px;position:relative;z-index:3;padding-left:8px}
    .log .title{font-weight:700;color:var(--cold);margin-bottom:8px}
    .reset-btn{display:inline-block;margin-bottom:10px;padding:8px 12px;border-radius:10px;background:linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));color:var(--cold);border:1px solid rgba(255,255,255,0.06);font-size:13px;cursor:pointer;transition:background .18s,color .18s,font-weight .12s;font-weight:700}
    .reset-btn:hover{background:rgba(255,255,255,0.045);color:var(--cold)}
    .log ul{list-style:none;margin:8px 0 0;padding:0;display:flex;flex-direction:column;gap:8px}
    .log li{display:flex;justify-content:space-between;gap:12px;padding:6px 10px;background:rgba(255,255,255,0.02);border-radius:8px}
    .log .count{background:rgba(255,255,255,0.03);padding:4px 8px;border-radius:999px;font-weight:700;color:var(--cold)}

    /* cursor */
    .cursor{position:fixed;pointer-events:none;z-index:9999;width:24px;height:24px;border-radius:50%;transform:translate(-50%,-50%);mix-blend-mode:screen;background:radial-gradient(circle at 35% 30%,rgba(220,250,255,0.95),rgba(102,201,255,0.16) 40%,transparent 55%);box-shadow:0 0 18px rgba(102,201,255,0.10);border:1px solid rgba(255,255,255,0.06);transition:transform .12s ease,width .12s ease,height .12s ease,opacity .12s}
    .cursor.tight{transform:translate(-50%,-50%) scale(0.78)}
    .cursor.pulse{animation:cursor-pulse .38s ease-out}
    @keyframes cursor-pulse{0%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-50%) scale(1.9);opacity:0.6}100%{transform:translate(-50%,-50%) scale(1);opacity:1}}

    /* small ripple created on click */
    .ripple{position:fixed;border-radius:50%;pointer-events:none;background:rgba(102,201,255,0.08);box-shadow:0 0 28px rgba(102,201,255,0.08);transform:translate(-50%,-50%) scale(0);animation:ripple 700ms cubic-bezier(.2,.9,.2,1) forwards}
    @keyframes ripple{to{transform:translate(-50%,-50%) scale(10);opacity:0}}

    /* extra interactive styles and confidence-driven variables */
    :root{--confidence:0}
    .info{grid-column:1 / 2;grid-row:1 / 2;align-self:start;color:var(--muted);font-size:13px;position:relative;z-index:3;padding-left:8px}
    .info .section{background:rgba(255,255,255,0.02);border-radius:8px;padding:10px;margin-bottom:12px}
    .info .section h3{margin:0 0 6px 0;color:var(--cold);font-size:13px}
    .info .section p{margin:0;color:var(--muted);font-size:12px;line-height:1.3}
    .info .add{display:flex;gap:8px;margin-top:8px}
    .info input{flex:1;padding:8px;border-radius:8px;border:1px solid rgba(255,255,255,0.03);background:transparent;color:var(--cold)}
    .info button.add-btn{padding:8px 10px;border-radius:8px;border:1px solid rgba(255,255,255,0.03);background:rgba(255,255,255,0.02);color:var(--cold);cursor:pointer}

    /* spotlight overlay - dims outside the spotlight when an item is active */
    .fridge::after{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at var(--spot-x,50%) var(--spot-y,50%), rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 8%, rgba(0,0,0,calc(0.45 + var(--confidence)*0.25)) 25%);} 

    .shelf .glow{position:absolute;left:-12%;right:-12%;top:0;bottom:0;border-radius:10px;pointer-events:none;mix-blend-mode:screen;opacity:0;transition:opacity .28s ease, box-shadow .28s ease}
    .shelf.glowing .glow{opacity:1;background:linear-gradient(90deg, transparent 15%, rgba(102,201,255,0.06) 50%, transparent 85%);box-shadow:0 0 calc(20px + var(--confidence)*40px) rgba(102,201,255,0.06)}

    .item{touch-action:none}

    /* door styling - covers the fridge front and rotates open */
    .door{position:absolute;inset:0;background:linear-gradient(180deg, rgba(6,18,28,0.96), rgba(2,6,10,0.96));border-radius:14px;box-shadow:inset 0 1px 0 rgba(255,255,255,0.02), 0 12px 40px rgba(0,0,0,0.6);border:1px solid rgba(255,255,255,0.02);z-index:8;transform-origin:left center;transform-style:preserve-3d;transition:transform .7s cubic-bezier(.2,.9,.3,1),box-shadow .4s}
    .door::after{content:'';position:absolute;right:14px;top:50%;transform:translateY(-50%);width:6px;height:36px;border-radius:4px;background:rgba(255,255,255,0.03)}
    /* when fridge open, door is rotated away (JS also sets transform inline) */
    .fridge.open .door{pointer-events:none}

    /* shelves and items are hidden until the fridge opens */
    .fridge .shelf{opacity:0;transform:translateY(8px);transition:opacity .48s ease,transform .48s ease}
    .fridge .item{opacity:0;transform:translateY(6px);transition:opacity .38s ease,transform .38s ease}
    .fridge.open .shelf{opacity:1;transform:none}
    .fridge.open .item{opacity:1;transform:none}
    .fridge:not(.open) .item{pointer-events:none}

    /* Pattern status text (replaces confidence meter) */
    .pattern-status{margin-top:10px}
    .pattern-text{font-weight:700;color:var(--muted);font-size:13px;padding:8px 10px;border-radius:8px;background:rgba(255,255,255,0.01)}

    @media(max-width:960px){.fridge{width:92%;height:460px}.projection{width:86%}.log{display:none}.info{display:none}}
  </style>
</head>
<body>
  <div class="room" aria-hidden="true"></div>
  <div class="cursor" id="cursor" aria-hidden="true"></div>

  <header>
    <h1>The Stern Fridge</h1>
    <p>One illuminated refrigerator. It watches, critiques, and forecasts.</p>
    <div class="hint">Click an item to open the fridge's assessment.</div>
  </header>

  <div class="stage">
    <aside class="info" aria-label="Introduction and controls">
      <div class="section">
        <h3>Intro / Concept</h3>
        <p>The Stern Fridge observes choices and forms a model of your habits. Interact with items to receive critique and prediction.</p>
      </div>
      <div class="section">
        <h3>Behavior model</h3>
        <p>Confidence, trends and model messages appear as you interact. The interface evolves with repeated choices.</p>
      </div>
      <div class="section">
        <h3>Predictive mode</h3>
        <p>Critique appears first (personal). Prediction follows (system-like).</p>
      </div>
      <div class="section">
        <h3>Custom food</h3>
        <div class="add">
          <input id="new-food" placeholder="Add food (e.g. Granola)" />
          <button id="add-food-btn" class="add-btn">Add</button>
        </div>
      </div>
    </aside>

    <div class="fridge-wrap" role="application" aria-label="Stern Fridge">
      <div class="fridge" id="fridge">

        <div class="meta" id="meta"></div>
        <!-- fridge door (starts closed) -->
        <div class="door" id="door" role="button" aria-label="Fridge door"></div>

        <div class="shelf top" data-shelf="top">
          <div class="glow"></div>
          <div class="bar"></div>
          <div class="item" data-item="Coke" tabindex="0">Coke</div>
          <div class="item" data-item="Ice Cream" tabindex="0">Ice Cream</div>
          <div class="item" data-item="Chocolate" tabindex="0">Chocolate</div>
        </div>

        <div class="shelf mid" data-shelf="mid">
          <div class="glow"></div>
          <div class="bar"></div>
          <div class="item" data-item="Spinach" tabindex="0">Spinach</div>
          <div class="item" data-item="Yogurt" tabindex="0">Yogurt</div>
          <div class="item" data-item="Leftovers" tabindex="0">Leftovers</div>
        </div>

        <div class="shelf bot" data-shelf="bot">
          <div class="glow"></div>
          <div class="bar"></div>
          <!-- third shelf intentionally left empty for balance (no text allowed inside shelves) -->
        </div>

      </div>

      <!-- response area BELOW the fridge, centered, outside the fridge element -->
      <div class="response-area">
        <div class="crit" id="crit"></div>
        <div class="proc" id="proc">processing<span id="proc-dots">.</span></div>
        <div class="pred" id="pred"></div>
      </div>

      <!-- behavior log panel (outside and to the right) -->
      <div class="log" aria-label="Behavior Log">
        <div class="title">Behavior</div>
        <button id="reset-btn" class="reset-btn" aria-label="Reset counts">Reset</button>
        <div class="pattern-status">
          <div id="pattern-text" class="pattern-text">No pattern detected</div>
        </div>
        <ul id="log"></ul>
      </div>

      </div>
    </div>
  </div>

  <script>
  (function(){
    const ITEMS = ['Coke','Ice Cream','Chocolate','Spinach','Yogurt','Leftovers'];
    const elements = Array.from(document.querySelectorAll('.item'));
    const critEl = document.getElementById('crit');
    const predEl = document.getElementById('pred');
    const procEl = document.getElementById('proc');
    const procDots = document.getElementById('proc-dots');
    const logEl = document.getElementById('log');
    const metaEl = document.getElementById('meta');
    const cursor = document.getElementById('cursor');

    const STORAGE = 'stern_fridge_v2_counts';
    let counts = JSON.parse(localStorage.getItem(STORAGE) || '{}');
    ITEMS.forEach(k=>counts[k]=counts[k]||0);
    let totalInteractions = Object.values(counts).reduce((a,b)=>a+b,0);

    // varied critique modes by item with escalation (arrays larger than 4)
    const critiques = {
      'Coke': [
        'Another soda.',
        'Second Coke today.',
        'Third Coke today. This is becoming a pattern.',
        'You keep returning to sugar even when you know what follows.',
        'This no longer reads as preference; it reads as compulsion.'
      ],
      'Ice Cream': [
        'A scoop for later.',
        'Ice cream again — frequency rising.',
        'The ice cream is disappearing faster this week.',
        'Cold sweetness as refuge — the pattern deepens.',
        'You reach for cold sugar when other things discomfort you.'
      ],
      'Chocolate': [
        'Chocolate noted.',
        'Another piece of chocolate.',
        'You seem to prefer sugar over everything else.',
        'This habit of sweets repeats with little resistance.',
        'Predictable sugar-seeking; model accuracy increasing.'
      ],
      'Spinach': [
        'Spinach — sensible.',
        'A second leafy choice today.',
        'You choose greens intermittently.',
        'Occasional virtue, inconsistent pattern.',
        'Healthful outliers observed; not yet a trend.'
      ],
      'Yogurt': [
        'Yogurt, practical.',
        'Another yogurt — predictable.',
        'Practical choices stacking up.',
        'Routine consumption observed; predictability rising.',
        'You favor convenience that resembles habit.'
      ],
      'Leftovers': [
        'Leftovers rescued.',
        'Again with leftovers.',
        'Rescued dinner becomes a fallback.',
        'This reliance on leftovers looks like avoidance.',
        'Pattern detected: repetitive fallback behavior.'
      ]
    };

    const critiqueModes = [
      name=>`Observational: ${name}`,
      name=>`Statistical: ${name}`,
      name=>`Suspicious: ${name}`,
      name=>`Confrontational: ${name}`,
      name=>`System: ${name}`
    ];

    const predictions = {
      'Coke': [
        'Another visit is likely within the hour.',
        'Late-night return for sugar is probable.',
        'You may be thirsty again in two hours.'
      ],
      'Ice Cream': [
        'A similar choice is likely later tonight.',
        'Cold sweetness tends to repeat for you.',
        'This choice often precedes late snacking.'
      ],
      'Chocolate': [
        'You might reach for another piece soon.',
        'This behavior tends to repeat at evening hours.',
        'Short-term relapse to sweets is likely.'
      ],
      'Spinach': [
        'Healthy choices may cluster into a meal.',
        'You might pair this with a sensible dinner.',
        'This choice slightly reduces later snacking.'
      ],
      'Yogurt': [
        'A light snack pattern continues.',
        'Predictable morning habit likely.',
        'You may select another convenience item soon.'
      ],
      'Leftovers': [
        'A similar choice is likely tomorrow.',
        'This fallback predicts repeated behavior.',
        'You often repeat this within 24 hours.'
      ]
    };

    const metaMessages = [
      'Pattern detected.',
      'Prediction confidence increasing.',
      'Your habits are becoming easier to model.',
      'Model update: greater certainty.'
    ];

    function renderLog(){
      logEl.innerHTML='';
      ITEMS.forEach(name=>{
        const li = document.createElement('li');
        li.innerHTML = `<span>${name}</span><span class="count">${counts[name]}</span>`;
        logEl.appendChild(li);
      });
    }

    /* fridge, pattern status, and interactive helpers */
    const fridgeEl = document.getElementById('fridge');
    const shelfMid = document.querySelector('.shelf.mid');
    const patternText = document.getElementById('pattern-text');
    const addFoodInput = document.getElementById('new-food');
    const addFoodBtn = document.getElementById('add-food-btn');

    function updatePatternStatus(){
      const maxCount = Math.max(...Object.values(counts));
      const conf = Math.min(1, (maxCount/6) + (totalInteractions/40));
      // set CSS var for visual tweaks
      document.documentElement.style.setProperty('--confidence', String(conf));
      // map to textual status
      let status = 'No pattern detected';
      if(conf < 0.25) status = 'No pattern detected';
      else if(conf < 0.5) status = 'Pattern forming';
      else if(conf < 0.75) status = 'Pattern stabilizing';
      else status = 'Pattern confirmed';
      if(patternText) patternText.textContent = status;
      // subtle mood shift
      if(conf > 0.6) fridgeEl.classList.add('tense'); else fridgeEl.classList.remove('tense');
    }

    // initial status render
    updatePatternStatus();

    // spotlight helper: set variables on fridge based on element center
    function setSpotlightFor(el){
      if(!el) {fridgeEl.style.removeProperty('--spot-x'); fridgeEl.style.removeProperty('--spot-y'); return}
      const r = el.getBoundingClientRect();
      const f = fridgeEl.getBoundingClientRect();
      const cx = ((r.left + r.right)/2 - f.left) / f.width * 100;
      const cy = ((r.top + r.bottom)/2 - f.top) / f.height * 100;
      fridgeEl.style.setProperty('--spot-x', cx + '%');
      fridgeEl.style.setProperty('--spot-y', cy + '%');
    }
    // add custom food
    if(addFoodBtn && addFoodInput){
      addFoodBtn.addEventListener('click', ()=>{
        const v = (addFoodInput.value || '').trim(); if(!v) return;
        if(ITEMS.includes(v)) { addFoodInput.value=''; return; }
        ITEMS.push(v);
        counts[v]=0;
        // append to mid shelf
        const node = document.createElement('div'); node.className='item'; node.dataset.item=v; node.tabIndex=0; node.textContent=v;
        // wire events same as others
        hookItem(node);
        shelfMid.appendChild(node);
        renderLog(); updateConfidence(); addFoodInput.value='';
      });
    }

    // attach behaviors to items (used for dynamically created ones too)
    function hookItem(el){
      el.addEventListener('mouseenter', ()=>{ cursor.classList.add('tight'); setSpotlightFor(el); });
      el.addEventListener('mouseleave', ()=>{ cursor.classList.remove('tight'); /* reset spotlight */ });

      // pointer interactions: pull/drag feel
      let isDown=false, startX=0, startY=0;
      el.addEventListener('pointerdown', e=>{
        isDown=true; startX=e.clientX; startY=e.clientY; el.setPointerCapture(e.pointerId);
        el.classList.add('surface');
      });
      el.addEventListener('pointermove', e=>{
        if(!isDown) return;
        const dx = Math.max(-24, Math.min(24, e.clientX - startX));
        const dy = Math.max(-24, Math.min(24, e.clientY - startY));
        el.style.transform = `translate(${dx}px, ${-22 + dy/6}px) scale(1.06) rotate(${dx/12}deg)`;
      });
      el.addEventListener('pointerup', e=>{
        isDown=false; try{ el.releasePointerCapture(e.pointerId);}catch(_){}
        el.style.transform=''; setTimeout(()=>el.classList.remove('surface'),240);
      });

      el.addEventListener('click', e=>{
        // stronger ripple and spotlight
        const r = document.createElement('div'); r.className='ripple'; document.body.appendChild(r);
        r.style.left = (e.clientX)+'px'; r.style.top = (e.clientY)+'px';
        setTimeout(()=>r.remove(),750);
        cursor.classList.add('pulse'); setTimeout(()=>cursor.classList.remove('pulse'),380);

        setSpotlightFor(el);
        handleInteraction(el);
        // update confidence after interaction
        setTimeout(()=>updateConfidence(), 300);
      });

      el.addEventListener('keydown', ev=>{ if(ev.key==='Enter' || ev.key===' '){ ev.preventDefault(); el.click(); } });
    }

    // wire existing items
    elements.forEach(hookItem);

    // helper random
    function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

    // show critique (stage 1) then prediction (stage 2)
    function handleInteraction(el){
      const name = el.dataset.item;
      counts[name] = (counts[name]||0)+1;
      totalInteractions += 1;
      localStorage.setItem(STORAGE, JSON.stringify(counts));
      renderLog();

      // visual: surface and glow shelf
      clearActive();
      el.classList.add('surface');
      const shelf = el.closest('.shelf'); if(shelf) shelf.classList.add('glowing');

      // stage 1: critique immediate
      const ccount = counts[name];
      const idx = Math.min(ccount-1, critiques[name].length-1);
      // vary mode
      const modeRoll = Math.random();
      let critiqueText = critiques[name][idx];
      if(modeRoll < 0.18){ // suspicious
        critiqueText = `Suspicious — ${critiqueText}`;
        critEl.classList.add('sharp');
      } else if(modeRoll < 0.36){ // statistical
        critEl.classList.remove('sharp');
        critiqueText = `Statistical — ${critiqueText}`;
      } else if(modeRoll < 0.5){
        critEl.classList.add('sharp');
        critiqueText = `Confrontational — ${critiqueText}`;
      } else {
        critEl.classList.remove('sharp');
      }

      // show critique
      critEl.textContent = critiqueText;
      critEl.classList.add('show');
      predEl.classList.remove('show');
      procEl.classList.remove('show');

      // occasional meta message
      if(Math.random() < 0.18 && totalInteractions > 3){
        metaEl.textContent = pick(metaMessages);
        metaEl.classList.add('show');
        setTimeout(()=>metaEl.classList.remove('show'), 2200 + Math.random()*1200);
      }

      // pacing: after short pause, processing, then prediction
      setTimeout(()=>{
        // hide critique, show processing
        critEl.classList.remove('show');
        procEl.classList.add('show');
        // animate dots
        let dots = 0; const dotInt = setInterval(()=>{procDots.textContent = '.'.repeat((++dots)%4);},220);

        // scanning visual: small subtle delay then prediction
        setTimeout(()=>{
          clearInterval(dotInt); procDots.textContent='.';
          procEl.classList.remove('show');

          // prediction chosen
          const pred = pick(predictions[name]);
          predEl.textContent = pred;
          predEl.classList.add('show');
          predEl.classList.add('scan');
          setTimeout(()=>predEl.classList.remove('scan'), 1200);

          // update pattern status after prediction
          updatePatternStatus();

          // after a moment, clear surface but keep prediction visible briefly
          setTimeout(()=>{
            el.classList.remove('surface');
            if(shelf) shelf.classList.remove('glowing');
          },900);

        }, 900 + Math.random()*700);

      }, 420 + Math.random()*260);

    }

    function clearActive(){
      document.querySelectorAll('.item.surface').forEach(n=>n.classList.remove('surface'));
      document.querySelectorAll('.shelf.glowing').forEach(s=>s.classList.remove('glowing'));
      critEl.classList.remove('show'); predEl.classList.remove('show'); procEl.classList.remove('show');
    }

    // cursor behavior
    document.addEventListener('mousemove', e=>{
      cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px';
    });
    document.addEventListener('mouseenter', ()=>cursor.style.opacity = 1);

    // door interactions: open/close with click or drag
    const door = document.getElementById('door');
    let doorAngle = 0; // 0 closed, -95 opened
    let doorDragging = false; let doorStartX = 0; let doorStartAngle = 0;
    function setDoorAngle(a){ doorAngle = Math.max(-100, Math.min(0, a)); door.style.transform = `rotateY(${doorAngle}deg)`; if(doorAngle < -40) fridgeEl.classList.add('open'); else fridgeEl.classList.remove('open'); }
    if(door){
      // start closed
      door.style.transformOrigin = 'left center';
      door.style.backfaceVisibility = 'hidden';
      door.style.transform = 'rotateY(0deg)';
      door.addEventListener('pointerdown', e=>{
        doorDragging = true; doorStartX = e.clientX; doorStartAngle = doorAngle; door.setPointerCapture(e.pointerId);
      });
      document.addEventListener('pointermove', e=>{
        if(!doorDragging) return;
        const dx = e.clientX - doorStartX; // positive to right
        const delta = dx / 3; // sensitivity
        setDoorAngle(doorStartAngle - delta);
      });
      document.addEventListener('pointerup', e=>{
        if(!doorDragging) return; doorDragging = false; try{ door.releasePointerCapture(e.pointerId);}catch{};
        // snap open if angle beyond threshold
        if(doorAngle < -45) setDoorAngle(-95); else setDoorAngle(0);
      });
      // click toggles
      door.addEventListener('click', ()=>{
        if(fridgeEl.classList.contains('open')) setDoorAngle(0); else setDoorAngle(-95);
      });
    }

    const resetBtn = document.getElementById('reset-btn');

    // items are wired via hookItem (to support dynamic additions)

    // initial render
    renderLog();
    updatePatternStatus();

    // reset handler
    if(resetBtn){
      resetBtn.addEventListener('click', ()=>{
        if(!confirm('Reset all counts to zero?')) return;
        ITEMS.forEach(k=>counts[k]=0);
        totalInteractions = 0;
        localStorage.setItem(STORAGE, JSON.stringify(counts));
        renderLog();
        updateConfidence();
        critEl.classList.remove('show'); predEl.classList.remove('show'); procEl.classList.remove('show');
        metaEl.textContent = 'Counts reset.'; metaEl.classList.add('show');
        setTimeout(()=>metaEl.classList.remove('show'),1400);
      });
    }

    // small boot message
    setTimeout(()=>{ metaEl.textContent='System active.'; metaEl.classList.add('show'); setTimeout(()=>metaEl.classList.remove('show'),1600); }, 900);

  })();
  </script>
</body>
</html>
