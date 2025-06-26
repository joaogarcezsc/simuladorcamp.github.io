let times = [];
let timeSelecionadoA = null;
let timeSelecionadoB = null;
let escalações = { A: [], B: [] };
const formacoesDisponiveis = {
  "4-3-3": [
    "goleiro",
    "zagueiro",
    "zagueiro",
    "lateral",
    "lateral",
    "volante",
    "meia",
    "meia",
    "ponta",
    "ponta",
    "atacante",
  ],
  "4-4-2": [
    "goleiro",
    "zagueiro",
    "zagueiro",
    "lateral",
    "lateral",
    "volante",
    "meia",
    "meia",
    "meia",
    "atacante",
    "atacante",
  ],
  "4-2-3-1": [
    "goleiro",
    "zagueiro",
    "zagueiro",
    "lateral",
    "lateral",
    "volante",
    "volante",
    "ponta",
    "meia",
    "ponta",
    "atacante",
  ],
  "4-3-1-2": [
    "goleiro",
    "zagueiro",
    "zagueiro",
    "lateral",
    "lateral",
    "volante",
    "volante",
    "volante",
    "meia",
    "atacante",
    "atacante",
  ],
  "3-5-2": [
    "goleiro",
    "zagueiro",
    "zagueiro",
    "zagueiro",
    "lateral",
    "lateral",
    "volante",
    "meia",
    "meia",
    "atacante",
    "atacante",
  ],
  "5-3-2": [
    "goleiro",
    "zagueiro",
    "zagueiro",
    "zagueiro",
    "lateral",
    "lateral",
    "volante",
    "meia",
    "meia",
    "atacante",
    "atacante",
  ],
};

async function carregarJSON() {
  const res = await fetch("data.json");
  const data = await res.json();
  times = data.times;

  const timeASelect = document.getElementById("timeA");
  const timeBSelect = document.getElementById("timeB");

  times.forEach((time) => {
    const optA = document.createElement("option");
    optA.value = time.nome;
    optA.textContent = time.nome;
    timeASelect.appendChild(optA);

    const optB = document.createElement("option");
    optB.value = time.nome;
    optB.textContent = time.nome;
    timeBSelect.appendChild(optB);
  });

  timeASelect.addEventListener("change", validarSelecao);
  timeBSelect.addEventListener("change", validarSelecao);
}

function abrirSelecaoTimes() {
  document
    .querySelectorAll(".section")
    .forEach((sec) => (sec.style.display = "none"));
  document.getElementById("selecaoTimes").style.display = "block";
  carregarJSON();
}

function validarSelecao() {
  const a = document.getElementById("timeA").value;
  const b = document.getElementById("timeB").value;
  document.getElementById("btnAvancar").disabled = a === b || !a || !b;
}

function irParaEscalacao() {
  const nomeA = document.getElementById("timeA").value;
  const nomeB = document.getElementById("timeB").value;
  timeSelecionadoA = times.find((t) => t.nome === nomeA);
  timeSelecionadoB = times.find((t) => t.nome === nomeB);

  document.getElementById("selecaoTimes").style.display = "none";
  document.getElementById("escalacaoContainer").style.display = "block";
  carregarFormacoes();
  montarInterfaceEscalacao();

  window.estadoCampoNeutro = document.getElementById("campoNeutro")?.checked;
}

function carregarFormacoes() {
  const formacoesContainer = document.getElementById("formacoes");
  formacoesContainer.classList.add("layout-responsivo");
  const selectA = document.getElementById("formacaoA");
  const selectB = document.getElementById("formacaoB");

  Object.keys(formacoesDisponiveis).forEach((f) => {
    const op1 = document.createElement("option");
    op1.value = f;
    op1.textContent = f;
    selectA.appendChild(op1);

    const op2 = document.createElement("option");
    op2.value = f;
    op2.textContent = f;
    selectB.appendChild(op2);
  });

  selectA.addEventListener("change", montarInterfaceEscalacao);
  selectB.addEventListener("change", montarInterfaceEscalacao);
}

