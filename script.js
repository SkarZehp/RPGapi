// Controle do modo de rolagem
let modoRolagem = 'normal';

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
};

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
  const url = this.value;
  const img = document.getElementById('imagem-preview');
  if (url) {
    img.src = url;
    img.style.display = 'block';
  } else {
    img.style.display = 'none';
  }
});

// Calcula nível conforme dificuldade e total
function calculaNivel(total, dificuldade) {
  let level = '';

  if (dificuldade === 'Fácil') {
    if (total >= 45) level = 'Criticamente Extremo';
    else if (total >= 35) level = 'Extremo';
    else if (total >= 20) level = 'Bom';
    else if (total >= 10) level = 'Normal';
    else if (total >= 5) level = 'Ruim';
    else level = 'Erro Fatal';

  } else if (dificuldade === 'Médio') {
    if (total >= 47) level = 'Criticamente Extremo';
    else if (total >= 40) level = 'Extremo';
    else if (total >= 30) level = 'Bom';
    else if (total >= 20) level = 'Normal';
    else if (total >= 10) level = 'Ruim';
    else level = 'Erro Fatal';

  } else if (dificuldade === 'Difícil') {
    if (total >= 49) level = 'Criticamente Extremo';
    else if (total >= 45) level = 'Extremo';
    else if (total >= 35) level = 'Bom';
    else if (total >= 25) level = 'Normal';
    else if (total >= 15) level = 'Ruim';
    else level = 'Erro Fatal';

  } else if (dificuldade === 'Extremo') {
    if (total >= 60) level = 'Criticamente Extremo';
    else if (total >= 50) level = 'Extremo';
    else if (total >= 40) level = 'Bom';
    else if (total >= 30) level = 'Normal';
    else if (total >= 20) level = 'Ruim';
    else level = 'Erro Fatal';
  }

  return level;
}

// Rola dado 1-50
function rolarDado() {
  return Math.floor(Math.random() * 50) + 1;
}

// Rola com modo normal, vantagem ou desvantagem
function rolarComModo() {
  const primeira = rolarDado();
  if (modoRolagem === 'normal') return { roll: primeira, rolls: [primeira] };

  const segunda = rolarDado();
  const rollFinal = (modoRolagem === 'vantagem') ? Math.max(primeira, segunda) : Math.min(primeira, segunda);

  return { roll: rollFinal, rolls: [primeira, segunda] };
}

// Rola a ação e mostra resultado + manda pro Discord
function rolarAcao(acao) {
  const ficha = pegarFicha();
  const atributoNome = acaoAtributo[acao];
  const nome = document.getElementById('nome').value;
const imagemURL = document.getElementById('imagem-url').value;

  if (!atributoNome) return alert('Ação inválida');

  const atributoValor = ficha[atributoNome] || 0;
  const dificuldade = document.querySelector('.difficulty-btn.active').dataset.difficulty;

  const { roll, rolls } = rolarComModo();
  const total = roll + atributoValor;
  const nivel = calculaNivel(total, dificuldade);

  const acertou = (nivel !== 'Erro Fatal' && nivel !== 'Ruim') ? 'Acertou!' : 'Errou!';

  const resultadoTexto = 
  `⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯・${ficha.nome || 'Sem nome'}・⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯
  ` +
    `➸ ↝𝘈ç𝘢𝘰: ${acao}\n` +
    `¦ ‡ 𝘔𝘰𝘥𝘰: ${modoRolagem}\n` +
    `〆¨ 𝘋𝘪𝘧𝘪𝘤𝘶𝘭𝘥𝘢𝘥𝘦: ${dificuldade}\n` +
    `♤ 𝘙𝘰𝘭𝘢𝘨𝘦𝘯𝘴: ${rolls.join(', ')}\n` +
    `⍀ 𝘈𝘵𝘳𝘪𝘣𝘶𝘵𝘰:  (${atributoNome}): ${atributoValor}\n` +
    `が 𝘛𝘰𝘵𝘢𝘭: ${total}\n` +
  `⎯⎯⎯⎯⎯⎯⎯・${nivel}・⎯⎯⎯⎯⎯⎯⎯⎯⎯`

  document.getElementById('result-area').textContent = resultadoTexto;
  enviarDiscord(resultadoTexto, imagemURL);
}

