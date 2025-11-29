// Controle do ímpeto e inicializações
let impulso = 0;
let dfCustom = 0;

// Mapeia ação para atributo correspondente
const acaoAtributo = {
  'Ataque': 'forca',
  'Esquiva': 'destreza',
  'Contra-ataque': 'forca',
  'Magia Intelecto': 'intelecto',
  'Magia Aura': 'aura',
  'Atletismo': 'vigor',
  'Mira': 'destreza',
  'Defesa': 'vigor',
  'Resistencia': 'vigor',
  'Teste Força': 'forca',
  'Teste Destreza': 'destreza',
  'Teste Vigor': 'vigor',
  'Teste Intelecto': 'intelecto',
  'Teste Aura': 'aura',
};

// Guarda o último resultado para usar no dano
let ultimoResultado = {};

// =========================
// FUNÇÕES AUXILIARES
// =========================

// Pega os dados da ficha
function pegarFicha() {
  return {
    nome: document.getElementById('nome').value,
    forca: parseInt(document.getElementById('forca').value) || 0,
    destreza: parseInt(document.getElementById('destreza').value) || 0,
    vigor: parseInt(document.getElementById('vigor').value) || 0,
    intelecto: parseInt(document.getElementById('intelecto').value) || 0,
    aura: parseInt(document.getElementById('aura').value) || 0,
    imagem: document.getElementById('imagem-url').value,
  };
}

// Atualiza preview da imagem
document.getElementById('imagem-url').addEventListener('input', function() {
  const img = document.getElementById('imagem-preview');
  img.src = this.value || '';
  img.style.display = this.value ? 'block' : 'none';
});

// Rola 2d12
function rolar2d12() {
  return Math.floor(Math.random() * 12 + 1) + Math.floor(Math.random() * 12 + 1);
}

// Calcula nível de sucesso baseado na dificuldade
function calculaNivel(total, dificuldadeValor) {
  if (total >= dificuldadeValor + 8) return 'Extremo';
  if (total >= dificuldadeValor + 4) return 'Bom';
  if (total >= dificuldadeValor) return 'Normal';
  return 'Falha';
}

// Pega valor numérico da dificuldade
function getDificuldadeValor(nome) {
  const dfInput = parseInt(document.getElementById('df-custom').value);
  if (!isNaN(dfInput) && dfInput > 0) return dfInput;
  const map = { 'Fácil': 8, 'Médio': 11, 'Difícil': 14, 'Muito difícil': 17, 'Extremo': 20, 'Insano': 23 };
  return map[nome] || 10;
}

// =========================
// ÍMPETO
// =========================

function atualizarImpulsoDisplay() {
  document.getElementById('impulso-display').textContent = impulso;
  document.getElementById('df-custom').value = dfCustom || '';
}

function aumentarImpulso() { impulso += 4; atualizarImpulsoDisplay(); }
function diminuirImpulso() { impulso -= 4; atualizarImpulsoDisplay(); }

// =========================
// AÇÃO E RESULTADO
// =========================

function rolarAcao(acao) {
  const ficha = pegarFicha();
  const atributoNome = acaoAtributo[acao];
  if (!atributoNome) return alert('Ação inválida');

  const dificuldadeNome = document.querySelector('.difficulty-btn.active').dataset.difficulty;
  const dificuldadeValor = getDificuldadeValor(dificuldadeNome);

  const atributoValor = ficha[atributoNome] || 0;
  const rollBase = rolar2d12() + Math.floor(atributoValor / 2);
  const total = rollBase + impulso;
  const nivel = calculaNivel(total, dificuldadeValor);

  // Mostra resultado
  const resultadoTexto =
`⎯⎯⎯⎯⎯⎯⎯⎯・${ficha.nome || 'Sem nome'}・⎯⎯⎯⎯⎯⎯⎯⎯
➸ Ação: ${acao}
〆 Dificuldade: ${dificuldadeValor}
⍀ Atributo (${atributoNome}): ${atributoValor}
♤ Roll&Stt(${rollBase}) + IMP(${impulso}) = ${total}
⎯⎯⎯⎯⎯・${nivel}・⎯⎯⎯⎯⎯`;

  document.getElementById('result-area').textContent = resultadoTexto;
  document.getElementById('accuracy-display').textContent = nivel;

  // Salva para usar no dano
  ultimoResultado = { nivel, total, acao, atributoNome, atributoValor, ficha };
  console.log(ultimoResultado);
  // Reset
  dfCustom = 0;
  impulso = 0;
  atualizarImpulsoDisplay();
}

function pegarResultados() { return ultimoResultado; }

// =========================
// EVENTOS DOS BOTÕES
// =========================

document.getElementById('impulso-plus').addEventListener('click', aumentarImpulso);
document.getElementById('impulso-minus').addEventListener('click', diminuirImpulso);

// ⚠️ Aqui estava o problema: antes você não usava dataset.acao
document.querySelectorAll('.acao-btn').forEach(botao => {
  botao.addEventListener('click', () => {
    rolarAcao(botao.dataset.acao);
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // Inicializa display
  atualizarImpulsoDisplay(); // <<---- COLOQUE ESTE TRECHO AQUI ---->>

  // Configura clique nas dificuldades
  document.querySelectorAll('.difficulty-btn').forEach(botao => {
    botao.addEventListener('click', () => {
      // Remove 'active' de todos
      document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
      // Adiciona 'active' ao clicado
      botao.classList.add('active');
    });
  });
});

const Key = 'RPG'

function montarDados(){
  return {
    ficha: pegarFicha()
  }
}

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
  document.getElementById('imagem-url').value = ficha.imagem || '';
  const img = document.getElementById('imagem-preview');
  img.src = ficha.imagem || '';
  img.style.display = ficha.imagem ? 'block' : 'none';
}

window.onload = carregar;
document.querySelectorAll('#nome, #forca, #destreza, #vigor, #intelecto, #aura, #imagem-url')
  .forEach(campo => campo.addEventListener('input', salvar));