function montarInterfaceEscalacao() {
  const container = document.getElementById("elencoTimes");
  container.innerHTML = "";

  const formA = document.getElementById("formacaoA").value;
  const formB = document.getElementById("formacaoB").value;
  escalações.A = Array(formacoesDisponiveis[formA].length).fill(null);
  escalações.B = Array(formacoesDisponiveis[formB].length).fill(null);

  const blocoA = document.createElement("div");
  const blocoB = document.createElement("div");

  blocoA.innerHTML = `
  <h3><img src="${timeSelecionadoA.logo}" alt="logo" width="30" style="vertical-align: middle; margin-right: 8px;">
  ${timeSelecionadoA.nome} - ${formA}</h3>`;

  blocoB.innerHTML = `
  <h3><img src="${timeSelecionadoB.logo}" alt="logo" width="30" style="vertical-align: middle; margin-right: 8px;">
  ${timeSelecionadoB.nome} - ${formB}</h3>`;

  formacoesDisponiveis[formA].forEach((pos, i) => {
    const linha = document.createElement("div");
    linha.innerHTML = ` ${pos.toUpperCase()}: <span id="slotA${i}">(nenhum)</span> <button class="btn-selecionar" onclick="abrirModal('A', ${i}, '${pos}')">Selecionar</button> <button class="btn-remover" onclick="removerJogador('A', ${i})">X</button> `;
    blocoA.appendChild(linha);
  });

  formacoesDisponiveis[formB].forEach((pos, i) => {
    const linha = document.createElement("div");
    linha.innerHTML = `${pos.toUpperCase()}: <span id="slotB${i}">(nenhum)</span> <button class="btn-selecionar" onclick="abrirModal('B', ${i}, '${pos}')">Selecionar</button> <button class="btn-remover" onclick="removerJogador('B', ${i})">X</button> `;
    blocoB.appendChild(linha);
  });

  container.appendChild(blocoA);
  container.appendChild(blocoB);

  const botaoAutoA = document.createElement("button");
  botaoAutoA.textContent = "Preencher automaticamente A";
  botaoAutoA.onclick = () => preencherAuto("A");
  container.appendChild(botaoAutoA);

  const botaoAutoB = document.createElement("button");
  botaoAutoB.textContent = "Preencher automaticamente B";
  botaoAutoB.onclick = () => preencherAuto("B");
  container.appendChild(botaoAutoB);
}

function removerJogador(timeKey, index) {
  // Zera o slot da escalação
  escalações[timeKey][index] = null;

  // Atualiza visualmente o slot
  const slot = document.getElementById(`slot${timeKey}${index}`);
  if (slot) slot.textContent = "(nenhum)";

  // Revalida se pode avançar para próxima etapa
  verificarSePodeAvancar?.();
}

function preencherAuto(timeKey) {
  const time = timeKey === "A" ? timeSelecionadoA : timeSelecionadoB;
  const formacao = document.getElementById("formacao" + timeKey).value;
  const posicoes = formacoesDisponiveis[formacao];

  const jaUsados = new Set(escalações[timeKey]);
  posicoes.forEach((pos, i) => {
    if (!escalações[timeKey][i]) {
      const jogador = time.jogadores.find(
        (j) => j.posicao === pos && !jaUsados.has(j.nome)
      );
      if (jogador) {
        escalações[timeKey][i] = jogador.nome;
        document.getElementById(`slot${timeKey}${i}`).textContent =
          jogador.nome;
        jaUsados.add(jogador.nome);
      }
    }
  });

  verificarSePodeAvancar();
}

function verificarSePodeAvancar() {
  const completos =
    escalações.A.every((n) => n) && escalações.B.every((n) => n);
  document.getElementById("botaoConfirmarEscalacao").disabled = !completos;
}

