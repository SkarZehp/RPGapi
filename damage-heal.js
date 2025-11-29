const attackOptions = {
  melee: [
    { name: "Soco", damageDice: "1d6" },
    { name: "Katana", damageDice: "3d4" },
    { name: "Adaga", damageDice: "2d6" },
    { name: "Machado", damageDice: "2d9" },
    { name: "Mace", damageDice: "2d6" },
    { name: "Espada Longa", damageDice: "2d8" },
    { name: "Lança", damageDice: "2d7" },
    { name: "Foice", damageDice: "2d8" },
    { name: "Clava", damageDice: "1d12" },
    { name: "Martelo de Guerra", damageDice: "3d6" },
    { name: "Outro", damageDice: "custom" }
  ],
  ranged: [
    { name: "Pistola", damageDice: "2d11" },
    { name: "Escopeta", damageDice: "12d6" },
    { name: "Sniper", damageDice: "5d10" },
    { name: "Submetralhadora", damageDice: "6d6" },
    { name: "Rifle de Assalto", damageDice: "4d8" },
    { name: "Arco Composto", damageDice: "3d6" },
    { name: "Besta", damageDice: "3d8" },
    { name: "Granada", damageDice: "8d10" },
    { name: "Lança-Chamas", damageDice: "6d6" },
    { name: "Bazuca", damageDice: "10d12" },
    { name: "Outro", damageDice: "custom" }
  ],
  elemental: [
    { name: "Outro", damageDice: "custom" }
  ]
};


function updateAttacks() {
  const category = document.getElementById("category").value;
  const attackSelect = document.getElementById("attack");
  const extraContainer = document.getElementById("extraDamageContainer");

  attackSelect.innerHTML = "";

  if (!category) {
    attackSelect.innerHTML = '<option value="">--Escolha uma categoria primeiro--</option>';
    extraContainer.style.display = "none";
    return;
  }

  attackOptions[category].forEach((attack) => {
    const opt = document.createElement("option");
    opt.value = attack.name;
    opt.dataset.dice = attack.damageDice;
    opt.textContent = attack.name;
    attackSelect.appendChild(opt);
  });

  attackSelect.disabled = false;
  checkOtherOption();
}

function checkOtherOption() {
  const selected = document.getElementById("attack").value;
  const extraContainer = document.getElementById("extraDamageContainer");

  if (selected === "Outro") {
    extraContainer.style.display = "block";
  } else {
    extraContainer.style.display = "none";
  }
}

function rollDice(dice, upgradeRaw) {
  const upgrade = Math.max(0, parseInt(upgradeRaw) || 0);

  if (!dice.includes("d")) {
    console.error("Formato inválido do dado:", dice);
    return { resultado: 0, detalhes: "Erro no dado", dados: [] };
  }

  const [baseCount, baseSides] = dice.toLowerCase().split("d").map(Number);

  if (isNaN(baseCount) || isNaN(baseSides)) {
    console.error("Erro ao converter dado:", baseCount, baseSides);
    return { resultado: 0, detalhes: "Erro no dado", dados: [] };
  }

  const count = baseCount + upgrade;
  const sides = baseSides + upgrade;

  let total = 0;
  const rolls = [];

  for (let i = 0; i < count; i++) {
    const roll = Math.floor(Math.random() * sides) + 1;
    rolls.push(roll);
    total += roll;
  }

  return {
    resultado: total,
    detalhes: `${count}d${sides}`,
    dados: rolls
  };
}


function calculateFinalDamage() {
  const results = pegarResultados();
  const ficha = results.ficha || pegarFicha();
  const playerName = ficha.nome || "Jogador";

  const category = document.getElementById('category').value;
  const attackSelect = document.getElementById('attack');
  const attack = attackSelect.value;

  const total = results.total || 0;
  const dificuldadeNome = document.querySelector('.difficulty-btn.active').dataset.difficulty;
  const dificuldadeValor = getDificuldadeValor(dificuldadeNome);
  const diff = total - dificuldadeValor;

  const atributoValor = ficha[results.atributoNome] || 0;

  let diceFormula = attackSelect.selectedOptions[0]?.dataset.dice;
  if (diceFormula === "custom") {
    diceFormula = document.getElementById('extraDamageFormula').value;
  }

  if (!diceFormula || !diceFormula.includes("d")) {
    document.getElementById("result").textContent = "⚠️ Fórmula de dano inválida.";
    return;
  }

  const upgrade = parseInt(document.getElementById("upgradeInput").value) || 0;
  const baseDamageRoll = rollDice(diceFormula, upgrade);

  let finalDamage = 0;
  let impactCategory = "";

  if (diff <= 0) {
    impactCategory = "Falha";
    finalDamage = 0;
  } else if (diff <= 3) {
    impactCategory = "Suave";
    finalDamage = Math.max(1, Math.floor(baseDamageRoll.resultado / 2));
  } else if (diff <= 6) {
    impactCategory = "Leve";
    finalDamage = baseDamageRoll.resultado;
  } else if (diff <= 10) {
    impactCategory = "Médio";
    finalDamage = baseDamageRoll.resultado + Math.floor(baseDamageRoll.resultado / 2);
  } else if (diff <= 14) {
    impactCategory = "Forte";
    const reroll = Math.floor(Math.random() * 4) + 1; // <<<< menor reroll (1d4)
    finalDamage = baseDamageRoll.resultado + Math.floor(baseDamageRoll.resultado / 2) + reroll;
  } else {
    impactCategory = "Letal";
    finalDamage = Math.floor((baseDamageRoll.resultado + atributoValor) * 1.5); // <<<< multiplicador menor
  }

  const tipoExtra = document.getElementById('extraDamageType').value || "";

  const template =
`⎯⎯⎯⎯⎯⎯⎯⎯・${playerName}・⎯⎯⎯⎯⎯⎯⎯⎯
➸ Ataque: ${attack} ${tipoExtra ? `(${tipoExtra})` : ""}
➸ Categoria de Impacto: ${impactCategory}
➸ Dano: ${finalDamage} 🎲 (${baseDamageRoll.detalhes}${diff <= 3 ? " mínimo" : ""}${diff >=7 && diff <=14 ? " + reroll 1d4" : ""})
➸ Acerto: ${results.nivel}
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯・・・・⎯⎯⎯⎯⎯⎯⎯⎯`;

  document.getElementById("result").textContent = template;

  // Envia pro Discord (se quiser manter)
  fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: template })
  });
}


document.addEventListener('DOMContentLoaded', () => {
  // Inicializa display
  atualizarImpulsoDisplay();

  // Configura clique nas dificuldades
  document.querySelectorAll('.difficulty-btn').forEach(botao => {
    botao.addEventListener('click', () => {
      document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
      botao.classList.add('active');
    });
  });

  // Listener do botão de ataque
  const attackBtn = document.getElementById("attackButton");
  if (attackBtn) {
    attackBtn.addEventListener("click", () => {
      calculateFinalDamage();
    });
  }
});
