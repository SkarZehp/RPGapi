let damageWindow;
let healWindow;

function openDamageMenu() {
  if (damageWindow && !damageWindow.closed) {
    damageWindow.focus();
  } else {
    damageWindow = window.open('', 'damageWindow', 'width=400,height=500');

    damageWindow.document.write(`
      <html>
      <head>
        <link rel="stylesheet" href="dmgheal.css">
        <title>Dano</title>
      </head>
      <body>
        <h3>Escolha o tipo de Dano:</h3>
        <div id="damage-buttons">
          <button onclick="selectDamage('Soco', '1d10')">Soco</button>
          <button onclick="selectDamage('Facada', '1d12')">Facada</button>
          <button onclick="selectDamage('Katana', '3d6')">Katana</button>
          <button onclick="selectDamage('Pistola', '1d12')">Pistola</button>
          <button onclick="selectDamage('Escopeta', '2d12')">Escopeta</button>
          <button onclick="selectDamage('Metralhadora', '3d8')">Metralhadora</button>
          <button onclick="selectDamage('Sniper', '4d8')">Sniper</button>
          <button onclick="selectDamage('Granada', '4d8')">Granada</button>
          <button onclick="selectDamage('Explosão', '6d10')">Explosão</button>
          <button onclick="selectDamage('Machadada', '4d5')">Machado</button>
        </div>

        <h3>Nível de Acerto:</h3>
        <div id="accuracy-menu">
          <button onclick="rollDamage('normal')">Normal</button>
          <button onclick="rollDamage('bom')">Bom</button>
          <button onclick="rollDamage('extremo')">Extremo</button>
          <button onclick="rollDamage('critico')">Criticamente Extremo</button>
        </div>

        <div id="result">Escolha o dano e o nível de acerto acima</div>

        <script>
          function selectDamage(name, dice) {
            window.selectedDamage = name;
            window.selectedDice = dice;
            document.getElementById('result').innerText = 'Dano selecionado: ' + name + ' (' + dice + '). Agora escolha o nível de acerto.';
          }

          function rollDice(dice) {
            const [count, sides] = dice.toLowerCase().split('d').map(Number);
            let total = 0;
            for (let i = 0; i < count; i++) {
              total += Math.floor(Math.random() * sides) + 1;
            }
            return total;
          }

          function rollDamage(level) {
            if (!window.selectedDice) {
              alert('Selecione o tipo de dano antes de escolher o nível de acerto.');
              return;
            }
            const multiplier = { normal: 1, bom: 1.5, extremo: 2, critico: 3 }[level];
            const result = rollDice(window.selectedDice) * multiplier;
            document.getElementById('result').innerText = 
              'Dano de ' + window.selectedDamage + ' (' + level + '): ' + Math.round(result);
          }
        <\/script>
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
    healWindow = window.open('', 'healWindow', 'width=400,height=500');

    healWindow.document.write(`
      <html>
      <head>
        <link rel="stylesheet" href="dmgheal.css">
        <title>Dano</title>
      </head>
      <body>
        <h3>Escolha o tipo de Cura:</h3>
        <div id="heal-buttons">
          <button onclick="selectHeal('Cura improvisada', '1d6')">Cura improvisada</button>
          <button onclick="selectHeal('Cura básica', '1d10')">Cura básica</button>
          <button onclick="selectHeal('Medkit', '2d6')">Medkit</button>
          <button onclick="selectHeal('Medkit Profissional', '4d6')">Medkit Profissional</button>
          <button onclick="selectHeal('Cura Maravilhosa', '4d7')">Cura Maravilhosa</button>
          <button onclick="selectHeal('Cura Perfeita', '5d8')">Cura Perfeita</button>
        </div>

        <h3>Nível de Acerto:</h3>
        <div id="accuracy-menu">
          <button onclick="rollHeal('normal')">Normal</button>
          <button onclick="rollHeal('bom')">Bom</button>
          <button onclick="rollHeal('extremo')">Extremo</button>
          <button onclick="rollHeal('critico')">Criticamente Extremo</button>
        </div>

        <div id="result">Escolha a cura e o nível de acerto acima</div>

        <script>
          function selectHeal(name, dice) {
            window.selectedHeal = name;
            window.selectedDice = dice;
            document.getElementById('result').innerText = 'Cura selecionada: ' + name + ' (' + dice + '). Agora escolha o nível de acerto.';
          }

          function rollDice(dice) {
            const [count, sides] = dice.toLowerCase().split('d').map(Number);
            let total = 0;
            for (let i = 0; i < count; i++) {
              total += Math.floor(Math.random() * sides) + 1;
            }
            return total;
          }

          function rollHeal(level) {
            if (!window.selectedDice) {
              alert('Selecione o tipo de cura antes de escolher o nível de acerto.');
              return;
            }
            const multiplier = { normal: 1, bom: 1.2, extremo: 1.5, critico: 2 }[level];
            const result = rollDice(window.selectedDice) * multiplier;
            document.getElementById('result').innerText = 
              'Cura de ' + window.selectedHeal + ' (' + level + '): ' + Math.round(result);
          }
        <\/script>
      </body>
      </html>
    `);
    healWindow.document.close();
  }
}