function abrirModal(timeKey, index, posicao) {
  const modal = document.getElementById("modal");
  const lista = document.getElementById("listaJogadores");
  lista.innerHTML = "";

  const time = timeKey === "A" ? timeSelecionadoA : timeSelecionadoB;
  const jogadores = time.jogadores.filter((j) => j.posicao === posicao);
  const usados = escalações[timeKey].filter((nome, i) => i !== index);

  if (jogadores.length === 0) {
    lista.innerHTML = "<p>Nenhum jogador disponível para essa posição.</p>";
  } else {
    jogadores.forEach((j) => {
      const botao = document.createElement("button");
      botao.textContent = j.nome;
      botao.disabled = usados.includes(j.nome); // bloqueia se já estiver usado
      botao.onclick = () => selecionarJogador(timeKey, index, j.nome);
      lista.appendChild(botao);
    });
  }

  modal.dataset.timeKey = timeKey;
  modal.dataset.index = index;
  modal.style.display = "block";
}

function selecionarJogador(timeKey, index, nome) {
  const escala = escalações[timeKey];

  const jogadorAnterior = escala[index];
  if (jogadorAnterior) {
    const usados = escala.filter((n, i) => i !== index);
    escalações[timeKey] = escala.map((n, i) => (i === index ? nome : n));
  } else {
    escala[index] = nome;
  }

  document.getElementById(`slot${timeKey}${index}`).textContent = nome;
  document.getElementById("modal").style.display = "none";
  verificarSePodeAvancar?.();
}

function confirmarEscalacoes() {
  document.getElementById("escalacaoContainer").style.display = "none";

  const conteudo = document.getElementById("conteudo");

  // Remove tela anterior de confrontos se houver
  const anterior = document.getElementById("telaConfrontos");
  if (anterior) anterior.remove();

  const container = document.createElement("div");
  container.className = "section";
  container.id = "telaConfrontos";
  container.innerHTML =
    "<h2>Confrontos - Selecione o vencedor de cada duelo</h2>";

  const formA = document.getElementById("formacaoA").value;
  const formB = document.getElementById("formacaoB").value;

  const posA = formacoesDisponiveis[formA];
  const posB = formacoesDisponiveis[formB];
  confrontos = [];

  const limite = Math.max(posA.length, posB.length);
  for (let i = 0; i < limite; i++) {
    const jogadorA = escalações.A[i] || "(vazio)";
    const jogadorB = escalações.B[i] || "(vazio)";
    const linha = document.createElement("div");
    linha.innerHTML = `${jogadorA} × ${jogadorB} 
      <button onclick="definirVencedor(${i}, 'A')">A</button> 
      <button onclick="definirVencedor(${i}, 'B')">B</button>`;
    confrontos[i] = {
      tipo: "jogador",
      index: i,
      jogadorA,
      jogadorB,
      vencedor: null,
    };
    container.appendChild(linha);
  }

  // confronto dos treinadores
  const tecnicoLinha = document.createElement("div");
  tecnicoLinha.innerHTML = `${timeSelecionadoA.treinador.nome} × ${timeSelecionadoB.treinador.nome} (Treinadores)
    <button onclick="definirVencedor('tecnico', 'A')">A</button>
    <button onclick="definirVencedor('tecnico', 'B')">B</button>`;
  confrontos.push({
    tipo: "treinador",
    treinadorA: timeSelecionadoA.treinador.nome,
    treinadorB: timeSelecionadoB.treinador.nome,
    vencedor: null,
  });
  container.appendChild(tecnicoLinha);

  const btn = document.createElement("button");
  btn.textContent = "Simular Partida";
  btn.onclick = () => simularPartida();
  container.appendChild(btn);

  conteudo.appendChild(container);
}

function definirVencedor(index, vencedor, btn) {
  if (index === "tecnico") {
    const c = confrontos.find((c) => c.tipo === "treinador");
    if (!c.vencedor) c.vencedor = vencedor;
  } else {
    if (!confrontos[index].vencedor) confrontos[index].vencedor = vencedor;
  }

  // Desabilita ambos os botões do confronto após escolha
  btn.disabled = true;
  const sibling = btn.parentNode.querySelectorAll("button");
  sibling.forEach((b) => {
    if (b !== btn) b.disabled = true;
  });

  const todos = confrontos.every((c) => c.vencedor !== null);
  const botao = document.getElementById("botaoSimularPartida");
  if (botao) botao.disabled = !todos;
}

