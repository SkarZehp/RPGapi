const bestiario = JSON.parse(localStorage.getItem('bestiario')) || {};

// --- Funções de Renderização ---
function renderizarBestiario() {
  const container = document.getElementById('bestiario-list');
  container.innerHTML = '';
  for (const id in bestiario) {
    const c = bestiario[id];
    const card = document.createElement('div');
    card.className = 'card';
card.innerHTML = `
  <img src="${c.imagem}" class="mini-img" />
  <span class="card-nome">${c.nome}</span>
  <span class="card-hp">HP: ${c.hp}</span>
  <div class="card-controls">
    <button onclick="alterarHP('${id}', -1)">-</button>
    <button onclick="alterarHP('${id}', 1)">+</button>
    </div>
  <span class="card-impeto">Ímpeto: ${c.impeto}</span>
  <div class="card-controls">
    <button onclick="alterarImpeto('${id}', -1)">-</button>
    <button onclick="alterarImpeto('${id}', 1)">+</button>
    <br>
    <button onclick="removerDoBestiario('${id}')">❌</button>
  </div>
`;

    container.appendChild(card);
  }
  localStorage.setItem('bestiario', JSON.stringify(bestiario));
}

// --- Alterar HP e Ímpeto ---
function alterarHP(id, valor) {
  bestiario[id].hp += valor;
  if (bestiario[id].hp < 0) bestiario[id].hp = 0;
  renderizarBestiario();
}

function alterarImpeto(id, valor) {
  bestiario[id].impeto += valor;
  if (bestiario[id].impeto < 0) bestiario[id].impeto = 0;
  renderizarBestiario();
}

function removerDoBestiario(id) {
  delete bestiario[id];
  renderizarBestiario();
}

// --- Adicionar Criatura ---
document.getElementById('btn-add-criatura').addEventListener('click', () => {
  const nome = document.getElementById('nome-criatura').value;
  const imagem = document.getElementById('url-criatura').value;
  const hp = parseInt(document.getElementById('hp-criatura').value) || 10;
  const id = nome.toLowerCase().replace(/\s/g, '_') + '_' + Date.now();

  bestiario[id] = { nome, imagem, hp, impeto: 0 };
  renderizarBestiario();

  // Limpa os campos
  document.getElementById('nome-criatura').value = '';
  document.getElementById('url-criatura').value = '';
  document.getElementById('hp-criatura').value = 10;
});

// --- Abrir/Fechar Modal ---
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
