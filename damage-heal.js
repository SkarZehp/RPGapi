// Variáveis para armazenar os dados
let selectedDamage = null;
let selectedDice = null;
let selectedHeal = null;
let damageWindow = null;
let healWindow = null;

function openDamageMenu() {
  if (damageWindow && !damageWindow.closed) {
    damageWindow.focus();
  } else {
    damageWindow = window.open('', 'damageWindow', 'width=400,height=500');
    damageWindow.document.write(`
// Dentro do damageWindow.document.write, substitui o style por:

<style>
  body {
    font-family: Arial, sans-serif;
    padding: 10px;
    background-color: #121212; /* preto bem escuro */
    color: #f5d742; /* amarelo fosco */
  }
  button {
    margin: 5px;
    padding: 8px 12px;
    font-size: 14px;
    cursor: pointer;
    background-color: #2a2a2a; /* botão escuro */
    color: #f5d742; /* texto amarelo */
    border: 2px solid #f5d742;
    border-radius: 5px;
    transition: background-color 0.3s, color 0.3s;
  }
  button:hover {
    background-color: #f5d742; /* amarelo de hover */
    color: #121212; /* texto preto no hover */
  }
  #accuracy-menu button {
    margin-right: 10px;
  }
  #result {
    margin-top: 15px;
    font-weight: bold;
    border-top: 1px solid #f5d742;
    padding-top: 10px;
  }
  h3 {
    border-bottom: 1px solid #f5d742;
    padding-bottom: 5px;
  }
</style>

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
        // Essas funções ficam dentro da popup para funcionar direto aqui
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
          const multiplier = {
            normal: 1,
            bom: 1.25,
            extremo: 1.5,
            critico: 2
          }[level];

          const result = rollDice(window.selectedDice) * multiplier;
          document.getElementById('result').innerText = 
            'Dano de ' + window.selectedDamage + ' (' + level + '): ' + Math.round(result);
        }
      </script>
    `);
    damageWindow.document.close();
  }
}

function openHealMenu() {
  if (healWindow && !healWindow.closed) {
    healWindow.focus();
  } else {
    healWindow = window.open('', 'healWindow', 'width=400,height=400');
    healWindow.document.write(`
 // Dentro do damageWindow.document.write, substitui o style por:

<style>
  body {
    font-family: Arial, sans-serif;
    padding: 10px;
    background-color: #121212; /* preto bem escuro */
    color: #f5d742; /* amarelo fosco */
  }
  button {
    margin: 5px;
    padding: 8px 12px;
    font-size: 14px;
    cursor: pointer;
    background-color: #2a2a2a; /* botão escuro */
    color: #f5d742; /* texto amarelo */
    border: 2px solid #f5d742;
    border-radius: 5px;
    transition: background-color 0.3s, color 0.3s;
  }
  button:hover {
    background-color: #f5d742; /* amarelo de hover */
    color: #121212; /* texto preto no hover */
  }
  #accuracy-menu button {
    margin-right: 10px;
  }
  #result {
    margin-top: 15px;
    font-weight: bold;
    border-top: 1px solid #f5d742;
    padding-top: 10px;
  }
  h3 {
    border-bottom: 1px solid #f5d742;
    padding-bottom: 5px;
  }
</style>

      <h3>Escolha o tipo de Cura:</h3>
      <button onclick="selectHeal('Improvisada', '1d10')">Improvisada</button>
      <button onclick="selectHeal('Medkit Simples', '3d8')">Medkit Simples</button>
      <button onclick="selectHeal('Medkit Profissional', '4d6')">Medkit Profissional</button>
      <div id="result">Escolha o tipo de cura acima</div>

      <script>
        function selectHeal(name, dice) {
          const result = rollDice(dice);
          document.getElementById('result').innerText = 'Cura ' + name + ': ' + result;
        }

        function rollDice(dice) {
          const [count, sides] = dice.toLowerCase().split('d').map(Number);
          let total = 0;
          for (let i = 0; i < count; i++) {
            total += Math.floor(Math.random() * sides) + 1;
          }
          return total;
        }
      </script>
    `);
    healWindow.document.close();
  }
}