window.onload = () => {
  document.getElementById("fecharModal").onclick = () => {
    document.getElementById("modal").style.display = "none";
  };
};

function simularPartida() {
  const conteudo = document.getElementById("conteudo");
  conteudo.innerHTML = ""; // Limpa a área principal apenas

  const simulando = document.createElement("div");
  simulando.className = "section";
  simulando.innerHTML = `<h2>Simulando partida...</h2>`;

  conteudo.appendChild(simulando);

  setTimeout(() => {
    const resultado = calcularPontuacao();
    mostrarResultado(resultado);
  }, 5000);
}

function calcularPontuacao() {
  const resultado = {
    pontosA: 0,
    pontosB: 0,
    detalhes: [],
  };

  let campoNeutro = window.estadoCampoNeutro;

  if (campoNeutro) {
    resultado.pontosA += 1;
    resultado.pontosB += 1;
    resultado.detalhes.push("Campo neutro: 1 ponto para cada time");
  } else {
    resultado.pontosA += 1;
    resultado.detalhes.push("Fator casa: 1 ponto para Time A");
  }

  const vitoriasA = confrontos.filter(
    (c) => c.tipo === "jogador" && c.vencedor === "A"
  ).length;
  const vitoriasB = confrontos.filter(
    (c) => c.tipo === "jogador" && c.vencedor === "B"
  ).length;

  if (vitoriasA > vitoriasB) {
    resultado.pontosA += 1;
    resultado.detalhes.push("Mano a mano: vitória do Time A");
    if (vitoriasA >= 8) {
      resultado.pontosA += 0.5;
      resultado.detalhes.push("Mano a mano: +0.5 extra por ampla vitória");
    }
  } else if (vitoriasB > vitoriasA) {
    resultado.pontosB += 1;
    resultado.detalhes.push("Mano a mano: vitória do Time B");
    if (vitoriasB >= 8) {
      resultado.pontosB += 0.5;
      resultado.detalhes.push("Mano a mano: +0.5 extra por ampla vitória");
    }
  } else {
    resultado.pontosA += 0.5;
    resultado.pontosB += 0.5;
    resultado.detalhes.push("Mano a mano: empate");
  }

  const treinador = confrontos.find((c) => c.tipo === "treinador");
  if (treinador?.vencedor === "A") {
    resultado.pontosA += 1;
    resultado.detalhes.push("Treinador: vitória do Time A");
  } else if (treinador?.vencedor === "B") {
    resultado.pontosB += 1;
    resultado.detalhes.push("Treinador: vitória do Time B");
  } else {
    resultado.pontosA += 0.5;
    resultado.pontosB += 0.5;
    resultado.detalhes.push("Treinador: empate");
  }

  const sorteio = Math.ceil(Math.random() * 3);
  if (sorteio === 1) {
    resultado.pontosA += 1;
    resultado.detalhes.push("Aleatório: ponto para Time A");
  } else if (sorteio === 2) {
    resultado.pontosB += 1;
    resultado.detalhes.push("Aleatório: ponto para Time B");
  } else {
    resultado.pontosA += 0.5;
    resultado.pontosB += 0.5;
    resultado.detalhes.push("Aleatório: 0.5 ponto para cada");
  }

  return resultado;
}

