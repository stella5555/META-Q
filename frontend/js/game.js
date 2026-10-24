/* Fondo de estrellas animado */
(function(){var c=document.createElement('canvas');c.id='estrellas';document.body.prepend(c);var x=c.getContext('2d'),S=[],W,H;
function r(){W=c.width=innerWidth;H=c.height=innerHeight;S=[];for(var i=0;i<Math.round(W*H/5000);i++)S.push({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.6+.2,a:Math.random(),v:Math.random()*.02+.004,d:Math.random()*.15+.02,c:Math.random()<.15?'254,126,182':'218,229,252'})}
r();addEventListener('resize',r);var f=[];
function fugaz(){if(Math.random()<.008)f.push({x:Math.random()*W,y:Math.random()*H*.5,l:0})}
(function t(){x.clearRect(0,0,W,H);S.forEach(function(s){s.a+=s.v;s.y+=s.d;if(s.y>H)s.y=0;var o=.4+.6*Math.abs(Math.sin(s.a));x.beginPath();x.arc(s.x,s.y,s.r,0,6.3);x.fillStyle='rgba('+s.c+','+o+')';x.shadowBlur=s.r*4;x.shadowColor='rgba('+s.c+',1)';x.fill()});
fugaz();f=f.filter(function(e){e.l+=1;var px=e.x+e.l*7,py=e.y+e.l*3;var g=x.createLinearGradient(px-70,py-30,px,py);g.addColorStop(0,'rgba(218,229,252,0)');g.addColorStop(1,'rgba(254,126,182,.9)');x.strokeStyle=g;x.lineWidth=2;x.beginPath();x.moveTo(px-70,py-30);x.lineTo(px,py);x.stroke();return e.l<40});
requestAnimationFrame(t)})()})();
/* ---------- Guía: Inti, una llama arqueóloga en pixel art ---------- */
function llama(px){
 return '<svg class="qbit" width="92" height="112" viewBox="0 0 92 112">'+
 '<defs><radialGradient id="qg" cx="35%" cy="30%"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#e9ddff"/><stop offset="1" stop-color="#a98bff"/></radialGradient>'+
 '<radialGradient id="qv" cx="50%" cy="40%"><stop offset="0" stop-color="#1b2a55"/><stop offset="1" stop-color="#05060f"/></radialGradient></defs>'+
 '<line x1="46" y1="20" x2="46" y2="6" stroke="#c6a8ff" stroke-width="3" stroke-linecap="round"/>'+
 '<circle class="antena" cx="46" cy="6" r="5" fill="#ff7eb6"/>'+
 '<rect x="12" y="20" width="68" height="52" rx="22" fill="url(#qg)" stroke="#ffffff" stroke-width="2"/>'+
 '<rect x="20" y="30" width="52" height="30" rx="14" fill="url(#qv)"/>'+
 '<g class="ojos"><rect x="31" y="38" width="9" height="13" rx="4.5" fill="#33b1ff"/><rect x="52" y="38" width="9" height="13" rx="4.5" fill="#33b1ff"/></g>'+
 '<path d="M38 55 Q46 60 54 55" stroke="#ff7eb6" stroke-width="2.5" fill="none" stroke-linecap="round"/>'+
 '<circle cx="9" cy="46" r="5" fill="#8a3ffc"/><circle cx="83" cy="46" r="5" fill="#8a3ffc"/>'+
 '<rect x="28" y="74" width="36" height="22" rx="10" fill="url(#qg)" stroke="#ffffff" stroke-width="2"/>'+
 '<circle class="nucleo" cx="46" cy="85" r="5" fill="#ff7eb6"/>'+
 '<ellipse class="sombra" cx="46" cy="106" rx="20" ry="4" fill="rgba(138,63,252,.45)"/></svg>'}
function guia(id,html){var e=document.getElementById(id);e.innerHTML='<div class="qwrap">'+llama(5)+'</div><div class="burbuja"><b>Q-BIT:</b> '+html+'</div>';var w=e.querySelector('.qwrap');w.classList.remove('salta');void w.offsetWidth;w.classList.add('salta')}

