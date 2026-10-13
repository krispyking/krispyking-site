const root=document.documentElement,button=document.getElementById('theme');
let theme=matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light';
function update(){root.dataset.theme=theme;button.textContent=theme==='dark'?'Light mode':'Dark mode';button.setAttribute('aria-label',`Switch to ${theme==='dark'?'light':'dark'} mode`);}
button.addEventListener('click',()=>{theme=theme==='dark'?'light':'dark';update();});
update();
