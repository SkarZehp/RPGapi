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

// Rola 2d12
function rolar2d12() {
  const dado1 = Math.floor(Math.random() * 12) + 1;
  const dado2 = Math.floor(Math.random() * 12) + 1;
  return dado1 + dado2;
}

// Calcula nível de sucesso baseado na dificuldade
function calculaNivel(total, dificuldadeValor) {
  if (total >= dificuldadeValor + 8) return 'Extremo';
  if (total >= dificuldadeValor + 4) return 'Bom';
  if (total >= dificuldadeValor) return 'Normal';
  return 'Falha';
}

function getDificuldadeValor(nome) {
  const dfCustom = parseInt(document.getElementById('df-custom').value);
  if (!isNaN(dfCustom) && dfCustom > 0) {
    return dfCustom; // Prioriza DF custom se preenchido
  }

  const dificuldadeMap = {
    'Fácil': 8,
    'Médio': 11,
    'Difícil': 14,
    'Muito difícil': 17,
    'Extremo': 20,
    'Insano': 23
  };
  return dificuldadeMap[nome] || 10;
}

// Atualiza display do ímpeto
function atualizarImpulsoDisplay() {
  document.getElementById('impulso-display').textContent = impulso;
  document.getElementById('df-custom').value = dfCustom;

}

// Aumenta ímpeto
function aumentarImpulso() {
  impulso += 4;
  atualizarImpulsoDisplay();
}

// Diminui ímpeto
function diminuirImpulso() {
  impulso -= 4;
  atualizarImpulsoDisplay();
}

// Rola a ação e mostra resultado + manda pro Discord
function rolarAcao(acao) {
  const ficha = pegarFicha();
  const atributoNome = acaoAtributo[acao];
  if (!atributoNome) return alert('Ação inválida');

  const atributoValor = ficha[atributoNome] || 0;
  const dificuldadeNome = document.querySelector('.difficulty-btn.active').dataset.difficulty;
  const dificuldadeValor = getDificuldadeValor(dificuldadeNome);

  // Rolagem + ímpeto
  const rollBase = rolar2d12() + Math.floor(atributoValor / 2);
  const total = rollBase + impulso;

  const nivel = calculaNivel(total, dificuldadeValor);

  const resultadoTexto =
`⎯⎯⎯⎯⎯⎯⎯⎯・${ficha.nome || 'Sem nome'}・⎯⎯⎯⎯⎯⎯⎯⎯
➸ Ação: ${acao}
〆 Dificuldade: ${dificuldadeNome} (${dificuldadeValor})
⍀ Atributo (${atributoNome}): ${atributoValor}
♤ Rolagem&Stt(${rollBase}) + IMP(${impulso}) = ${total}
⎯⎯⎯⎯⎯・${nivel}・⎯⎯⎯⎯⎯`;

  document.getElementById('result-area').textContent = resultadoTexto;
  enviarDiscord(resultadoTexto, ficha.imagem);

  // Reset impulso para neutro
  impulso = 0;
  atualizarImpulsoDisplay();
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

  document.getElementById('impulso-plus').addEventListener('click', aumentarImpulso);
  document.getElementById('impulso-minus').addEventListener('click', diminuirImpulso);

  document.querySelectorAll('.acao-btn').forEach(botao => {
    botao.addEventListener('click', () => rolarAcao(botao.textContent));
  });

  document.querySelectorAll('.difficulty-btn').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
    });
  });

  atualizarImpulsoDisplay();
});
