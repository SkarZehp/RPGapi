let damageWindow;
let healWindow;

function openDamageMenu() {
  if (damageWindow && !damageWindow.closed) {
    damageWindow.focus();
  } else {
    damageWindow = window.open('', 'damageWindow', 'width=500,height=650');

    damageWindow.document.write(`
      <html>
      <head>
        <link rel="stylesheet" href="dmgheal.css">
        <title>Calculadora de Dano</title>
      </head>
      <body>
        <h3>Jogador:</h3>
        <input type="text" id="playerName" placeholder="Nome do player" style="width: 100%; padding: 5px; margin-bottom: 15px;">

        <h3>Categoria:</h3>
        <select id="category" onchange="updateAttacks()">
          <option value="">--Selecione--</option>
          <option value="melee">Corpo-a-Corpo</option>
          <option value="ranged">Longo Alcance</option>
          <option value="elemental">Magia Elemental</option>
        </select>

        <h3>Ataque:</h3>
        <select id="attack" onchange="checkOtherOption()" disabled>
          <option value="">--Escolha uma categoria primeiro--</option>
        </select>

        <div id="extraDamageContainer" style="display:none; margin-top:10px;">
          <h4>Tipo do Ataque:</h4>
          <input type="text" id="extraDamageType" placeholder="Ex: plasma, sombra..." style="width:100%; padding:5px;">
          <h4>Fórmula do Dano:</h4>
          <input type="text" id="extraDamageFormula" placeholder="Ex: 1d6+2" style="width:100%; padding:5px;">
        </div>

        <h3>Nível de Acerto:</h3>
        <select id="accuracy">
          <option value="normal">Normal</option>
          <option value="bom">Bom</option>
          <option value="extremo">Extremo</option>
          <option value="critico">Crítico</option>
        </select>

        <h3>Armadura do Alvo:</h3>
        <input type="number" id="armor" value="0" style="width: 100px; padding: 5px;">

        <br><br><button onclick="calculateFinalDamage()">Calcular Dano</button>

        <div id="result" style="margin-top:20px; font-weight:bold;">Resultado aparecerá aqui</div>

        <script>
          const attacks = {
            melee: {
              "Soco": "1d8",
              "Facada": "1d10",
              "Katana": "2d6+2",
              "Machado": "2d6+3"
            },
            ranged: {
              "Pistola": "2d6",
              "Escopeta": "2d6+2",
              "Metralhadora": "3d4+3",
              "Sniper": "3d6+4",
              "Granada": "3d6+3"
            },
            elemental: {
              "Magia": "1d12"
            }
          };

          const multipliers = {
            normal: 1,
            bom: 1.2,
            extremo: 1.5,
            critico: 2
          };

          function updateAttacks() {
            const category = document.getElementById('category').value;
            const attackSelect = document.getElementById('attack');
            attackSelect.innerHTML = '';
            attackSelect.disabled = !category;

            document.getElementById('extraDamageContainer').style.display = 'none';
            document.getElementById('extraDamageType').value = '';
            document.getElementById('extraDamageFormula').value = '';

            if (category && attacks[category]) {
              for (let name in attacks[category]) {
                const opt = document.createElement('option');
                opt.value = attacks[category][name];
                opt.textContent = name;
                attackSelect.appendChild(opt);
              }

              const otherOpt = document.createElement('option');
              otherOpt.value = 'outro';
              otherOpt.textContent = 'Outro';
              attackSelect.appendChild(otherOpt);
            }
          }

          function checkOtherOption() {
            const attackSelect = document.getElementById('attack');
            const selected = attackSelect.options[attackSelect.selectedIndex];
            const isOther = selected && selected.text === 'Outro';
            document.getElementById('extraDamageContainer').style.display = isOther ? 'block' : 'none';
          }

          function rollDice(expr) {
            const match = expr.match(/(\\d*)d(\\d+)(\\+(\\d+))?/);
            if (!match) return 0;
            let [_, qtd, lados, __, bonus] = match;
            qtd = parseInt(qtd) || 1;
            lados = parseInt(lados);
            bonus = parseInt(bonus) || 0;
            let total = 0;
            for (let i = 0; i < qtd; i++) {
              total += Math.floor(Math.random() * lados) + 1;
            }
            return total + bonus;
          }

          function calculateFinalDamage() {
            const playerName = document.getElementById('playerName').value.trim() || 'Desconhecido';

            const attackSelect = document.getElementById('attack');
            const selected = attackSelect.options[attackSelect.selectedIndex];
            let formula = selected?.value;
            let attackName = selected?.text || 'Desconhecido';

            if (formula === 'outro') {
              formula = document.getElementById('extraDamageFormula').value;
              attackName = document.getElementById('extraDamageType').value || 'Outro';
              if (!formula) {
                alert('Preencha a fórmula do dano!');
                return;
              }
            }

            const accuracy = document.getElementById('accuracy').value;
            const multiplier = multipliers[accuracy] || 1;

            const armor = parseFloat(document.getElementById('armor').value) || 0;
            const raw = rollDice(formula);
            const total = Math.max(0, Math.round((raw * multiplier) - armor));

            const template = \`
⎯⎯⎯⎯⎯⎯⎯⎯・\${playerName}・⎯⎯⎯⎯⎯⎯⎯⎯
➸ Ataque: \${attackName}
➸ Dano: \${total}
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯・・・・⎯⎯⎯⎯⎯⎯⎯⎯
\`;

            document.getElementById('result').innerText = template;
          }
        </script>
      </body>
      </html>
    `);

    damageWindow.document.close();
  }
}

