const attackOptions = {
  melee: [
    { name: "Soco", damageDice: "1d6" },
    { name: "Katana", damageDice: "3d4" },
    { name: "Adaga", damageDice: "2d6" },
    { name: "Machado", damageDice: "2d9" },
    { name: "Mace", damageDice: "2d6" },
    { name: "Outro", damageDice: "custom" }
  ],
  ranged: [
    { name: "Pistola", damageDice: "2d11" },
    { name: "Escopeta", damageDice: "12d6" },
    { name: "Sniper", damageDice: "5d10" },
    { name: "Outro", damageDice: "custom" }
  ],
  elemental: [
    { name: "Nox", damageDice: "custom" },
    { name: "Lúmen", damageDice: "custom" },
    { name: "Gaius", damageDice: "custom" },
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

function rollDice(dice) {
  const [count, sides] = dice.split("d").map(Number);
  let total = 0;
  for (let i = 0; i < count; i++) {
    total += Math.floor(Math.random() * sides) + 1;
  }
  return total;
}

function calculateFinalDamage() {
  const playerName = document.getElementById('playerName').value || "Jogador";
  const category = document.getElementById('category').value;
  const attackSelect = document.getElementById('attack');
  const attack = attackSelect.value;
  const accuracy = document.getElementById('accuracy').value;
  const armor = parseInt(document.getElementById('armor').value) || 0;

  let multiplier = 1;
  switch (accuracy) {
    case 'bom': multiplier = 1.25; break;
    case 'extremo': multiplier = 1.5; break;
    case 'critico': multiplier = 2; break;
  }

  let diceFormula = attackSelect.selectedOptions[0]?.dataset.dice;

  // Se "Outro", pega a fórmula extra
  if (diceFormula === "custom") {
    diceFormula = document.getElementById('extraDamageFormula').value;
  }

  if (!diceFormula || !diceFormula.includes("d")) {
    document.getElementById("resultadoDano").textContent = "⚠️ Fórmula de dano inválida.";
    return;
  }

  const baseDamage = rollDice(diceFormula);
  const finalDamage = Math.max(0, Math.floor(baseDamage * multiplier - armor));

  const tipoExtra = document.getElementById('extraDamageType').value || "";

  const template =
`⎯⎯⎯⎯⎯⎯⎯⎯・${playerName}・⎯⎯⎯⎯⎯⎯⎯⎯
➸ Ataque: ${attack} ${tipoExtra ? `(${tipoExtra})` : ""}
➸ Dano: ${finalDamage} 🎲 (${diceFormula} x${multiplier} - ${armor} de armadura)
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯・・・・⎯⎯⎯⎯⎯⎯⎯⎯`;

  document.getElementById("result").textContent = template;
}

window.onload = () => {
  updateAttacks();

  // Ativa botão se ainda não estava
  const btn = document.querySelector("button[onclick='calculateFinalDamage()']");
  if (btn) {
    btn.addEventListener("click", calculateFinalDamage);
  }
};
