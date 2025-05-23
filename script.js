let modoRolagem = 'normal';

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

document.getElementById('imagem-url').addEventListener('input', function() {
  const url = this.value;
  const img = document.getElementById('imagem-preview');
  img.src = url;
  img.style.display = url ? 'block' : 'none';
});

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
    if (total >= 55) level = 'Criticamente Extremo';
    else if (total >= 47) level = 'Extremo';
    else if (total >= 40) level = 'Bom';
    else if (total >= 30) level = 'Normal';
    else if (total >= 15) level = 'Ruim';
    else level = 'Erro Fatal';
  }

  return level;
}

function rolarDado() {
  return Math.floor(Math.random() * 50) + 1;
}

function rolarComModo() {
  const primeira = rolarDado();
  if (modoRolagem === 'normal') return { roll: primeira, rolls: [primeira] };
  const segunda = rolarDado();
  const rollFinal = (modoRolagem === 'vantagem') ? Math.max(primeira, segunda) : Math.min(primeira, segunda);
  return { roll: rollFinal, rolls: [primeira, segunda] };
}

function rolarAcao(acao) {
  const ficha = pegarFicha();
  const atributoNome = acaoAtributo[acao];
  if (!atributoNome) return alert('Ação inválida');

  const atributoValor = ficha[atributoNome] || 0;
  const dificuldade = document.getElementById('difficulty-select').value;

  const { roll, rolls } = rolarComModo();
  const total = roll + atributoValor;
  const nivel = calculaNivel(total, dificuldade);

  const acertou = (nivel !== 'Erro Fatal' && nivel !== 'Ruim') ? 'Acertou!' : 'Errou!';

  const resultadoTexto = 
`---------------------------------------------------
🛡️ Player: ${ficha.nome || 'Sem nome'}
🎲 Ação: ${acao}
🎯 Modo: ${modoRolagem}
📊 Dificuldade: ${dificuldade}
🎲 Rolagens: ${rolls.join(', ')}
💪 Atributo (${atributoNome}): ${atributoValor}
💥 Total: ${total}
---------------------------------------------------
✅ Resultado: ${acertou} — ${nivel}`;

  document.getElementById('result-area').textContent = resultadoTexto;
  enviarDiscord(resultadoTexto);
}

function setModo(modo) {
  modoRolagem = modo;
  document.getElementById('vantagem-btn').classList.remove('active');
  document.getElementById('normal-btn').classList.remove('active');
  document.getElementById('desvantagem-btn').classList.remove('active');
  document.getElementById(`${modo}-btn`).classList.add('active');
}

function salvarFicha() {
  const ficha = pegarFicha();
  localStorage.setItem('fichaRPG', JSON.stringify(ficha));
}

function carregarFicha() {
  const fichaSalva = localStorage.getItem('fichaRPG');
  if (fichaSalva) {
    const ficha = JSON.parse(fichaSalva);
    document.getElementById('nome').value = ficha.nome || '';
    document.getElementById('imagem-url').value = ficha.imagem || '';
    const img = document.getElementById('imagem-preview');
    img.src = ficha.imagem;
    img.style.display = ficha.imagem ? 'block' : 'none';
    document.getElementById('forca').value = ficha.forca || 0;
    document.getElementById('destreza').value = ficha.destreza || 0;
    document.getElementById('vigor').value = ficha.vigor || 0;
    document.getElementById('intelecto').value = ficha.intelecto || 0;
    document.getElementById('aura').value = ficha.aura || 0;
  }
}

const WEBHOOK_URL = 'https://discord.com/api/webhooks/1375277583591280720/bUY8MULq_Ykkf0x9Da9pUmX4K03sLmHLVCRlCUrLC67N_rHDbLy1eFu_wi5jqFTHTzBv';

function enviarDiscord(mensagem) {
  fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: mensagem }),
  }).catch(err => console.error('Erro ao enviar mensagem pro Discord:', err));
}

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
});