/* ---------- Motor: Qiskit en el backend, simulación local de respaldo ---------- */
var BACKEND=false;
async function api(ruta,body){
 if(BACKEND){try{var r=await fetch('/api/'+({excavar:'medir',radar:'escanear',conectadas:'entrelazados'}[ruta]||ruta),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});if(r.ok)return await r.json()}catch(e){}}
 var th=2*Math.asin(Math.sqrt(body.p));
 if(ruta==='radar'){var k=0;for(var i=0;i<body.shots;i++)if(Math.random()<body.p)k++;var c={};if(body.shots-k)c['0']=body.shots-k;if(k)c['1']=k;return{counts:c,tesoros:k,shots:body.shots,theta:th}}
 var t=Math.random()<body.p;
 if(ruta==='conectadas')return{tesoro:t,counts:t?{'11':1}:{'00':1},theta:th};
 return{tesoro:t,counts:t?{'1':1}:{'0':1},theta:th}}
fetch('/api/salud').then(function(r){return r.json()}).then(function(){BACKEND=true;document.getElementById('motor').textContent='Motor cuántico: Qiskit Aer conectado'}).catch(function(){document.getElementById('motor').textContent='Modo demo sin servidor (simulación local)'});

/* ---------- Estado ---------- */
var NIVELES=[
 {n:1,nombre:'Primer contacto',concepto:'Probabilidad',visible:true,radar:false,enlaces:false,mon:0,
  intro:'Cada qubit brilla según su <b>probabilidad</b> de salir 1. Más brillo no es seguro, solo más probable. Tienes 3 mediciones.'},
 {n:2,nombre:'El escáner',concepto:'Monte Carlo',visible:false,radar:true,enlaces:false,mon:20,
  intro:'Ahora el brillo está oculto. Usa el <b>escáner</b>: mide copias del qubit 5 veces y estima su probabilidad. Cada escaneo gasta energía; cada qubit en 1 te devuelve +3.'},
 {n:3,nombre:'Qubits entrelazados',concepto:'Entrelazamiento',visible:true,radar:false,enlaces:true,mon:0,
  intro:'Los qubits del mismo color están <b>entrelazados</b>: al medirlos siempre dan lo mismo. Si uno sale 1, el otro también. Úsalo para ahorrar mediciones.'},
 {n:4,nombre:'Herramientas X y H',concepto:'Compuertas',bloq:true},
 {n:5,nombre:'Circuito maestro',concepto:'Aprendizaje cuántico',bloq:true}];
var prog={desbloq:1,est:{}};try{var g=JSON.parse(localStorage.getItem('qh_prog'));if(g)prog=g}catch(e){}
function guardar(){try{localStorage.setItem('qh_prog',JSON.stringify(prog))}catch(e){}}
var nivel,cfg,T,sel,palas,mon,pts,log,ocupado=false;
var COL={A:'#ee5396',B:'#0072c3'};

function ir(s){document.querySelectorAll('.screen').forEach(function(x){x.classList.remove('on')});document.getElementById('s-'+s).classList.add('on');window.scrollTo(0,0);
 if(s==='mapa')mapa();if(s==='ranking')ranking('Salón')}
function toast(t){var e=document.getElementById('toast');e.textContent=t;e.style.display='block';clearTimeout(e._t);e._t=setTimeout(function(){e.style.display='none'},1800)}

guia('guia-portada','Hola, soy Q-Bit, el asistente del laboratorio. Hoy empiezas tu práctica: dentro del criostato hay qubits que están en <b>0 y 1 al mismo tiempo</b>, hasta que alguien los mide. Tu misión es encontrar los que están en <b>1</b>. ¿Empezamos?');

