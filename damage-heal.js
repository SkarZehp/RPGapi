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

  fetch("https://discord.com/api/webhooks/1375277583591280720/bUY8MULq_Ykkf0x9Da9pUmX4K03sLmHLVCRlCUrLC67N_rHDbLy1eFu_wi5jqFTHTzBv", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content: template })
  });
}

window.onload = () => {
  updateAttacks();

  // Ativa botão se ainda não estava
  const btn = document.querySelector("button[onclick='calculateFinalDamage()']");
  if (btn) {
    btn.addEventListener("click", calculateFinalDamage);
  }
};
