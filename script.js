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
  'Resistencia': 'vigor',
  'Teste Força': 'forca',
  'Teste Destreza': 'destreza',
  'Teste Vigor': 'vigor',
  'Teste Intelecto': 'intelecto',
  'Teste Aura': 'aura',
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
  const img = document.getElementById('imagem-preview');
  if (this.value) {
    img.src = this.value;
    img.style.display = 'block';
  } else {
    img.style.display = 'none';
  }
});

function calculaNivel(total, dificuldade) {
  let level = '';

  if (dificuldade === 'Fácil') {
    if (total >= 45) level = 'Criticamente Extremo';
    else if (total >= 38) level = 'Extremo';
    else if (total >= 28) level = 'Bom';
    else if (total >= 17) level = 'Normal';
    else if (total >= 7) level = 'Ruim';        // Aqui caiu um pouco, pra ficar mais alcançável
    else level = 'Erro Fatal';

  } else if (dificuldade === 'Médio') {
    if (total >= 47) level = 'Criticamente Extremo';
    else if (total >= 40) level = 'Extremo';
    else if (total >= 30) level = 'Bom';
    else if (total >= 20) level = 'Normal';
    else if (total >= 8) level = 'Ruim';        // Mesma pegada
    else level = 'Erro Fatal';

  } else if (dificuldade === 'Difícil') {
    if (total >= 49) level = 'Criticamente Extremo';
    else if (total >= 42) level = 'Extremo';
    else if (total >= 33) level = 'Bom';
    else if (total >= 23) level = 'Normal';
    else if (total >= 10) level = 'Ruim';       // Um pouco mais alto que o fácil, mas alcançável
    else level = 'Erro Fatal';

  } else if (dificuldade === 'Extremo') {
    if (total >= 52) level = 'Criticamente Extremo';
    else if (total >= 45) level = 'Extremo';
    else if (total >= 36) level = 'Bom';
    else if (total >= 26) level = 'Normal';
    else if (total >= 13) level = 'Ruim';       // Ruim, mas não impossível
    else level = 'Erro Fatal';
  }

  return level;
}

// Rolagem punitiva com curva de sino
function rolarDado() {
  let soma = 0;
  for (let i = 0; i < 7; i++) {
    soma += Math.random();
  }
  const normalizado = soma / 7;
  const resultado = Math.round(normalizado * 49) + 1;
  return resultado;
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
  const nome = ficha.nome;
  const imagemURL = ficha.imagem;

  if (!atributoNome) return alert('Ação inválida');

  const atributoValor = ficha[atributoNome] || 0;
  const dificuldade = document.querySelector('.difficulty-btn.active').dataset.difficulty;

  const { roll, rolls } = rolarComModo();
  const total = roll + atributoValor;
  const nivel = calculaNivel(total, dificuldade);
  const acertou = (nivel !== 'Erro Fatal' && nivel !== 'Ruim') ? 'Acertou!' : 'Errou!';

  const resultadoTexto = 
`⎯⎯⎯⎯⎯⎯⎯⎯・${nome || 'Sem nome'}・⎯⎯⎯⎯⎯⎯⎯⎯
➸ Ação: ${acao}
¦ Modo: ${modoRolagem}
〆 Dificuldade: ${dificuldade}
♤ Rolagens: ${rolls.join(', ')}
⍀ Atributo (${atributoNome}): ${atributoValor}
が Total: ${total}
⎯⎯⎯⎯⎯・${nivel}・⎯⎯⎯⎯⎯`;

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
        title: `Player: ${ficha.nome}`,
        image: { url: imagemURL },
        color: 3447003
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

  document.querySelectorAll('#nome, #imagem-url, #forca, #destreza, #vigor, #intelecto, #aura').forEach(input => {
    input.addEventListener('input', salvarFicha);
  });

  document.getElementById('vantagem-btn').addEventListener('click', () => setModo('vantagem'));
  document.getElementById('normal-btn').addEventListener('click', () => setModo('normal'));
  document.getElementById('desvantagem-btn').addEventListener('click', () => setModo('desvantagem'));

  document.querySelectorAll('.acao-btn').forEach(botao => {
    botao.addEventListener('click', () => rolarAcao(botao.textContent));
  });

  setModo('normal');

  document.querySelectorAll('.difficulty-btn').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });
});
