<div class="panel">

  <h3>🔑 Gerar Keys</h3>

  <div class="cards">

    <div class="card2">
      <h4>1 Dia</h4>
      <p>10 créditos</p>
      <button onclick="setType('1d',10)">Selecionar</button>
    </div>

    <div class="card2">
      <h4>3 Dias</h4>
      <p>35 créditos</p>
      <button onclick="setType('3d',35)">Selecionar</button>
    </div>

    <div class="card2">
      <h4>7 Dias</h4>
      <p>55 créditos</p>
      <button onclick="setType('7d',55)">Selecionar</button>
    </div>

    <div class="card2">
      <h4>30 Dias</h4>
      <p>100 créditos</p>
      <button onclick="setType('30d',100)">Selecionar</button>
    </div>

  </div>

  <div style="margin-top:20px;text-align:center;">

    <h4>Quantidade</h4>

    <div style="display:flex;justify-content:center;align-items:center;gap:10px;">
      <button onclick="minus()">-</button>

      <div id="qtd">1</div>

      <button onclick="plus()">+</button>
    </div>

    <br>

    <button onclick="generate()">Gerar Keys</button>

  </div>

</div>
