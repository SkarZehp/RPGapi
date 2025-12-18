const bestiario = JSON.parse(localStorage.getItem('bestiario')) || {};

// ===============================
//   CÁLCULOS AUTOMÁTICOS
// ===============================

function calcularHP(stt) {
  return 8 + (stt.vigor * 6) + (stt.forca * 2);
}

function calcularImpeto(stt) {
  return 4 + (stt.intelecto / 2) + stt.aura;
}

function calcularDF(stt) {
  const mediaFisica = (stt.forca + stt.destreza + stt.vigor) / 3;
  return Math.floor(mediaFisica + 8);
}

function calcularDM(stt) {
  const mediaMental = (stt.intelecto + stt.aura) / 2;
  return Math.floor(mediaMental + 8);
}


// ===============================
//   RENDERIZAR BESTIÁRIO
// ===============================

function renderizarBestiario() {
  const container = document.getElementById('bestiario-list');
  container.innerHTML = '';

  for (const id in bestiario) {
    const c = bestiario[id];

    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <div class="card-wrapper">
        <button onclick="mandarProSite('${id}')">HA</button>
        <img src="${c.imagem}" class="mini-img" />

        <div class="card-stats">
          <div class="card-stt"><div>${c.stt.forca}</div><small>F</small></div>
          <div class="card-stt"><div>${c.stt.destreza}</div><small>D</small></div>
          <div class="card-stt"><div>${c.stt.vigor}</div><small>V</small></div>
          <div class="card-stt"><div>${c.stt.intelecto}</div><small>I</small></div>
          <div class="card-stt"><div>${c.stt.aura}</div><small>A</small></div>
          <div class="card-stt"><div>${c.stt.mahre}</div><small>M</small></div>

          <div class="card-diffs">
            <span class="card-df">DF: ${c.DF}</span>
            <span class="card-dm">DM: ${c.DM}</span>
          </div>
        </div>

        <span class="card-nome">${c.nome}</span>
        <span class="card-hp">HP: ${c.hp} / ${c.hpMax}</span>

        <div class="card-controls">
          <button onclick="alterarHP('${id}', -10)">--</button>
          <button onclick="alterarHP('${id}', -1)">-</button>
          <button onclick="alterarHP('${id}', 1)">+</button>
          <button onclick="alterarHP('${id}', 10)">++</button>
        </div>

        <span class="card-impeto">Ímpeto: ${c.impeto}</span>

        <div class="card-controls">
          <button onclick="alterarImpeto('${id}', -10)">--</button>
          <button onclick="alterarImpeto('${id}', -1)">-</button>
          <button onclick="alterarImpeto('${id}', 1)">+</button>
          <button onclick="alterarImpeto('${id}', 10)">++</button>
          <br>
          <button onclick="removerDoBestiario('${id}')">❌</button>
        </div>
      </div>
    `;

    container.appendChild(card);
  }

  localStorage.setItem('bestiario', JSON.stringify(bestiario));
}


// ===============================
//   ALTERAR HP E ÍMPETO
// ===============================

function alterarHP(id, valor) {
  const c = bestiario[id];
  c.hp += valor;

  if (c.hp < 0) c.hp = 0;
  if (c.hp > c.hpMax) c.hp = c.hpMax;

  renderizarBestiario();
}

function alterarImpeto(id, valor) {
  const c = bestiario[id];
  c.impeto += valor;

  if (c.impeto < 0) c.impeto = 0;

  renderizarBestiario();
}

function removerDoBestiario(id) {
  delete bestiario[id];
  renderizarBestiario();
}


// ===============================
//   ADICIONAR CRIATURA
// ===============================

document.getElementById('btn-add-criatura').addEventListener('click', () => {
  const nome = document.getElementById('nome-criatura').value;
  const imagem = document.getElementById('url-criatura').value;

  const hpManual = parseInt(document.getElementById('hp-criatura')?.value);
  const impManual = parseInt(document.getElementById('imp-criatura')?.value);

  const stt = {
    forca: parseInt(document.getElementById('for-criatura').value) || 0,
    destreza: parseInt(document.getElementById('des-criatura').value) || 0,
    vigor: parseInt(document.getElementById('vig-criatura').value) || 0,
    intelecto: parseInt(document.getElementById('int-criatura').value) || 0,
    aura: parseInt(document.getElementById('aur-criatura').value) || 0,
    mahre: parseInt(document.getElementById('mahre-criatura').value) || 0,
  };

  const hpMax = isNaN(hpManual) ? calcularHP(stt) : hpManual;
  const impeto = isNaN(impManual) ? calcularImpeto(stt) : impManual;

  const DF = calcularDF(stt);
  const DM = calcularDM(stt);

  const id = nome.toLowerCase().replace(/\s/g, '_') + '_' + Date.now();

  bestiario[id] = {
    nome,
    imagem,
    stt,
    hpMax,
    hp: hpMax,
    impeto,
    DF,
    DM
  };

  renderizarBestiario();

  // limpar inputs
  document.getElementById('nome-criatura').value = '';
  document.getElementById('url-criatura').value = '';
  ['for','des','vig','int','aur','hp','imp'].forEach(s => {
    const campo = document.getElementById(`${s}-criatura`);
    if (campo) campo.value = '';
  });
});


// ===============================
//   ENVIAR PARA FICHA PRINCIPAL
// ===============================

function mandarProSite(id) {
  salvar();
  const criatura = bestiario[id];
  const stt = criatura.stt;

  const ficha = document.querySelector('#Stts-wrapper');
  const nome = document.getElementById('nome');
  const img = document.getElementById('imagem-preview');
  img.src = criatura.imagem;
  nome.value = criatura.nome;

  if (ficha) {
    const inputs = ficha.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
      const id = input.id;
      input.value = stt[id] || 0;
    });
  }
}


// ===============================
//   MODAL
// ===============================

const openBtn = document.getElementById('open-bestiario');
const modal = document.getElementById('bestiario-modal');
const closeBtn = document.getElementById('close-bestiario');

openBtn.addEventListener('click', () => {
  modal.style.display = 'block';
  renderizarBestiario();
});

closeBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === modal) modal.style.display = 'none';
});


// ===============================
//   SALVAR / CARREGAR
// ===============================

function salvar(){
  const dados = montarDados();
  localStorage.setItem(Key, JSON.stringify(dados));
}

function carregar(){
  const dados = JSON.parse(localStorage.getItem(Key));
  if (!dados) return;

  const ficha = dados.ficha;

  document.getElementById('nome').value = ficha.nome || '';
  document.getElementById('forca').value = ficha.forca || 0;
  document.getElementById('destreza').value = ficha.destreza || 0;
  document.getElementById('vigor').value = ficha.vigor || 0;
  document.getElementById('intelecto').value = ficha.intelecto || 0;
  document.getElementById('aura').value = ficha.aura || 0;

  const url = ficha.imagem || '';
  document.getElementById('imagem-url').value = url;

  const img = document.getElementById('imagem-preview');
  img.src = url;
  img.style.display = url ? 'block' : 'none';
}

window.onload = carregar;

document
  .querySelectorAll('#nome, #forca, #destreza, #vigor, #intelecto, #aura, #imagem-url')
  .forEach(campo => campo.addEventListener('input', salvar));
