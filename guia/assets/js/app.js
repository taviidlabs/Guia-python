const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
const CL=[['Bienvenida a Python','Qué es Python y por qué aprenderlo'],['Instalación y print()','Intérprete, VS Code, sep y end'],['Variables y datos','Tipos, input, listas, tuplas y diccionarios'],['Decisiones, bucles y funciones','if, for, while y def'],['Tu primera ventana','Tkinter: Label, Entry y Button'],['Errores y diálogos','messagebox y try/except'],['Datos del mundo','APIs, JSON y Excel'],['SQLite y proyecto final','SQLite, CRUD, login y dashboard completo'],['Empaquetado y Manim','PyInstaller y animación con Manim']];
const COL=['#6ee7ff','#4ade80','#facc15','#a78bfa','#f472b6','#fb923c','#2dd4bf','#60a5fa','#f87171'],AV=[0,1,2,3,4,5,6,7,8];
const get=()=>{try{return JSON.parse(localStorage.visitadas||'[]')}catch(e){return[]}};
const mark=n=>{const v=get();if(!v.includes(n)){v.push(n);try{localStorage.visitadas=JSON.stringify(v)}catch(e){}}};
const rg=$('#rango');if(rg)rg.textContent='Rango: '+['Cadete','Piloto','Navegante','Comandante'][Math.min(3,Math.floor(get().length/3))];
const ru=$('#ruta');
if(ru){ru.innerHTML=CL.map((c,i)=>{const n=i+1,on=AV.includes(i);return `<${on?'a href="clases/clase_'+n+'.html"':'div'} class="pl rv ${on?'on':'off'} ${get().includes(n)?'done':''}" style="--c:${COL[i]}"><span class="dot">${n}</span><span class="pc"><b>${c[0]}</b><small>${on?c[1]:'Próximamente'}</small></span></${on?'a':'div'}>`}).join('');
addEventListener('scroll',()=>ru.style.setProperty('--p',Math.max(0,Math.min(1,(scrollY+innerHeight*.6-ru.offsetTop)/ru.offsetHeight))),{passive:true})}
(()=>{const c=$('#stars'),x=c.getContext('2d');let w,h,S=[],mx=0,my=0,cx=-999,cy=-999;
const R=()=>{w=c.width=innerWidth;h=c.height=innerHeight;S=Array.from({length:Math.min(160,w/8)},()=>({x:Math.random()*w,y:Math.random()*h,z:Math.random()*.8+.2}))};
const D=()=>{x.clearRect(0,0,w,h);for(const s of S){if(!RM)s.y=(s.y+s.z*.15)%h;const px=s.x+mx*s.z*20,py=s.y+my*s.z*20,d=Math.hypot(px-cx,py-cy),g=d<120?1+(1-d/120)*3:1;x.globalAlpha=Math.min(1,(.3+s.z*.6)*g);x.fillStyle=g>1?'#9fe9ff':'#cfe8ff';x.fillRect(px,py,s.z*1.8*g,s.z*1.8*g)}if(!RM)requestAnimationFrame(D)};
addEventListener('resize',R);addEventListener('mousemove',e=>{mx=e.clientX/w-.5;my=e.clientY/h-.5;cx=e.clientX;cy=e.clientY});R();D()})();
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
const hl=s=>esc(s).replace(/(#.*)|("[^"\n]*"|'[^'\n]*')|\b(def|class|if|elif|else|for|in|while|return|import|True|False)\b|\b(print|range|input|int|len|max|min|sum)(?=\()|\b(\d+(?:\.\d+)?)\b/g,(m,c,s,k,f,n)=>c?`<span class=c>${c}</span>`:s?`<span class=s>${s}</span>`:k?`<span class=k>${k}</span>`:f?`<span class=f>${f}</span>`:`<span class=n>${n}</span>`);
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.15});
$$('.rv').forEach(e=>io.observe(e));
$$('.win[data-f]').forEach(w=>{w.insertAdjacentHTML('afterbegin',`<div class="bar"><i></i><i></i><i></i><span>${w.dataset.f}</span><button class="cp">⧉</button></div>`);if(w.dataset.o!=null)w.insertAdjacentHTML('beforeend',`<div class="out">$ python ${w.dataset.f.split('/').pop()}\n${w.dataset.o}</div>`)});
$$('.win:has(code)').forEach(w=>{const code=$('code',w),full=code.textContent.replace(/\n$/,''),ty=code.hasAttribute('data-type')&&!RM&&full.split('\n').length<=14;
const sr=document.createElement('span');sr.className='visually-hidden';sr.textContent=full;code.before(sr);code.setAttribute('aria-hidden','true');
const show=n=>code.innerHTML=hl(full.slice(0,n))+(code.hasAttribute('data-type')?'<span class=cur></span>':'');
let t;const play=()=>{clearInterval(t);let i=0;t=setInterval(()=>{show(i+=2);if(i>=full.length)clearInterval(t)},28)};
show(full.length);
if(ty){show(0);new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){o.disconnect();play()}},{threshold:.4}).observe(w)}
$('.rp',w)?.addEventListener('click',play);
$('.cp',w)?.addEventListener('click',e=>{navigator.clipboard?.writeText(full);e.target.textContent='✓';setTimeout(()=>e.target.textContent='⧉',1200)})});
$$('.opt').forEach(b=>b.onclick=()=>{const ok=b.hasAttribute('data-ok');b.classList.add(ok?'ok':'no');if(ok){$('#fb').textContent=$('#fb').dataset.ok;$$('.opt').forEach(o=>o.disabled=true)}else $('#fb').textContent=$('#fb').dataset.no});
const pg=$('#pg');if(pg)addEventListener('scroll',()=>{const p=scrollY/(document.body.scrollHeight-innerHeight);pg.style.width=p*100+'%';if(p>.9)mark(+document.body.dataset.n)},{passive:true});
const lt=$$('.lt[data-lottie]');
if(lt.length&&location.protocol!='file:'){const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js';s.onload=()=>lt.forEach(el=>fetch(el.dataset.lottie).then(r=>r.json()).then(d=>{el.innerHTML='';el.style.animation='none';lottie.loadAnimation({container:el,animationData:d,loop:true,autoplay:!RM})}).catch(()=>{}));document.head.append(s)}

(()=>{const c=$('#con');if(!c)return;const x=c.getContext('2d'),v=get(),hero=c.parentElement;let w,h,t=0,mx=-99,my=-99,H=-1;
const R=()=>{w=c.width=c.offsetWidth;h=c.height=c.offsetHeight};R();addEventListener('resize',R);
const N=i=>[w*(.08+i*.105),h*(.2+.1*Math.sin(i*.9+.4))];
hero.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;if(RM)D()});
hero.addEventListener('mouseleave',()=>{mx=my=-99;if(RM)D()});
hero.addEventListener('click',()=>{if(AV.includes(H))location.href='clases/clase_'+(H+1)+'.html'});
const D=()=>{x.clearRect(0,0,w,h);t=Math.min(8,t+(RM?8:.04));x.font='12px JetBrains Mono,monospace';H=-1;
const P=Array.from({length:9},(_,i)=>N(i));P.forEach(([a,b],i)=>{if(Math.hypot(a-mx,b-my)<28)H=i});
x.strokeStyle='#ffffff66';x.lineWidth=1;
for(let i=1;i<9&&i<t;i++){const[p,q]=P[i-1],[a,b]=P[i],f=Math.min(1,t-i+1);x.beginPath();x.moveTo(p,q);x.lineTo(p+(a-p)*f,q+(b-q)*f);x.stroke()}
P.forEach(([a,b],i)=>{const d=Math.hypot(a-mx,b-my);if(d<190){x.strokeStyle=`rgba(110,231,255,${.7*(1-d/190)})`;x.beginPath();x.moveTo(a,b);x.lineTo(mx,my);x.stroke()}});
P.forEach(([a,b],i)=>{const o=i==H,k=o?1.9:1;x.globalAlpha=i<=t?1:.2;
if(o){const g=x.createRadialGradient(a,b,0,a,b,36);g.addColorStop(0,'#6ee7ff88');g.addColorStop(1,'#6ee7ff00');x.fillStyle=g;x.fillRect(a-36,b-36,72,72)}
x.fillStyle=o?'#6ee7ff':'#fff';x.fillRect(a-7*k,b-.5,14*k,1.2);x.fillRect(a-.6,b-7*k,1.2,14*k);x.fillText(i+1,a+9*k,b-9*k);
if(v.includes(i+1)){x.strokeStyle='#fff';x.beginPath();x.arc(a,b,12,0,6.3);x.stroke()}
if(o){x.fillStyle='#fff';x.font='700 13px Space Grotesk,sans-serif';x.fillText(CL[i][0]+(AV.includes(i)?'  →':'  ·  próximamente'),a+14,b+24);x.font='12px JetBrains Mono,monospace'}x.globalAlpha=1});
c.style.cursor=AV.includes(H)?'pointer':'default';hero.style.cursor=AV.includes(H)?'pointer':'';
if(!RM)requestAnimationFrame(D)};D()})();
$$('[data-c]').forEach(e=>new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){o.disconnect();let i=0;const m=+e.dataset.c,t=setInterval(()=>{e.textContent=Math.min(m,++i);if(i>=m)clearInterval(t)},RM?1:140)}}).observe(e));
const dv=$('#dv');if(dv){const P=[['Arroz 1kg',8.5],['Azúcar 1kg',7.8],['Aceite Fino 900ml',15],['Leche PIL 1L',6.5]],ET=['una ventana con un botón que cuenta clics','formulario con Entry, Label y Button','tabla (Treeview) y mensajes de aviso','productos cargados desde JSON, API o Excel','SQLite: guardar, editar y borrar, con gráfico y Excel'];
const tb=n=>'<table class="mt2"><tr><th>ID</th><th>Producto</th><th>Precio</th></tr>'+P.slice(0,n).map((p,i)=>`<tr><td>${i+1}</td><td>${p[0]}</td><td>Bs${p[1].toFixed(2)}</td></tr>`).join('')+'</table>';
const V=['<button class="mb">Clicks: 0</button>','<input class="mi" placeholder="Nombre"><input class="mi" placeholder="Edad"><button class="mb">Saludar</button>',tb(2),tb(4),tb(4)+'<div class="bars">'+P.map(p=>`<i style="width:${p[1]*6}%"></i>`).join('')+'</div><button class="mb">Exportar Excel</button><button class="mb">Agregar</button>'];
let k=0,T;const f=()=>{dv.classList.remove('sw');void dv.offsetWidth;dv.innerHTML=V[k];dv.classList.add('sw');$('#dt').textContent='Clase '+(k+4)+': '+ET[k];$$('#dots button').forEach((b,i)=>b.classList.toggle('on',i==k))};
const go=n=>{k=(n+5)%5;f()},reset=()=>{clearInterval(T);if(!RM)T=setInterval(()=>go(k+1),5000)};
$('#dots').innerHTML=ET.map((e,i)=>`<button aria-label="Clase ${i+4}">${i+4}</button>`).join('');
$$('#dots button').forEach((b,i)=>b.onclick=()=>{go(i);reset()});
$('#pv').onclick=()=>{go(k-1);reset()};$('#nx2').onclick=()=>{go(k+1);reset()};
const dm=$('#dm');dm.addEventListener('mouseenter',()=>clearInterval(T));dm.addEventListener('mouseleave',reset);
let x0;dm.addEventListener('touchstart',e=>x0=e.touches[0].clientX,{passive:true});dm.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-x0;if(Math.abs(d)>40){go(k+(d<0?1:-1));reset()}});
go(0);reset()}
if(document.body.dataset.n){const m=$('main.sec'),S=$$('main.sec>section'),a=document.createElement('aside');a.className='side';
a.innerHTML='<b>En esta clase</b><nav>'+S.map((s,i)=>{s.id='s'+i;return `<a href="#s${i}">${$('h2',s).textContent}</a>`}).join('')+'</nav>';m.prepend(a);
const L=$$('a',a),o=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)L.forEach(l=>l.classList.toggle('on',l.getAttribute('href')=='#'+e.target.id))}),{rootMargin:'-30% 0px -60% 0px'});S.forEach(s=>o.observe(s))}