function mostrarResultado(resultado) {
  const diff = resultado.pontosA - resultado.pontosB;
  let placarA = 0;
  let placarB = 0;
  const faixa = Math.abs(diff);

  if (faixa === 0) {
    [placarA, placarB] = [
      [0, 0],
      [1, 1],
      [2, 2],
    ][Math.floor(Math.random() * 3)];
  } else if (faixa <= 0.5) {
    [placarA, placarB] = diff > 0 ? [1, 0] : [0, 1];
  } else if (faixa <= 1.5) {
    [placarA, placarB] =
      diff > 0
        ? [
            [1, 0],
            [2, 1],
            [2, 0],
          ][Math.floor(Math.random() * 3)]
        : [
            [0, 1],
            [1, 2],
            [0, 2],
          ][Math.floor(Math.random() * 3)];
  } else if (faixa <= 2.5) {
    [placarA, placarB] =
      diff > 0
        ? [
            [2, 0],
            [3, 1],
            [3, 0],
          ][Math.floor(Math.random() * 3)]
        : [
            [0, 2],
            [1, 3],
            [0, 3],
          ][Math.floor(Math.random() * 3)];
  } else {
    [placarA, placarB] =
      diff > 0
        ? [
            [4, 0],
            [5, 1],
            [5, 0],
            [6, 1],
          ][Math.floor(Math.random() * 4)]
        : [
            [0, 4],
            [1, 5],
            [0, 5],
            [1, 6],
          ][Math.floor(Math.random() * 4)];
  }

  const nomeA = timeSelecionadoA.nome;
  const nomeB = timeSelecionadoB.nome;

  const conteudo = document.getElementById("conteudo");
  conteudo.innerHTML = "";

  const artilheiros = [];
  const assistentes = [];

  [
    { t: "A", gols: placarA },
    { t: "B", gols: placarB },
  ].forEach(({ t, gols }) => {
    for (let i = 0; i < gols; i++) {
      const jogadores = escalações[t];
      const time = t === "A" ? timeSelecionadoA : timeSelecionadoB;

      // Filtra os jogadores, removendo goleiros
      const lista = jogadores
        .map((n) => time.jogadores.find((j) => j.nome === n))
        .filter((j) => j?.posicao?.toLowerCase() !== "goleiro");

      function sortearJogadorComPeso(lista) {
        const pesos = {
          atacante: 5,
          ponta: 4,
          meia: 3,
          lateral: 2,
          volante: 1,
          zagueiro: 1,
        };
        const pool = [];
        lista.forEach((j) => {
          const pos = j?.posicao?.toLowerCase() || "";
          const peso = pesos[pos] || 1;
          for (let i = 0; i < peso; i++) pool.push(j);
        });
        if (pool.length === 0) return lista[0];
        return pool[Math.floor(Math.random() * pool.length)];
      }

      const autor = sortearJogadorComPeso(lista);
      const assist = sortearJogadorComPeso(lista);

      artilheiros.push(`${autor?.nome || "Desconhecido"} (${t})`);
      assistentes.push(`${assist?.nome || "Desconhecido"} (${t})`);
    }
  });

  const tela = document.createElement("div");
  tela.className = "resultado-container";
  tela.innerHTML = `
    <h2>
      <img src="${
        timeSelecionadoA.logo
      }" width="30" style="vertical-align: middle;">
      ${nomeA} ${placarA} x ${placarB} ${nomeB}
      <img src="${
        timeSelecionadoB.logo
      }" width="30" style="vertical-align: middle;">
    </h2>
    <h3>Gols</h3>
    <ul>
      ${artilheiros.map((g) => `<li class="goleador">${g}</li>`).join("")}
    </ul>
    <h3>Assistências</h3>
    <ul>
      ${assistentes.map((a) => `<li>${a}</li>`).join("")}
    </ul>
  `;

  const btnDetalhes = document.createElement("button");
  btnDetalhes.textContent = "Ver Detalhes";
  btnDetalhes.onclick = () => {
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "10%";
    modal.style.left = "20%";
    modal.style.width = "60%";
    modal.style.background = "white";
    modal.style.padding = "20px";
    modal.style.border = "2px solid black";
    modal.style.zIndex = 1000;
    modal.innerHTML = `
      <h3>Detalhes da Partida</h3>
      <p><strong>Placar Técnico:</strong> ${resultado.pontosA} x ${
      resultado.pontosB
    }</p>
      <ul>${resultado.detalhes.map((d) => `<li>${d}</li>`).join("")}</ul>
      <br>
      <button onclick='this.parentNode.remove()'>Fechar</button>
    `;
    document.body.appendChild(modal);
  };
  tela.appendChild(btnDetalhes);

  const voltarBtn = document.createElement("button");
  voltarBtn.textContent = "Voltar à Simulação Clássica";
  voltarBtn.onclick = () => {
    window.location.reload();
  };
  tela.appendChild(voltarBtn);

  conteudo.appendChild(tela);
}
