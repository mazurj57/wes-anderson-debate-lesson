const films=[
 {id:'budapest',title:'The Grand Budapest Hotel',anchor:'A concierge and lobby boy are pulled into an adventure amid political change.',poster:'assets/grand-budapest-poster.jpg'},
 {id:'fox',title:'Fantastic Mr. Fox',anchor:'Family loyalty meets a risky plan in a handmade stop-motion world.',poster:'assets/fantastic-mr-fox-poster.jpg'},
 {id:'moonrise',title:'Moonrise Kingdom',anchor:'Two young outsiders run away while the adults around them search.',poster:'assets/moonrise-kingdom-poster.jpg'},
 {id:'tenenbaums',title:'The Royal Tenenbaums',anchor:'An estranged family reunites and old tensions return.',poster:'assets/royal-tenenbaums-poster.jpg'},
 {id:'dispatch',title:'The French Dispatch',anchor:'A magazine turns its writers’ stories into a playful anthology.',poster:'assets/french-dispatch-poster.jpg'},
 {id:'asteroid',title:'Asteroid City',anchor:'A desert gathering unfolds inside a play-within-a-play.',poster:'assets/asteroid-city-poster.jpg'}
];
const claims=[
 'Every Wes Anderson film looks like the same film in different costumes.',
 'The careful visuals are a storytelling language, not decoration.',
 'His quirky characters can be emotionally distant.',
 'The films make sadness easier to approach by wrapping it in comedy and beauty.'
];
const state={role:null,reactionFilm:null,reaction:null,reactionFrame:'the poster suggests…',caseFilms:[],claim:0,difficultFilm:null,verdict:null};
const $=(q,root=document)=>root.querySelector(q), $$=(q,root=document)=>[...root.querySelectorAll(q)];
function toast(message){const t=$('#toast');t.textContent=message;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),1800)}
function copyText(text,message){navigator.clipboard?.writeText(text).then(()=>toast(message)).catch(()=>toast('Select and copy the sentence manually.'))}

films.forEach((film,index)=>{
  $('#filmGrid').insertAdjacentHTML('beforeend',`<button class="film-card" data-id="${film.id}"><span class="pick">${index+1}</span><div class="film-art"><img src="${film.poster}" alt="Original theatrical poster for ${film.title}"></div><h3>${film.title}</h3><p>${film.anchor}</p></button>`);
  $('#caseFilmList').insertAdjacentHTML('beforeend',`<button class="mini-film" data-id="${film.id}"><strong>${film.title}</strong><small>${film.anchor}</small></button>`);
  $('#verdictFilms').insertAdjacentHTML('beforeend',`<button class="verdict-choice" data-id="${film.id}">${film.title}</button>`);
  $('#exitFilmChoices').insertAdjacentHTML('beforeend',`<button class="exit-film" data-id="${film.id}">${film.title}</button>`);
});

$$('.role-select').forEach(button=>button.addEventListener('click',()=>{
  state.role=button.dataset.role;
  $$('.role-card').forEach(card=>card.classList.toggle('selected',card.contains(button)));
  $('#caseRole').textContent=state.role==='pro'?'Style adds meaning':'Style can overwhelm story';
  updateCase();
  toast(`Role set: ${state.role==='pro'?'Anastasia A · For':'Anastasia B · Skeptic'}`);
}));

$('#filmGrid').addEventListener('click',event=>{
  const card=event.target.closest('.film-card');if(!card)return;
  state.reactionFilm=films.find(f=>f.id===card.dataset.id);
  $$('.film-card').forEach(c=>c.classList.toggle('selected',c===card));
  $('#reactionFilm').textContent=state.reactionFilm.title;
  updateReaction();
});
$$('.reaction-choice button').forEach(button=>button.addEventListener('click',()=>{
  state.reaction=button.dataset.reaction;
  $$('.reaction-choice button').forEach(b=>b.classList.toggle('active',b===button));
  updateReaction();
}));
$$('.reaction-frames button').forEach(button=>button.addEventListener('click',()=>{
  state.reactionFrame=button.dataset.frame;
  $$('.reaction-frames button').forEach(item=>item.classList.toggle('active',item===button));
  updateReaction();
}));
function updateReaction(){
  const word=state.reaction==='watch'?'appealing':state.reaction==='avoid'?'unappealing':'appealing / unappealing';
  $('#reactionWord').textContent=word;
  $('#reactionPreview').textContent=state.reactionFrame;
}