const tg=$('#tg');if(tg){const S={l:1,e:0,b:0};
const gen=()=>{let c='import tkinter as tk\n\nventana = tk.Tk()\nventana.title("Mi primera ventana")\nventana.geometry("320x240")\n\n';
if(S.l)c+='etiqueta = tk.Label(ventana, text="¿Cómo te llamas?", font=("Arial", 14))\netiqueta.pack(pady=10)\n\n';
if(S.e)c+='entrada = tk.Entry(ventana)\nentrada.pack()\n\n';
if(S.b)c+='def saludar():\n    '+(S.l&&S.e?'etiqueta.config(text="Hola, " + entrada.get() + "!")':S.l?'etiqueta.config(text="¡Hola!")':S.e?'print(entrada.get())':'print("¡Hola!")')+'\n\nboton = tk.Button(ventana, text="Saludar", command=saludar)\nboton.pack(pady=10)\n\n';
return c+'ventana.mainloop()'};
const R=()=>{const v=$('#pe')?.value||'';$('#pvw').innerHTML='<div class="tkw"><div class="tkt">Mi primera ventana</div><div class="tkb">'+(S.l?'<div id="pl" class="tkl">¿Cómo te llamas?</div>':'')+(S.e?'<input id="pe" class="tke" aria-label="Entry">':'')+(S.b?'<button id="pb" class="tkn">Saludar</button>':'')+'</div></div>';
if($('#pe'))$('#pe').value=v;$('#bc').innerHTML=hl(gen());$('#pt').textContent='';
if($('#pb'))$('#pb').onclick=()=>{if(S.l)$('#pl').textContent=S.e?'Hola, '+$('#pe').value+'!':'¡Hola!';else $('#pt').textContent='La terminal imprime: '+(S.e?$('#pe').value:'¡Hola!')}};
$$('button',tg).forEach(b=>b.onclick=()=>{const k=b.dataset.w;S[k]=S[k]?0:1;b.setAttribute('aria-pressed',!!S[k]);R()});R()}
const run=$('#run');if(run){const ck=$('#ck'),o=$('#lo'),C0='numero = int(input("número: "))\nresultado = 10 / numero\nprint("Resultado:", resultado)',C1='try:\n    numero = int(input("número: "))\n    resultado = 10 / numero\n    print("Resultado:", resultado)\nexcept ValueError:\n    print("Debes ingresar solo números")\nexcept ZeroDivisionError:\n    print("No se puede dividir entre cero")\nexcept Exception as e:\n    print("Error general:", e)';
const sh=()=>$('#lc').innerHTML=hl(ck.checked?C1:C0);ck.onchange=sh;sh();
run.onclick=()=>{const A=$('#ia').value;let tr;if(!/^\s*[+-]?\d+\s*$/.test(A))tr=['ValueError',`invalid literal for int() with base 10: '${A}'`,1,'numero = int(input("número: "))'];else if(+A==0)tr=['ZeroDivisionError','division by zero',2,'resultado = 10 / numero'];
if(!tr){const r=10/+A;o.className='tr okb';o.textContent='Resultado: '+(Number.isInteger(r)?r.toFixed(1):r);return}
if(ck.checked){o.className='tr okb';o.textContent=tr[0]=='ValueError'?'Debes ingresar solo números':'No se puede dividir entre cero';return}
o.className='tr';o.textContent=`Traceback (most recent call last):\n  File "calculadora.py", line ${tr[2]}, in <module>\n    ${tr[3]}\n${tr[0]}: ${tr[1]}`;if(tr[0]=='ZeroDivisionError')egg('z6')}}
const dg=$('#dg');if(dg){const DG=[['showinfo','ℹ️','Información','Guardado correctamente',['Aceptar']],['showwarning','⚠️','Advertencia','Faltan campos por llenar',['Aceptar']],['showerror','❌','Error','No se puede dividir entre cero',['Aceptar']],['askyesno','❓','Confirmar','¿Eliminar el producto?',['Sí','No']],['askokcancel','❓','Confirmar','¿Continuar con la operación?',['Aceptar','Cancelar']],['askretrycancel','⚠️','Error de conexión','No se pudo conectar. ¿Reintentar?',['Reintentar','Cancelar']]];
dg.innerHTML=DG.map((d,i)=>`<button data-i="${i}">${d[0]}</button>`).join('');
$$('button',dg).forEach(b=>b.onclick=()=>{const d=DG[b.dataset.i],ov=document.createElement('div');(window.pr=window.pr||new Set()).add(b.dataset.i);if(pr.size==6){egg('t6');pr.clear()}ov.className='ovl';ov.innerHTML=`<div class="dlg" role="dialog" aria-label="${d[2]}"><h4>${d[2]}</h4><div class="bd"><span class="ic">${d[1]}</span><span>${d[3]}</span></div><div class="bt">${d[4].map((t,j)=>`<button data-j="${j}">${t}</button>`).join('')}</div></div>`;document.body.append(ov);
$$('.bt button',ov).forEach(x=>x.onclick=()=>{const v=d[4].length==1?"'ok'":(x.dataset.j==0?'True':'False');$('#dr').textContent=`messagebox.${d[0]}(...) devolvió: ${v}`;ov.remove()});$('.bt button',ov).focus()})}