/* ---------- Mapa ---------- */
function mapa(){guia('guia-mapa','Cada experimento te enseña una idea nueva de la computación cuántica. Completa uno para desbloquear el siguiente.');
 document.getElementById('mapa').innerHTML=NIVELES.map(function(L){var b=L.bloq,e=prog.est[L.n]||0;
 return '<div class="nivel'+(b?' bloq':'')+'" onclick="'+(b?'toast(\''+(L.bloq?'Próximamente':'Completa el experimento anterior')+'\')':'jugar('+L.n+')')+'"><div class="num px" style="color:'+(b?'#888':'var(--oro)')+'">'+L.n+'</div><h3>'+L.nombre.toUpperCase()+'</h3><div>'+L.concepto+'</div><div class="estrellas">'+(L.bloq?'PRÓXIMAMENTE':'★'.repeat(e)+'☆'.repeat(3-e))+'</div></div>'}).join('')}

/* ---------- Juego ---------- */
function mezclar(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
var LEC={
1:{t:'EXPERIMENTO 1 · PRIMER CONTACTO',g:'Antes de tocar nada, te explico qué es un qubit.',
 idea:'<h4>LA IDEA</h4>Un bit normal es 0 o 1. Un <b>qubit</b> puede estar en una mezcla de 0 y 1 (<b>superposición</b>). Imagina una moneda girando en el aire: no es cara ni sello hasta que la atrapas.<br><br>El <b>brillo</b> de cada qubit te dice qué tan probable es que salga 1 cuando lo midas.',
 sale:'<h4>¿QUÉ PUEDE SALIR?</h4>Al medir un qubit solo puede salir <b>0</b> o <b>1</b>.<br><br>Un qubit al <b>90%</b>: de cada 10 veces, unas 9 sale 1 y 1 sale 0.<br>Un qubit al <b>20%</b>: casi siempre sale 0.<br><br>Pero en una sola medición puede salir cualquiera de los dos: eso es el azar cuántico.',
 como:'<h4>CÓMO SE JUEGA</h4>1. Mira el porcentaje de los 9 qubits.<br>2. Elige uno y presiona MEDIR.<br>3. Tienes 3 mediciones: úsalas en los qubits con más probabilidad de salir 1.'},
2:{t:'EXPERIMENTO 2 · EL ESCÁNER',g:'Ahora no sabrás la probabilidad de cada qubit. Tendrás que descubrirla.',
 idea:'<h4>LA IDEA</h4>Si no conoces la probabilidad de algo, puedes <b>repetir el experimento muchas veces</b> y contar los resultados. Eso se llama <b>método de Monte Carlo</b>.<br><br>Las computadoras cuánticas trabajan así: siempre miden el mismo circuito muchas veces (los <b>shots</b>).',
 sale:'<h4>¿QUÉ PUEDE SALIR?</h4>Escaneas un qubit 5 veces y sale, por ejemplo, <b>4 veces 1</b> y 1 vez 0. Tu estimación: unos <b>80%</b>.<br><br>Con pocos escaneos la estimación puede engañar (podría ser 60% y tuviste suerte). Con más escaneos te acercas al valor real.',
 como:'<h4>CÓMO SE JUEGA</h4>1. Elige un qubit y presiona ESCANEAR (gasta 5 de energía).<br>2. Observa cuántas veces salió 1.<br>3. Cuando tengas una buena estimación, MIDE.<br>4. Cada qubit en 1 te devuelve +3 de energía.'},
3:{t:'EXPERIMENTO 3 · ENTRELAZAMIENTO',g:'Este es el fenómeno más extraño de la cuántica. Presta atención.',
 idea:'<h4>LA IDEA</h4>Dos qubits pueden quedar <b>entrelazados</b>: se comportan como uno solo. Si mides uno y sale 1, el otro también será 1, aunque no lo mires.<br><br>En Qiskit esto se logra con la compuerta <b>CNOT</b>.',
 sale:'<h4>¿QUÉ PUEDE SALIR?</h4>Para dos qubits entrelazados solo hay dos resultados posibles: <b>00</b> (los dos en 0) o <b>11</b> (los dos en 1).<br><br>Nunca sale 01 ni 10. Por eso, con una sola medición sabes el estado de los dos.',
 como:'<h4>CÓMO SE JUEGA</h4>1. Los qubits del mismo color están entrelazados.<br>2. Si mides uno y sale 1, ganas los dos con una sola medición.<br>3. Si sale 0, ya sabes que su pareja también es 0: no gastes una medición ahí.'}};
function jugar(n){if(n>3){ir('mapa');return}var L=LEC[n];document.getElementById('l-tit').textContent=L.t;guia('guia-lec',L.g);
 document.getElementById('l-idea').innerHTML=L.idea;document.getElementById('l-sale').innerHTML=L.sale;document.getElementById('l-como').innerHTML=L.como;
 document.getElementById('l-go').onclick=function(){empezar(n)};ir('leccion')}
function empezar(n){nivel=n;cfg=NIVELES[n-1];sel=-1;palas=3;mon=cfg.mon;pts=0;log=[];
 var base;
 if(cfg.enlaces){var pa=Math.random()<.5?.7:.35,pb=pa===.7?.35:.7;base=[{p:pa,g:'A'},{p:pa,g:'A'},{p:pb,g:'B'},{p:pb,g:'B'},{p:.9},{p:.2},{p:.55},{p:.15},{p:.8}]}
 else base=[.9,.2,.6,.1,.75,.4,.3,.5,.85].map(function(p){return{p:p}});
 T=mezclar(base).map(function(o){o.r=null;o.scan={k:0,n:0};return o});
 document.getElementById('c-nivel').innerHTML='EXPERIMENTO <span>'+n+'</span> · '+cfg.concepto.toUpperCase();
 document.getElementById('chip-mon').style.display=cfg.radar?'block':'none';
 document.getElementById('b-radar').style.display=cfg.radar?'inline-block':'none';
 guia('guia-juego',cfg.intro);
 qpanel('<h4>LO CUÁNTICO DETRÁS</h4>Elige un qubit y aquí te explico qué pasa dentro de la computadora cuántica.');
 hud();dibujar();ir('juego')}
function hud(){document.getElementById('c-palas').textContent=palas;document.getElementById('c-mon').textContent=mon;document.getElementById('c-pts').textContent=pts}
function colorTumba(p){return 'linear-gradient(180deg,rgba(254,126,182,'+(0.15+p*0.85)+') 0 22%,#120626 22% 26%,#2a0f52 26%)'}
function dibujar(){var tb=document.getElementById('tablero');tb.innerHTML='';
 T.forEach(function(o,i){var d=document.createElement('div');d.className='tumba'+(i===sel?' sel':'')+(o.r!==null?' abierta':'');
  if(o.r!==null){d.style.background=o.r?'linear-gradient(180deg,#fe7eb6 0 22%,#120626 22% 26%,#fe7eb6 26%)':'linear-gradient(180deg,#3a3550 0 22%,#120626 22% 26%,#221d33 26%)';d.innerHTML='<div class="lbl">'+(o.r?'|1⟩ ACTIVO':'|0⟩')+'</div>';if(o.recien){d.classList.add('pop');o.recien=false}}
  else if(cfg.visible){d.style.background=colorTumba(o.p);d.style.boxShadow='0 0 '+Math.round(6+o.p*30)+'px rgba(254,126,182,'+(0.25+o.p*0.75)+'),inset 0 -10px 18px rgba(0,0,0,.45)';d.style.borderColor='rgba(254,126,182,'+(0.3+o.p*0.7)+')';if(o.p>.7)d.style.animation='brillo 1.6s infinite';d.innerHTML='<div class="puerta"></div><div class="lbl">'+Math.round(o.p*100)+'%</div>'}
  else{d.style.background='linear-gradient(180deg,#dae5fc 0 22%,#120626 22% 26%,#2a0f52 26%)';d.innerHTML='<div class="puerta"></div><div class="lbl">'+(o.scan.n?o.scan.k+'/'+o.scan.n:'?')+'</div>'}
  if(o.g){d.style.borderColor=COL[o.g];d.innerHTML+='<div class="tag" style="background:'+COL[o.g]+'">'+o.g+'</div>'}
  d.onclick=function(){if(o.r!==null||ocupado)return;sel=i;dibujar();info()};tb.appendChild(d)});
 if(cfg.enlaces){var sv='<svg class="lineas" width="404" height="404">';['A','B'].forEach(function(g){var ix=[];T.forEach(function(o,i){if(o.g===g)ix.push(i)});var c=ix.map(function(i){return[(i%3)*142+62,Math.floor(i/3)*142+62]});
  sv+='<line x1="'+c[0][0]+'" y1="'+c[0][1]+'" x2="'+c[1][0]+'" y2="'+c[1][1]+'" stroke="'+COL[g]+'" stroke-width="8" stroke-dasharray="10 6"/>'});tb.insertAdjacentHTML('beforeend',sv+'</svg>')}}
function th(p){return 2*Math.asin(Math.sqrt(p))}
function circuito(p,doble,oculto){var a=oculto?'θ ?':th(p).toFixed(2);
 if(!doble)return '<svg width="250" height="46" font-family="monospace" font-size="12" style="display:block;margin:6px 0"><text x="0" y="27" fill="#fff">|0⟩</text><line x1="28" y1="23" x2="245" y2="23" stroke="#8fc1ff" stroke-width="2"/><rect x="44" y="8" width="90" height="30" fill="#3a7bd5" stroke="#fff"/><text x="89" y="27" fill="#fff" text-anchor="middle">RY('+a+')</text><rect x="170" y="8" width="60" height="30" fill="#2f8f5b" stroke="#fff"/><text x="200" y="27" fill="#fff" text-anchor="middle">MEDIR</text></svg>';
 return '<svg width="250" height="90" font-family="monospace" font-size="12" style="display:block;margin:6px 0"><text x="0" y="27" fill="#fff">q0</text><text x="0" y="69" fill="#fff">q1</text><line x1="24" y1="23" x2="245" y2="23" stroke="#8fc1ff" stroke-width="2"/><line x1="24" y1="65" x2="245" y2="65" stroke="#8fc1ff" stroke-width="2"/><rect x="34" y="8" width="84" height="30" fill="#3a7bd5" stroke="#fff"/><text x="76" y="27" fill="#fff" text-anchor="middle">RY('+a+')</text><line x1="146" y1="23" x2="146" y2="65" stroke="#fff" stroke-width="2"/><circle cx="146" cy="23" r="5" fill="#fff"/><circle cx="146" cy="65" r="11" fill="none" stroke="#fff" stroke-width="2"/><line x1="135" y1="65" x2="157" y2="65" stroke="#fff" stroke-width="2"/><rect x="180" y="8" width="58" height="30" fill="#2f8f5b" stroke="#fff"/><text x="209" y="27" fill="#fff" text-anchor="middle">MEDIR</text><rect x="180" y="50" width="58" height="30" fill="#2f8f5b" stroke="#fff"/><text x="209" y="69" fill="#fff" text-anchor="middle">MEDIR</text></svg>'}
function qpanel(h){document.getElementById('qpanel').innerHTML=h}
function info(){var o=T[sel];
 if(cfg.visible){var pc=Math.round(o.p*100);qpanel('<h4>LO CUÁNTICO DETRÁS</h4>'+(o.g?
 '<div class="expl"><b>Qué significa:</b> este qubit está entrelazado con otro del mismo color. Primero se gira con RY para darle '+pc+'% de probabilidad, y luego la compuerta CNOT los conecta.<br><b>Qué puede salir:</b> 11 (los dos en 1) el '+pc+'% de las veces, o 00 (los dos en 0) el '+(100-pc)+'%. Nunca 01 ni 10.</div>'
 :'<div class="expl"><b>Qué significa:</b> el qubit empieza en 0 (|0⟩). La compuerta RY lo gira <b>'+th(o.p).toFixed(2)+' rad</b>, como inclinar una flecha. Mientras más se gira, más probable es que salga 1.<br><b>Qué puede salir:</b> 1 con <b>'+pc+'%</b> de probabilidad, 0 con <b>'+(100-pc)+'%</b>.</div>')+'<b>Así se ve el circuito en Qiskit:</b>'+circuito(o.p,!!o.g));
  guia('guia-juego',o.g?'Este qubit está entrelazado. Si lo mides, sabrás el estado de los dos.':(o.p>=.7?'Brilla mucho. Buena opción, aunque nada es seguro.':o.p<=.3?'Brilla poco. Pocas posibilidades de salir 1.':'Probabilidad media. Piensa si hay algo mejor.'))}
 else{var e=o.scan.n?Math.round(o.scan.k/o.scan.n*100)+'%':'desconocida';qpanel('<h4>LO CUÁNTICO DETRÁS</h4><div class="expl"><b>Qué significa:</b> este qubit fue girado un ángulo que no conoces, así que no sabes su probabilidad de salir 1.<br><b>Qué puedes hacer:</b> escanearlo (medir copias varias veces) para estimarla. Tu estimación actual: <b>'+e+'</b>'+(o.scan.n?' con '+o.scan.n+' escaneos.':'.')+'</div><b>Circuito en Qiskit (ángulo oculto):</b>'+circuito(o.p,false,true));
  guia('guia-juego',o.scan.n?(o.scan.n<10?'Con pocos escaneos la estimación puede engañar. ¿Escaneas más o te arriesgas?':'Ya tienes una buena estimación.'):'No sabemos nada de este qubit. ¿Lo escaneamos?')}}
async function radar(){if(sel<0){guia('guia-juego','Primero elige un qubit para escanear.');return}
 if(mon<5){guia('guia-juego','Te quedaste sin energía. Ahora decide con lo que sabes. Cada qubit en 1 te devuelve energía.');return}
 ocupado=true;mon-=5;var o=T[sel],r=await api('radar',{p:o.p,shots:5});o.scan.k+=r.tesoros;o.scan.n+=5;ocupado=false;hud();dibujar();info();
 var c0=r.counts['0']||0,c1=r.counts['1']||0;
 qpanel(document.getElementById('qpanel').innerHTML+'<br><br><b>Escáner = Monte Carlo.</b> Qiskit midió este circuito 5 veces (shots=5): {\'0\': '+c0+', \'1\': '+c1+'}<div class="barras"><div style="height:'+(c0*12+14)+'px">0: '+c0+'</div><div style="height:'+(c1*12+14)+'px">1: '+c1+'</div></div>')}
async function cavar(){if(sel<0){guia('guia-juego','Elige un qubit antes de medir.');return}if(palas<1||ocupado)return;
 ocupado=true;palas--;var o=T[sel],mejor=Math.max.apply(null,T.filter(function(x){return x.r===null}).map(function(x){return cfg.visible?x.p:(x.scan.n?x.scan.k/x.scan.n:0)}));
 var est=cfg.visible?o.p:(o.scan.n?o.scan.k/o.scan.n:null),r,pareja=null,gana=Math.round(o.p*100),msg;
 if(o.g){r=await api('conectadas',{p:o.p});pareja=T.filter(function(x){return x.g===o.g&&x!==o})[0];o.r=r.tesoro;pareja.r=r.tesoro;pareja.recien=true;if(r.tesoro)gana+=60;else gana+=10}
 else{r=await api('excavar',{p:o.p});o.r=r.tesoro;if(r.tesoro)gana+=20}
 if(o.r&&cfg.radar)mon+=3;
 o.recien=true;pts+=gana;
 log.push({tumba:T.indexOf(o)+1,p:o.p,est:est,mejor:mejor,r:o.r,pts:gana,enlace:!!o.g,scan:o.scan.n});
 if(o.g)msg=o.r?'Salió 11: los dos qubits entrelazados están en 1. Una medición, doble acierto.':'Salió 00: los dos están en 0. Ya no gastes una medición en su pareja.';
 else msg=o.r?'Salió 1: qubit activo.':(o.p>=.6?'Salió 0. Fue una buena decisión, solo te tocó el lado menos probable.':'Salió 0. Ese qubit tenía pocas posibilidades de dar 1.');
 qpanel('<h4>LO CUÁNTICO DETRÁS</h4><div class="expl"><b>Qué pasó:</b> mediste el qubit una vez (shots=1). Estaba en superposición y <b>colapsó</b> a '+(o.r?'1':'0')+'. Qiskit devolvió <b>'+JSON.stringify(r.counts)+'</b>.</div><br>Probabilidad real: '+Math.round(o.p*100)+'%. Puntos: +'+gana+'.'+circuito(o.p,!!o.g));
 guia('guia-juego',msg);sel=-1;ocupado=false;hud();dibujar();
 if(palas===0)setTimeout(resumen,1100)}

/* ---------- Resumen con mapeo y errores ---------- */
var MAPEO={1:['Distribución de probabilidad','Qubit girado con RY(θ), donde p = sin²(θ/2)','Brillo de cada qubit'],
 2:['Método de Monte Carlo','Medir el circuito muchas veces (shots)','Escáner'],
 3:['Eventos correlacionados','Qubits entrelazados con CNOT','Qubits del mismo color']};
var LLEVAR={1:['Un qubit puede estar en superposición: algo de 0 y algo de 1 a la vez.','Medir hace que el qubit colapse a 0 o 1.','La compuerta RY controla la probabilidad: más giro, más probabilidad de 1.','Una probabilidad alta no garantiza el resultado en un solo intento.'],2:['Si no conoces una probabilidad, puedes estimarla repitiendo el experimento (Monte Carlo).','Las computadoras cuánticas siempre miden muchas veces (shots).','Pocas mediciones dan estimaciones inestables; más mediciones, mejor estimación.'],3:['Dos qubits entrelazados se comportan como uno solo.','La compuerta CNOT crea el entrelazamiento.','Al medirlos solo puede salir 00 o 11: medir uno te dice el otro.']};
function resumen(){var maxp=[.9,.85,.75].reduce(function(a,b){return a+b})*100+60,e=pts>=maxp*.7?3:pts>=maxp*.45?2:1;
 if(cfg.enlaces)e=pts>=250?3:pts>=170?2:1;
 prog.est[nivel]=Math.max(prog.est[nivel]||0,e);if(nivel===prog.desbloq&&nivel<3)prog.desbloq++;guardar();registrar(pts);
 document.getElementById('r-pts').textContent=pts;document.getElementById('r-est').textContent='★'.repeat(e)+'☆'.repeat(3-e);
 guia('guia-res',e===3?'Excelente. Decidiste como una verdadera investigadora cuántica.':e===2?'Bien hecho. Revisa abajo dónde podías mejorar.':'Sigue practicando: mira en qué fallaste y vuelve a intentarlo.');
 var m=MAPEO[nivel];
 document.getElementById('r-mapeo').innerHTML='<h4>LO QUE APRENDISTE</h4><b>Concepto:</b> '+cfg.concepto+'<br><br><b>En estadística:</b> '+m[0]+'<br><b>En computación cuántica:</b> '+m[1]+'<br><b>En el juego:</b> '+m[2]+'<br><br>'+
 (nivel===1?'Elegir el qubit más brillante no garantiza que salga 1: una probabilidad describe lo que pasa en promedio, no en cada intento.':nivel===2?'Con pocas mediciones una estimación puede engañar. Las computadoras cuánticas siempre repiten la medición muchas veces.':'Medir un qubit entrelazado te dice el resultado del otro, sin mirarlo.');
 document.getElementById('r-llevar').innerHTML='<h4>LO QUE DEBES LLEVARTE DE ESTE EXPERIMENTO</h4><ul class="lista">'+LLEVAR[nivel].map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul>';
 document.getElementById('r-tabla').innerHTML='<tr><th>MEDICIÓN</th><th>QUBIT</th><th>'+(cfg.visible?'PROB.':'ESTIMADA')+'</th><th>REAL</th><th>RESULTADO</th><th>PUNTOS</th></tr>'+log.map(function(l,i){
  return '<tr><td>'+(i+1)+'</td><td>#'+l.tumba+(l.enlace?' (entrelazado)':'')+'</td><td>'+(l.est===null?'sin escanear':Math.round(l.est*100)+'%')+'</td><td>'+Math.round(l.p*100)+'%</td><td class="'+(l.r?'ok':'mal')+'">'+(l.r?'1 (activo)':'0')+'</td><td>+'+l.pts+'</td></tr>'}).join('');
 var f=[];log.forEach(function(l,i){
  if(cfg.visible&&!l.enlace&&l.mejor-l.p>=.2)f.push('Medición '+(i+1)+': elegiste un qubit de '+Math.round(l.p*100)+'% cuando había uno de '+Math.round(l.mejor*100)+'%.');
  if(cfg.radar&&l.est===null)f.push('Medición '+(i+1)+': mediste sin escanear. Adivinaste en lugar de estimar.');
  if(cfg.radar&&l.scan>0&&l.scan<10&&Math.abs(l.est-l.p)>=.25)f.push('Medición '+(i+1)+': con solo '+l.scan+' escaneos estimaste '+Math.round(l.est*100)+'%, pero era '+Math.round(l.p*100)+'%. Más escaneos dan mejor estimación.');
  if(!l.r&&l.p>=.6&&!l.enlace)f.push('Medición '+(i+1)+': salió 0, pero la decisión fue buena. Eso es azar cuántico, no un error.');});
 if(cfg.enlaces&&!log.some(function(l){return l.enlace}))f.push('No mediste ningún qubit entrelazado. Una sola medición podía darte dos aciertos.');
 document.getElementById('r-fallos').innerHTML='<h4>EN QUÉ PODÍAS MEJORAR</h4>'+(f.length?f.map(function(x){return '<div>- '+x+'</div>'}).join(''):'<div>Ninguna decisión mala. Elegiste siempre las mejores opciones disponibles.</div>');
 document.getElementById('r-sig').style.display=nivel<3?'inline-block':'none';ir('resumen')}

/* ---------- Ranking (datos de ejemplo + el jugador) ---------- */
var RK={'Salón':[['Valeria R.',1240],['Diego M.',1185],['Camila T.',1120],['Sebastián L.',1010],['Lucía P.',960],['Mateo C.',905],['Andrea Q.',870]],
 'Colegio':[['5.° A',8450],['5.° C',8120],['4.° B',7800],['4.° A',7310],['5.° B',6900]],
 'Región':[['Colegio Santa Rosa (Lima)',51200],['IE José Olaya (Callao)',48700],['Colegio San Agustín (Lima)',47950],['IE Andrés Bello (Lima)',44300]],
 'Perú':[['Colegio Mariscal (Arequipa)',98400],['IE Inca Garcilaso (Cusco)',96100],['Colegio Santa Rosa (Lima)',93800],['IE Túpac Amaru (Puno)',90250],['Colegio Trujillo (La Libertad)',88600]]};
var total=0;try{total=+localStorage.getItem('qh_total')||0}catch(e){}
function registrar(p){total+=p;try{localStorage.setItem('qh_total',total)}catch(e){}}
function ranking(tab){document.getElementById('r-tabs').innerHTML=Object.keys(RK).map(function(k){return '<button class="tab'+(k===tab?' on':'')+'" onclick="ranking(\''+k+'\')">'+k.toUpperCase()+'</button>'}).join('');
 var lista=RK[tab].slice();if(tab==='Salón')lista.push(['Tú',total]);lista.sort(function(a,b){return b[1]-a[1]});
 var col=['#8a3ffc','#ee5396','#0072c3'];
 document.getElementById('r-rank').innerHTML='<tr><th>#</th><th>'+(tab==='Salón'?'ALUMNO':tab==='Colegio'?'SALÓN':'COLEGIO')+'</th><th>PUNTOS</th></tr>'+lista.map(function(x,i){
  return '<tr class="'+(x[0]==='Tú'?'yo':'')+'"><td>'+(i<3?'<span class="medalla" style="background:'+col[i]+'">'+(i+1)+'</span>':i+1)+'</td><td>'+x[0]+'</td><td>'+x[1].toLocaleString('es-PE')+'</td></tr>'}).join('')}