// Define modo de rolagem e atualiza botão ativo
function setModo(modo) {
  modoRolagem = modo;

  document.getElementById('vantagem-btn').classList.remove('active');
  document.getElementById('normal-btn').classList.remove('active');
  document.getElementById('desvantagem-btn').classList.remove('active');

  document.getElementById(`${modo}-btn`).classList.add('active');
}

// Salva ficha no localStorage
function salvarFicha() {
  const ficha = pegarFicha();
  localStorage.setItem('fichaRPG', JSON.stringify(ficha));
}

// Carrega ficha do localStorage
function carregarFicha() {
  const fichaSalva = localStorage.getItem('fichaRPG');
  if (fichaSalva) {
    const ficha = JSON.parse(fichaSalva);
    if (ficha.nome !== undefined) document.getElementById('nome').value = ficha.nome;
    if (ficha.imagem !== undefined) {
      document.getElementById('imagem-url').value = ficha.imagem;
      const img = document.getElementById('imagem-preview');
      img.src = ficha.imagem;
      img.style.display = ficha.imagem ? 'block' : 'none';
    }
    if (ficha.forca !== undefined) document.getElementById('forca').value = ficha.forca;
    if (ficha.destreza !== undefined) document.getElementById('destreza').value = ficha.destreza;
    if (ficha.vigor !== undefined) document.getElementById('vigor').value = ficha.vigor;
    if (ficha.intelecto !== undefined) document.getElementById('intelecto').value = ficha.intelecto;
    if (ficha.aura !== undefined) document.getElementById('aura').value = ficha.aura;
  }
}

// Discord webhook URL
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1375277583591280720/bUY8MULq_Ykkf0x9Da9pUmX4K03sLmHLVCRlCUrLC67N_rHDbLy1eFu_wi5jqFTHTzBv';

function enviarDiscord(mensagem, imagemURL) {
  const ficha = pegarFicha();
  const payload = {
    content: mensagem,
    embeds: [
      {
        title: `Player: ${ficha.nome} ` ,
        image: {
          url: imagemURL
        },
        color: 3447003 // opcional: cor do embed
      }
    ]
  };

  fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(err => console.error('Erro ao enviar mensagem pro Discord:', err));
}


// Setup inicial
document.addEventListener('DOMContentLoaded', () => {
  carregarFicha();

  
  // Eventos para salvar ficha ao alterar qualquer campo
  document.querySelectorAll('#nome, #imagem-url, #forca, #destreza, #vigor, #intelecto, #aura').forEach(input => {
    input.addEventListener('input', salvarFicha);
  });

  // Botões modo de rolagem
  document.getElementById('vantagem-btn').addEventListener('click', () => setModo('vantagem'));
  document.getElementById('normal-btn').addEventListener('click', () => setModo('normal'));
  document.getElementById('desvantagem-btn').addEventListener('click', () => setModo('desvantagem'));

  // Botões ações
  document.querySelectorAll('.acao-btn').forEach(botao => {
    botao.addEventListener('click', () => rolarAcao(botao.textContent));
  });

  // Define modo normal ativo no começo
  setModo('normal');

  // *** COLE AQUI ESSE CÓDIGO PRA DIFICULDADE ***
  const difficultyButtons = document.querySelectorAll('.difficulty-btn');
  difficultyButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active dos outros
      difficultyButtons.forEach(btn => btn.classList.remove('active'));
      // Marca o clicado como ativo
      button.classList.add('active');
    });
  });
});