$('#caseFilmList').addEventListener('click',event=>{
  const button=event.target.closest('.mini-film');if(!button)return;const id=button.dataset.id;
  if(state.caseFilms.includes(id))state.caseFilms=state.caseFilms.filter(x=>x!==id);
  else if(state.caseFilms.length<2)state.caseFilms.push(id);
  else{button.classList.add('shake');toast('Choose two films only.');return}
  $$('.mini-film').forEach(b=>b.classList.toggle('active',state.caseFilms.includes(b.dataset.id)));
  updateCase();
});
function updateCase(){
  const notes=$('#caseNotes');
  if(!state.caseFilms.length){notes.innerHTML='<p>Your selected evidence will appear here.</p>';$('#generatedCase').textContent='“The strongest example for my view is…”';return}
  notes.innerHTML=state.caseFilms.map(id=>{const film=films.find(f=>f.id===id);return `<div class="case-note-row"><img src="${film.poster}" alt="${film.title} poster"><div><strong>${film.title}</strong><p>“In this film, the specific detail I would point to is ___ because it shows ___.”</p></div></div>`}).join('');
  const titles=state.caseFilms.map(id=>films.find(f=>f.id===id).title);
  $('#generatedCase').textContent=titles.length===1?`“The strongest example for my view is ${titles[0]}, because…”`:`“Taken together, ${titles[0]} and ${titles[1]} show that…”`;
}

function renderClaim(){ $('#claimNumber').textContent=`Claim ${String(state.claim+1).padStart(2,'0')} / 04`;$('#claimText').textContent=`“${claims[state.claim]}”`;$$('.response-checks input').forEach(i=>i.checked=false)}
$('#prevClaim').addEventListener('click',()=>{state.claim=(state.claim+claims.length-1)%claims.length;renderClaim()});
$('#nextClaim').addEventListener('click',()=>{state.claim=(state.claim+1)%claims.length;renderClaim()});
$('#randomClaim').addEventListener('click',()=>{let next;do{next=Math.floor(Math.random()*claims.length)}while(next===state.claim);state.claim=next;renderClaim()});

$('#drawFilm').addEventListener('click',()=>{
  let next;do{next=films[Math.floor(Math.random()*films.length)]}while(next.id===state.difficultFilm?.id);state.difficultFilm=next;
  $('#drawTitle').textContent=next.title;$('#drawPoster').className='draw-poster';$('#drawPoster').innerHTML=`<img src="${next.poster}" alt="Original theatrical poster for ${next.title}">`;
});

$('#verdictFilms').addEventListener('click',event=>{const b=event.target.closest('.verdict-choice');if(!b)return;state.verdict=films.find(f=>f.id===b.dataset.id);$$('.verdict-choice').forEach(x=>x.classList.toggle('active',x===b));$('#verdictFilm').textContent=state.verdict.title;$('#finalLine span').textContent=state.verdict.title});

$('#exitFilmChoices').addEventListener('click',event=>{const b=event.target.closest('.exit-film');if(!b)return;$$('.exit-film').forEach(x=>x.classList.toggle('active',x===b));$('#completion').classList.add('show')});

$$('.tool-group button').forEach(button=>button.addEventListener('click',()=>copyText(button.textContent,'Toolkit phrase copied.')));
const toolkit=$('#toolkit'),hero=$('.hero'),toolkitToggle=$('#toolkitToggle');
function positionToolkit(){
  const ready=hero.getBoundingClientRect().bottom<=0;
  toolkit.classList.toggle('is-fixed',ready);
  toolkitToggle.classList.toggle('is-ready',ready);
  if(!ready){toolkit.classList.remove('open');toolkitToggle.classList.remove('hidden')}
}
window.addEventListener('scroll',positionToolkit,{passive:true});
window.addEventListener('resize',positionToolkit);
positionToolkit();
$('#toolkitToggle').addEventListener('click',()=>{toolkit.classList.add('open');$('#toolkitToggle').classList.add('hidden');$('#toolkitToggle').setAttribute('aria-expanded','true')});
$('#closeToolkit').addEventListener('click',()=>{toolkit.classList.remove('open');$('#toolkitToggle').classList.remove('hidden');$('#toolkitToggle').setAttribute('aria-expanded','false')});

renderClaim();
