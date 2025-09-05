// Smooth scroll
document.querySelectorAll('[data-scroll]').forEach(btn=>{
  btn.addEventListener('click', e=>{
    const target = document.querySelector(btn.getAttribute('data-scroll'));
    if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
    const pkg = btn.getAttribute('data-package');
    if(pkg){const sel=document.querySelector('select[name="package"]'); if(sel) sel.value = pkg;}
  });
});

// Countdown: 48 hours from first visit (stored in localStorage)
(function(){
  const KEY='yb_deadline';
  let deadline = localStorage.getItem(KEY);
  if(!deadline){
    const d = new Date();
    d.setHours(d.getHours()+48);
    deadline = d.toISOString();
    localStorage.setItem(KEY, deadline);
  }
  function tick(){
    const end = new Date(localStorage.getItem(KEY));
    const now = new Date();
    let diff = Math.max(0, end - now);
    const s = Math.floor(diff/1000)%60;
    const m = Math.floor(diff/60000)%60;
    const h = Math.floor(diff/3600000)%24;
    const dleft = Math.floor(diff/86400000);
    const set = (id,val)=>{const el=document.getElementById(id); if(el) el.textContent = String(val).padStart(2,'0');}
    set('d', dleft); set('h', h); set('m', m); set('s', s);
  }
  tick(); setInterval(tick, 1000);
})();

// Order form submission (demo: prints to console). Plug in your endpoint in POST_URL.
const POST_URL = ''; // e.g. 'https://your-backend.example/api/orders' or Formspree endpoint
const form = document.getElementById('orderForm');
const thankyou = document.getElementById('thankyou');

if(form){
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    // client-side guard for Nigerian phone format
    const phoneOk = /^(\+?234|0)[7-9][01]\d{8}$/.test(data.phone || '');
    if(!phoneOk){
      alert('Please enter a valid Nigerian phone number (e.g., +2348012345678).');
      return;
    }

    if(!POST_URL){
      console.log('Order payload (no endpoint set):', data);
      form.hidden = true;
      thankyou.hidden = false;
      window.scrollTo({top: thankyou.offsetTop - 80, behavior:'smooth'});
      return;
    }

    try{
      const res = await fetch(POST_URL, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
      });
      if(!res.ok) throw new Error('Failed');
      form.hidden = true;
      thankyou.hidden = false;
      window.scrollTo({top: thankyou.offsetTop - 80, behavior:'smooth'});
    }catch(err){
      alert('Could not place order. Please try again or contact support.');
      console.error(err);
    }
  });
}

document.getElementById('year').textContent = new Date().getFullYear();