$$('.tkw[data-m]').forEach(w=>{const m=+w.dataset.m,b=$('.tkb',w),T=(t,c)=>`<div class="tkl" ${c||''}>${t}</div>`;
b.innerHTML=['','<button class="tkn">Saludar</button><div class="tkl" style="font-size:.75rem;color:#666"></div>','<button class="tkn">Saludar</button>'+T(''),T('Nombre','style="background:#ab6a3b;color:#fff;padding:2px 10px"')+'<input class="tke">'+T('Edad','style="background:#5843d3;color:#fff;padding:2px 10px;font-size:.8rem"')+'<input class="tke"><button class="tkn" data-a="s">Saludar</button>'+T('','data-l="1"')+'<button class="tkn" data-a="c">Contar</button>'+T('Clicks: 0','data-l="2"')][m-1];
let n=0;$$('button',b).forEach(x=>x.onclick=()=>{const L=$$('.tkl',b);
if(m==2)L[0].textContent='En la terminal aparece: Hola desde el boton';
if(m==3)L[0].textContent='Hola desde el boton';
if(m==4){if(x.dataset.a=='s')$('[data-l="1"]',b).textContent='Hola '+$$('.tke',b)[0].value+' tu edad es de: '+$$('.tke',b)[1].value+' años';else{$('[data-l="2"]',b).textContent='Clicks: '+(++n);if(n==10)egg('d5')}}})});
const EN=+document.body.dataset.n;
const PROFE_MSG='Gracias por llegar hasta el final. Lo que aprendiste aquí es solo el comienzo: sigue practicando y crea tus propios proyectos.',PROFE_FIRMA='Deyvid Torrez · CESBOL Ingeniería';
const ALL=[
['konami',0,'konami',0,'Código Konami','↑↑↓↓←→←→BA… ¡vidas extra para tu código!','Los videojuegos clásicos tienen un código famoso.','Flechas: arriba, arriba, abajo, abajo, izquierda, derecha, izquierda, derecha; después las letras B y A.','{ }'],
['taviid',0,'type','taviid','El profe','dev = Taviid()\ncodigo activado ⚡','¿Cómo se llama quien te enseña?','Escribe con el teclado: taviid.','⚡'],
['sat',0,'click',['.sat',3],'Satélite en apuros','¡Houston, tenemos un bug! 🛰️','Alguien orbita sobre tu cabeza (en la portada).','En la portada, pulsa 3 veces el satélite.','🛰️🐞','sat'],
['bug',0,'api',0,'Cazador de bugs','Atrapaste 3 bugs. Tu código quedó más limpio 🐞','A veces algo con muchas patas se pasea por la pantalla.','Un bichito 🐞 cruza la pantalla de vez en cuando: púlsalo 3 veces (se cuentan entre visitas).','🐞'],
['anti',0,'type','antigravity','Antigravedad','Python tiene una librería que desafía a Newton: import antigravity','Hay una librería que desafía a Newton.','Escribe con el teclado: antigravity.','🚀','float'],
['braces',0,'type','braces','Sin llaves','SyntaxError: not a chance','Quienes vienen de otros lenguajes extrañan { }.','Escribe con el teclado: braces.','{ }'],
['e404',0,'api',0,'Página perdida',"NameError: name 'pagina' is not defined",'Escribe una dirección que no exista.','Cambia el final de la dirección del sitio por algo inventado y mira qué pasa (requiere que el sitio esté publicado).','❓'],
['consola',0,'type','serpiente','Mensaje en la consola','Encontraste la serpiente 🐍','Los programadores miran donde otros no.','Abre la consola del navegador con F12: hay un mensaje. Sigue sus instrucciones.','🐍'],
['p1',1,'type','python','El nombre','Python se llama así por el grupo Monty Python 🐍','¿Cómo se llama el lenguaje del curso? Escríbelo.','Escribe con el teclado: python.','🐍'],
['g1',1,'click',['.egg',1],'Guido','Guido van Rossum publicó Python en 1991','Alguien lo creó en 1991… busca una estrella cerca de su historia.','Busca una ✦ casi invisible junto al texto de 1991 y púlsala.','✦'],
['z1',1,'type','import this','El Zen','Lo simple es mejor que lo complejo. La legibilidad cuenta.','Hay un poema escondido que se invoca importando algo… ¿importando qué?','Escribe con el teclado: import this (con el espacio).','☯'],
['n2',2,'api',0,'Hola, mundo','El primer programa de todos los programadores 🌍','El primer programa de todos los programadores, en la terminal.','En la mini terminal del paso 6, escribe: print("hola mundo").','🌍'],
['c2',2,'click',['.egg',1],'La barra invertida','\\n cambia de línea… y esta estrella cambió tu día','Una barra invertida cambia de línea… busca la estrella en ese paso.','Busca una ✦ casi invisible junto al título del paso 5.','✦'],
['q2',2,'click',['.big',2],'Dos veces','02: ¡el doble de diversión!','El número de la clase, dos veces.','Pulsa 2 veces el número grande 02 del inicio.','2️⃣'],
['k3',3,'click',['.big',3],'La caja','Abriste la caja: ¡había un valor secreto! 📦','El número de la clase, tres veces, abre la caja.','Pulsa 3 veces el número grande 03.','📦'],
['d3',3,'click',['.egg',1],'Clave y valor','Un diccionario guarda secretos en pares clave: valor','Los diccionarios guardan secretos en pares: busca la estrella en su paso.','Busca una ✦ junto al título del paso de diccionarios.','✦'],
['p3',3,'type','3.14','Pi','π ≈ 3.14159…','Un círculo siempre pregunta por un número famoso: sus tres primeros dígitos.','Escribe con el teclado: 3.14','π'],
['b4',4,'type','break','La salida','break: ¡saliste del bucle!','Todo bucle necesita una salida. Escríbela.','Escribe con el teclado: break.','↩'],
['n4',4,'click',['.big',4],'Cuatro veces','for _ in range(4): ¡repetido!','El número de la clase repite lo que dice: cuatro veces.','Pulsa 4 veces el número grande 04.','🔁'],
['e4',4,'click',['.egg',1],'Alguien más','elif: el que vive entre el if y el else','Entre el if y el else hay alguien más… búscalo en el paso 4.','Busca una ✦ junto al título del paso 4.','✦'],
['nm4',4,'api',0,'Bucle infinito','Un while True sin break nunca termina…','Hay un botón con un mensaje poco amistoso al final de la clase.','Al final de la clase hay un botón «No me presiones»: púlsalo y luego detén lo que pase.','♾️'],
['m5',5,'type','mainloop','Palabra mágica','mainloop(): ¡la ventana sigue abierta!','Hay un mensaje para quien mira la consola (F12).','Escribe con el teclado: mainloop (la consola F12 también lo sugiere).','🪟'],
['c5',5,'click',['.bar i:first-child',3],'Ventana cerrada','Cerraste la ventana… pero era solo una demo 😅','Cierra una ventana… tres veces.','Pulsa 3 veces el punto rojo de la barra de cualquier ventana de código.','❌'],
['d5',5,'api',0,'Diez clics','contador = 10: ¡global funcionando!','Cuenta hasta diez con el botón de la ventana final.','En la ventana del paso 4, pulsa 10 veces el botón Contar.','🔟'],
['x6',6,'type','except','Atrapado','except: atrapaste el error 🪤','Cuando algo falla, siempre hay alguien esperando para atraparlo.','Escribe con el teclado: except.','🪤'],
['z6',6,'api',0,'Imposible','ZeroDivisionError: division by zero','¿Qué le pasa a Python cuando le pides algo imposible?','En el laboratorio del paso 3, deja el 0 y ejecuta sin proteger con try/except.','💥'],
['t6',6,'api',0,'Seis formas','Seis formas de preguntar, y todas devuelven algo','Hay seis formas de preguntar. Prueba todas.','En el paso 2, pulsa los seis botones de diálogos.','❓'],
['pk7',7,'type','pikachu','Pikachu','Buscando a Pikachu en PokéAPI…','¿Quién es ese Pokémon? El amarillo más famoso.','Escribe con el teclado: pikachu.','⚡'],
['k7',7,'click',['.egg',1],'La llave','Nunca compartas tu clave 🔑','Una clave no se comparte… busca la llave escondida en su paso.','Busca una ✦ junto al título del paso 8.','🔑'],
['n7',7,'click',['.big',7],'Siete veces','7 clases, 7 veces: ¡suerte!','El número de la clase, siete veces.','Pulsa 7 veces el número grande 07.','🍀'],
['s8',8,'type','select','SELECT','SELECT * FROM estrellas;','La palabra que pide datos a una tabla.','Escribe con el teclado: select.','🗄️'],
['d8',8,'click',['.egg',1],'Id vacío','El número de una fila borrada no se reutiliza','Una fila borrada deja su número vacío para siempre… busca la estrella.','Busca una ✦ junto al título del paso 2.','✦'],
['n8',8,'click',['.big',8],'Ocho veces','8 es infinito de costado ♾️','El número de la clase, ocho veces.','Pulsa 8 veces el número grande 08.','♾️'],
['m9',9,'type','manim','Animador','Manim: ¡las matemáticas en movimiento! 🎬','El nombre de la librería de animaciones.','Escribe con el teclado: manim.','🎬'],
['q9',9,'click',['.mq',3],'La figura azul','Cuadrado, círculo… ¡y ahora tú también te transformas!','Toca la figura azul tres veces.','En el paso 9, pulsa 3 veces la figura azul de la animación.','🔷'],
['f9',9,'type','felicidades','Felicidades','¡Terminaste el curso! 🎉','El texto de la animación te felicita… escríbelo.','Escribe con el teclado: felicidades.','🎉'],
['ng9',9,'click',['.egg',1],'Nueva partida','New Game+: puedes reiniciar todos tus logros y buscar las estrellas otra vez.','Los videojuegos tienen un modo para empezar de nuevo… busca el botón escondido en la clase final.','Pulsa la ✦ casi invisible junto al título «Felicidades», al final de la clase 9.','🔄',0,1]
].map(a=>({id:a[0],c:a[1],k:a[2],a:a[3],t:a[4],m:a[5],h1:a[6],h2:a[7],s:a[8],fx:a[9],rs:a[10]}));
const PE=ALL.filter(e=>e.c==EN||e.c==0),TX=['el lenguaje lleva el nombre de un grupo de humor','el primer programa saluda al mundo, en la terminal','un círculo, un número famoso y tres dígitos','todo bucle necesita una salida','una ventana solo se queda abierta con la palabra mágica','quien atrapa errores nunca camina solo','guarda tu clave como un secreto… y busca al ratón amarillo','pide datos a una tabla con una sola palabra','el curso termina con una felicitación: escríbela… y quien termina un juego siempre busca empezar otra vez'];
function gotE(){try{return JSON.parse(localStorage.eggs||'[]')}catch(e){return[]}}
function toast(t){const d=document.createElement('div');d.className='toast2';d.textContent=t;document.body.append(d);setTimeout(()=>d.remove(),4000)}
function fx(e,nuevo){const o=document.createElement('div');o.className='ovl2';o.innerHTML=`<div class="ec" role="dialog"><small>${nuevo?'★ ¡Estrella nueva!':'Easter egg'}</small><b>${e.t}</b><p>${e.m}</p>${e.rs?'<button class="mb" id="rsb">🔄 Reiniciar todos los logros</button><br>':''}<small>(toca para cerrar)</small></div>`;o.onclick=()=>o.remove();document.body.append(o);if(e.rs)$('#rsb',o).onclick=ev=>{ev.stopPropagation();if(confirm('¿Reiniciar todos los logros? Se borrarán tus estrellas y los bugs atrapados.')){try{localStorage.removeItem('eggs');localStorage.removeItem('bugs')}catch(x){}o.remove();rd();toast('🔄 Logros reiniciados. ¡A buscar las estrellas otra vez!')}};else setTimeout(()=>o.remove(),7000);
if(!RM){const S=[...(e.s||'✦★')];for(let i=0;i<28;i++){const x=document.createElement('span');x.className='rn';x.textContent=S[i%S.length];x.style.cssText=`left:${Math.random()*100}vw;animation-delay:${Math.random()*1.5}s;font-size:${14+Math.random()*18}px`;document.body.append(x);setTimeout(()=>x.remove(),5000)}}
if(e.fx=='float'){document.body.classList.add('afloat');setTimeout(()=>document.body.classList.remove('afloat'),7000)}
if(e.fx=='sat'){const s=$('.sat');if(s){s.classList.add('spin');setTimeout(()=>s.classList.remove('spin'),2600)}}
if(e.id=='pk7')fetch('https://pokeapi.co/api/v2/pokemon/pikachu').then(r=>r.json()).then(d=>{$('p',o).textContent=`¡Pikachu! Peso: ${d.weight} · Altura: ${d.height}. Sus datos llegaron por una API, como en esta clase.`}).catch(()=>{$('p',o).textContent='Sin internet no llegan los datos de Pikachu, pero ya sabes cómo pedirlos con requests.get.'})}
function egg(id){const e=ALL.find(x=>x.id==id);if(!e)return;const g=gotE(),n=!g.includes(id);if(n){g.push(id);try{localStorage.eggs=JSON.stringify(g)}catch(x){}}fx(e,n);rd();if(n)chk(e)}
function chk(e){setTimeout(()=>{const g=gotE(),cl=ALL.filter(x=>x.c==e.c&&e.c>0);if(cl.length&&cl.every(x=>g.includes(x.id)))toast('🏅 ¡Insignia! Completaste las estrellas de la clase '+e.c);if(ALL.every(x=>g.includes(x.id)))setTimeout(()=>toast('🎓 ¡Las encontraste todas! Abre el botón ★ para tu diploma'),4200)},1800)}
function rd(){const p=$('#rdp'),g=gotE();if(!p)return;const f=ALL.filter(x=>g.includes(x.id)).length;$('#rdb').textContent='★ '+f+'/'+ALL.length;
const L=(t,a)=>a.length?`<b>${t}</b>`+a.map(e=>g.includes(e.id)?`<p>★ ${e.t} <button class="rbt" data-r="${e.id}">▶ Ver otra vez</button></p>`:`<p>☆ ${e.h1} <button class="rbt" data-h="${e.id}">Otra pista</button><span class="h2" hidden><br>${e.h2}</span></p>`).join(''):'';
p.innerHTML=L('Esta clase',PE.filter(e=>EN&&e.c==EN))+L('Todo el sitio',PE.filter(e=>e.c==0))+`<p class="rtot">Total: ${f}/${ALL.length}</p>`+(f==ALL.length?'<button class="mb" data-d="1">🎓 Mi diploma</button>':'<small>Encuentra todas las estrellas para desbloquear tu diploma.</small>')}
function diploma(){const o=document.createElement('div');o.className='ovl2 dip';o.innerHTML=`<div class="ec dpc"><input id="dpn" class="mi w-100" placeholder="Escribe tu nombre" aria-label="Tu nombre"><div class="dpd"><small>Certificado de finalización</small><h2 id="dnm">Tu nombre</h2><p>completó el curso <b>Misión Python</b> y encontró las ${ALL.length} estrellas escondidas.</p><p class="dpm">${PROFE_MSG}</p><p>${PROFE_FIRMA} · ${new Date().toLocaleDateString('es-BO')}</p></div><button class="mb" id="dpp">Imprimir / Guardar PDF</button> <button class="mb" id="dpx">Cerrar</button></div>`;document.body.append(o);
$('#dpn',o).oninput=e=>$('#dnm',o).textContent=e.target.value||'Tu nombre';$('#dpp',o).onclick=()=>print();$('#dpx',o).onclick=()=>o.remove()}
document.body.insertAdjacentHTML('beforeend','<div class="rdr"><div id="rdp" hidden></div><button id="rdb" aria-label="Estrellas escondidas"></button></div>');
$('#rdb').onclick=()=>$('#rdp').hidden=!$('#rdp').hidden;
$('#rdp').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.r)fx(ALL.find(x=>x.id==b.dataset.r),false);if(b.dataset.h){const s=b.nextElementSibling;s.hidden=!s.hidden}if(b.dataset.d)diploma()});rd();
let buf='';addEventListener('keydown',e=>{if(/input|textarea/i.test(e.target.tagName)||e.key.length>1)return;buf=(buf+e.key.toLowerCase()).slice(-14);PE.forEach(g=>{if(g.k=='type'&&buf.endsWith(g.a)){buf='';egg(g.id)}})});
PE.forEach(g=>{if(g.k=='click'){let n=0;document.addEventListener('click',e=>{if(document.elementsFromPoint(e.clientX,e.clientY).some(x=>x.closest&&x.closest(g.a[0]))&&++n>=g.a[1]){n=0;egg(g.id)}})}});
const KS=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];let ki=0;addEventListener('keydown',e=>{const k=e.key.length==1?e.key.toLowerCase():e.key;ki=k==KS[ki]?ki+1:(k==KS[0]?1:0);if(ki==KS.length){ki=0;egg('konami')}});
function bug(){if(gotE().includes('bug'))return;const b=document.createElement('button');b.className='bug';b.textContent='🐞';b.setAttribute('aria-label','Un bug: púlsalo para atraparlo');document.body.append(b);
let x=Math.random()*(innerWidth-40),y=Math.random()*(innerHeight-40),a=Math.random()*6.28,v=1.4,vivo=1;const t0=performance.now();
const fin=()=>{vivo=0;b.remove()};
b.onclick=()=>{fin();let c=+(localStorage.bugs||0)+1;try{localStorage.bugs=c}catch(e){}if(c>=3)egg('bug');else toast('🐞 ¡Bug atrapado! '+c+'/3')};
if(RM){b.style.left=x+'px';b.style.top=y+'px';setTimeout(fin,12000);return}
const paso=t=>{if(!vivo)return;if(t-t0>15000){fin();return}
a+=(Math.random()-.5)*.16;
x+=Math.cos(a)*v;y+=Math.sin(a)*v;const W=innerWidth-30,H=innerHeight-30;if(x<0||x>W){a=Math.PI-a;x=Math.max(0,Math.min(W,x))}if(y<0||y>H){a=-a;y=Math.max(0,Math.min(H,y))}
b.style.left=x+'px';b.style.top=y+'px';b.style.transform=`rotate(${a+Math.PI/2}rad)`;requestAnimationFrame(paso)};requestAnimationFrame(paso)}
setTimeout(function lp(){bug();setTimeout(lp,30000+Math.random()*60000)},12000+Math.random()*25000);
if(EN&&TX[EN-1]){const nx=$('.nx');if(nx)nx.insertAdjacentHTML('beforebegin','<p class="tx"># 🛰️ transmisión: '+TX[EN-1]+'</p>')}
console.log('%c🐍 ¡Hola, curioso!\n   Hay una serpiente escondida en este sitio.\n   Escríbela con el teclado, en la página (no aquí): serpiente','color:#6ee7ff;font:14px monospace');
if(EN==5)console.log('%cY algunas ventanas solo se quedan abiertas con una palabra mágica: mainloop','color:#f472b6;font:14px monospace');
const np=$('#np');if(np)np.onclick=()=>{const o=document.createElement('div');o.className='flood';o.innerHTML='<pre id="fl"></pre><button class="mb" id="fb2">break</button>';document.body.append(o);let n=0;const t=setInterval(()=>{const f=$('#fl');f.textContent+='hola\n';if(++n>(RM?20:300)){f.textContent='';n=0}},40);$('#fb2').onclick=()=>{clearInterval(t);o.remove();egg('nm4')}};
const tm=$('#tm');if(tm){const o=$('#to'),i=$('#ti'),ev=l=>{l=l.trim();let m;if(!l)return null;
if(/^Print\(/.test(l))return "NameError: name 'Print' is not defined";
if(m=l.match(/^print\((.*)\)$/)){const a=m[1].trim();if(/^"[^"]*"$|^'[^']*'$/.test(a))return a.slice(1,-1);
if(/^[\d\s+\-*\/().]+$/.test(a)){try{const v=Function('return '+a)();return Number.isInteger(v)&&/\//.test(a)?v.toFixed(1):String(v)}catch(e){}}
return 'Este mini intérprete entiende un valor: print("hola") o print(2+2)'}
return 'SyntaxError: invalid syntax'};
i.onkeydown=e=>{if(e.key=='Enter'){const v=i.value,r=ev(v);o.textContent+='>>> '+v+'\n'+(r==null?'':r+'\n');i.value='';o.scrollTop=1e9;if(/^print\(\s*["']hola mundo["']\s*\)$/i.test(v.trim()))egg('n2')}}}
const cj=$('#cj');if(cj){const B={};$('#cg').onclick=()=>{const n=$('#cn').value.trim(),v=$('#cv').value;if(!/^[A-Za-z_]\w*$/.test(n)){$('#cm').textContent='El nombre usa letras, números y _, sin espacios, y no empieza con número';return}
$('#cm').textContent=B[n]!==undefined?`${n} ya existía: guardaba ${B[n]} y ahora guarda ${v}`:'';B[n]=v;$('#cb').innerHTML=Object.entries(B).map(([k,x])=>`<div class="cx"><b>${k}</b><span>${x.replace(/</g,'&lt;')}</span></div>`).join('')}}

const jx=$('#jx');if(jx){const D={name:'charmander',weight:85,height:6};$$('button',jx).forEach(b=>b.onclick=()=>{const k=b.dataset.k;$('#jr').innerHTML=`<code>datos['${k}']</code> → <b>${typeof D[k]=='string'?"'"+D[k]+"'":D[k]}</b>`})}
const sq=$('#sq');if(sq){let R=[[1,'admin','1234'],[2,'dave','python123']],nid=3,msg='';const Q={i:"INSERT INTO usuarios (usuario, clave) VALUES ('prueba', 'abcd')",u:"UPDATE usuarios SET clave = 'nueva123' WHERE usuario = 'prueba'",d:"DELETE FROM usuarios WHERE usuario = 'prueba'",s:'SELECT * FROM usuarios'};
const draw=m=>{$('#sqb').innerHTML='<tr><th>id</th><th>usuario</th><th>clave</th></tr>'+R.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join('');$('#sqt').innerHTML=esc(Q[m]).replace(/\b(INSERT|INTO|VALUES|UPDATE|SET|WHERE|DELETE|FROM|SELECT)\b/g,'<span class="k">$1</span>').replace(/'[^']*'/g,'<span class="s">$&</span>')+(msg?'\n<span class="n">'+msg+'</span>':'')};
$$('.tg2 button',sq).forEach(b=>b.onclick=()=>{const m=b.dataset.s;msg='';
if(m=='i'){if(R.some(r=>r[1]=='prueba'))msg='sqlite3.IntegrityError: UNIQUE constraint failed: usuarios.usuario';else R.push([nid++,'prueba','abcd'])}
if(m=='u')R.forEach(r=>{if(r[1]=='prueba')r[2]='nueva123'});
if(m=='d')R=R.filter(r=>r[1]!='prueba');draw(m)});draw('s')}
const mn=$('#mn');if(mn){const go=()=>{mn.classList.remove('go');void mn.offsetWidth;mn.classList.add('go')};new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){o.disconnect();go()}},{threshold:.5}).observe(mn);$('#mr').onclick=go}

const dbx=$('#db');if(dbx){let P=[[1,'Arroz 1kg',8.5],[2,'Azúcar 1kg',7.8],[3,'Aceite Fino 900ml',15],[4,'Leche PIL 1L',6.5]],sel=-1;const f2=n=>'Bs '+n.toFixed(2),cl=()=>{$('#dn').value=$('#dp').value=$('#di').value='';sel=-1};
const R=()=>{const t=P.reduce((a,p)=>a+p[2],0),m=P.reduce((a,p)=>p[2]>(a?a[2]:-1)?p:a,null);
$('#dc').innerHTML=[['Productos',P.length,'#0284c7'],['Valor Total',f2(t),'#16a34a'],['Promedio',f2(P.length?t/P.length:0),'#7c3aed'],['Más caro',m?m[1]:'N/A','#dc2626']].map(c=>`<div class="dcd"><small>${c[0]}</small><b style="color:${c[2]}">${c[1]}</b></div>`).join('');
$('#dt').innerHTML='<tr><th>ID</th><th>Nombre del Producto</th><th>Precio (BOB)</th></tr>'+P.map((p,i)=>`<tr data-i="${i}" class="${i==sel?'on':''}"><td>${p[0]}</td><td>${p[1].replace(/</g,'&lt;')}</td><td>Bs${p[2].toFixed(2)}</td></tr>`).join('')};
dbx.addEventListener('click',e=>{const r=e.target.closest('tr[data-i]'),b=e.target.closest('button[data-a]');
if(r){sel=+r.dataset.i;$('#di').value=P[sel][0];$('#dn').value=P[sel][1];$('#dp').value=P[sel][2]}
if(b){const a=b.dataset.a,n=$('#dn').value.trim(),v=parseFloat($('#dp').value);
if(a=='a'&&n&&!isNaN(v)){P.push([Math.max(0,...P.map(p=>p[0]))+1,n,v]);cl()}
if(a=='e'&&sel>=0&&n&&!isNaN(v)){P[sel][1]=n;P[sel][2]=v;cl()}
if(a=='x'&&sel>=0){P.splice(sel,1);cl()}}R()});R()}
const pi=$('#pi');if(pi){let ran=0,cp=0;const ck=['p1','p2','p3'].map(i=>$('#'+i)),tr=()=>{const f=[ck[0].checked?'--onefile':'',ck[1].checked?'--windowed':'',ck[2].checked?'--icon=icono.ico':''].filter(Boolean);return 'pyinstaller '+f.join(' ')+(f.length?' ':'')+'dashboard.py'};
const rf=()=>{$('#pc').textContent=tr();$('#pn').innerHTML=[ck[0].checked?'<code>--onefile</code>: genera un solo archivo .exe.':'Sin <code>--onefile</code> se crea una carpeta con el .exe y muchos archivos de apoyo.',ck[1].checked?'<code>--windowed</code>: no aparece la consola negra al abrir.':'Sin <code>--windowed</code> se abre una consola negra junto a la ventana.',ck[2].checked?'<code>--icon</code>: tu ícono se agrega al .exe.':'Sin <code>--icon</code> el .exe tiene el ícono genérico.'].map(x=>`<li>${x}</li>`).join('');
let t='📁 mi_proyecto/\n  ├── dashboard.py\n  ├── productos_minimarket.json\n  └── icono.ico';
if(ran)t=t.replace('  └── icono.ico','  ├── icono.ico\n  ├── 📁 build/        (temporales, se ignoran)\n  ├── 📁 dist/\n  │     └── dashboard'+(ck[0].checked?'.exe':'/ (carpeta con dashboard.exe)')+'  ✅\n  └── dashboard.spec');
if(cp)t+='\n\n📁 Para distribuir/\n  ├── dashboard.exe\n  └── productos_minimarket.json  ✅';$('#pt2').textContent=t};
ck.forEach(c=>c.onchange=rf);$('#pg1').onclick=()=>{ran=1;rf()};$('#pg2').onclick=()=>{if(!ran)ran=1;cp=1;rf()};rf()}