function openHealMenu() {
  if (healWindow && !healWindow.closed) {
    healWindow.focus();
  } else {
    healWindow = window.open('', 'healWindow', 'width=400,height=550');

    healWindow.document.write(`
      <html>
      <head>
        <link rel="stylesheet" href="dmgheal.css">
        <title>Calculadora de Cura</title>
      </head>
      <body>
        <h3>Jogador:</h3>
        <input type="text" id="playerName" placeholder="Nome do player" style="width: 100%; padding: 5px; margin-bottom: 15px;">

        <h3>Escolha o tipo de Cura:</h3>
        <div id="heal-buttons" style="margin-bottom: 15px;">
          <button onclick="selectHeal('Cura improvisada', '1d6')">Cura improvisada</button>
          <button onclick="selectHeal('Cura básica', '1d10')">Cura básica</button>
          <button onclick="selectHeal('Medkit', '2d6')">Medkit</button>
          <button onclick="selectHeal('Medkit Profissional', '4d6')">Medkit Profissional</button>
          <button onclick="selectHeal('Cura Maravilhosa', '4d7')">Cura Maravilhosa</button>
          <button onclick="selectHeal('Cura Perfeita', '5d8')">Cura Perfeita</button>
        </div>

        <h3>Nível de Acerto:</h3>
        <div id="accuracy-menu" style="margin-bottom: 15px;">
          <button onclick="rollHeal('normal')">Normal</button>
          <button onclick="rollHeal('bom')">Bom</button>
          <button onclick="rollHeal('extremo')">Extremo</button>
          <button onclick="rollHeal('critico')">Criticamente Extremo</button>
        </div>

        <div id="result">Escolha a cura e o nível de acerto acima</div>

        <script>
          let selectedHeal = null;
          let selectedDice = null;

          function selectHeal(name, dice) {
            selectedHeal = name;
            selectedDice = dice;
            document.getElementById('result').innerText = 'Cura selecionada: ' + name + ' (' + dice + '). Agora escolha o nível de acerto.';
          }

          function rollDice(expr) {
            const match = expr.match(/(\\d*)d(\\d+)/);
            if (!match) return 0;
            let [_, qtd, lados] = match;
            qtd = parseInt(qtd) || 1;
            lados = parseInt(lados);
            let total = 0;
            for (let i = 0; i < qtd; i++) {
              total += Math.floor(Math.random() * lados) + 1;
            }
            return total;
          }

          function rollHeal(level) {
            if (!selectedDice) {
              alert('Selecione o tipo de cura antes de escolher o nível de acerto.');
              return;
            }

            const playerName = document.getElementById('playerName').value.trim() || 'Desconhecido';

            const multipliers = { normal: 1, bom: 1.2, extremo: 1.5, critico: 2 };
            const multiplier = multipliers[level] || 1;
            const base = rollDice(selectedDice);
            const total = Math.round(base * multiplier);

            const template = \`
⎯⎯⎯⎯⎯⎯⎯⎯・\${playerName}・⎯⎯⎯⎯⎯⎯⎯⎯
➸ Cura: \${selectedHeal} (\${level})
➸ Total: \${total}
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯・・・・⎯⎯⎯⎯⎯⎯⎯⎯
\`;

            document.getElementById('result').innerText = template;
          }
        </script>
      </body>
      </html>
    `);

    healWindow.document.close();
  }
}
