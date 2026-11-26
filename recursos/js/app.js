const formEnviar = document.querySelector("#form-nova-tarefa");
const tarefaNova = document.querySelector("#titulo-tarefa");
const categoria = document.querySelector("#categoria-tarefa");
const listaTarefas = document.querySelector("#lista-tarefas");
const filtroStatus = document.querySelector("#filtro-status");
const contadorTotal = document.querySelector("#total-tarefas");
const contadorPendentes = document.querySelector("#total-pendentes");
const contadorConcluidasHoje = document.querySelector("#total-concluidas-hoje");
const chaveTarefas = "ritmo-tarefas";

function concluirTarefa(item, titulo) {
  if (item.dataset.status === "pendente") {
    item.dataset.status = "concluida";
    item.dataset.dataConclusao = new Date().toDateString();
    titulo.classList.add("text-decoration-line-through");
  } else {
    item.dataset.status = "pendente";
    delete item.dataset.dataConclusao;
    titulo.classList.remove("text-decoration-line-through");
  }

  salvarTarefas();
  filtrarTarefas();
  atualizarResumo();
}

function editarTarefa(item, titulo, textoCategoria, acoes) {
  if (titulo.hidden || document.querySelector(".fundo-edicao")) {
    return;
  }

  const fundoEdicao = document.createElement("div");
  fundoEdicao.classList.add("fundo-edicao");
  document.body.append(fundoEdicao);
  item.classList.add("tarefa-em-edicao");

  const campoTitulo = document.createElement("input");
  campoTitulo.type = "text";
  campoTitulo.classList.add("form-control");
  campoTitulo.value = titulo.textContent;
  titulo.hidden = true;
  titulo.after(campoTitulo);

  const campoCategoria = document.createElement("select");
  campoCategoria.classList.add("form-select", "mt-3");
  for (const opcao of categoria.options) {
    if (opcao.value) {
      campoCategoria.append(new Option(opcao.textContent, opcao.value));
    }
  }
  campoCategoria.value = item.dataset.categoria;
  textoCategoria.hidden = true;
  textoCategoria.after(campoCategoria);

  const btnSalvar = criarBotao("Salvar", "btn-success");
  const btnCancelar = criarBotao("Cancelar", "btn-outline-secondary");
  const botoesEdicao = document.createElement("div");
  botoesEdicao.classList.add("d-flex", "gap-2", "mt-3");
  botoesEdicao.append(btnSalvar, btnCancelar);
  item.append(botoesEdicao);
  acoes.classList.add("d-none");
  campoTitulo.focus();

  function fecharEdicao() {
    campoTitulo.remove();
    campoCategoria.remove();
    botoesEdicao.remove();
    fundoEdicao.remove();
    titulo.hidden = false;
    textoCategoria.hidden = false;
    acoes.classList.remove("d-none");
    item.classList.remove("tarefa-em-edicao");
  }

  btnSalvar.addEventListener("click", function () {
    const novoTitulo = campoTitulo.value.trim();
    if (novoTitulo === "") {
      campoTitulo.focus();
      return;
    }

    titulo.textContent = novoTitulo;
    item.dataset.categoria = campoCategoria.value;
    textoCategoria.textContent = "Categoria: " + campoCategoria.value;
    salvarTarefas();
    fecharEdicao();
  });

  btnCancelar.addEventListener("click", fecharEdicao);
}

function excluirTarefa(item) {
  item.remove();
  salvarTarefas();
  atualizarResumo();
}

function filtrarTarefas() {
  const statusSelecionado = filtroStatus.value;
  for (const item of listaTarefas.querySelectorAll("li[data-status]")) {
    if (statusSelecionado === "todas") {
      item.hidden = false;
    } else if (statusSelecionado === "pendentes") {
      item.hidden = item.dataset.status !== "pendente";
    } else {
      item.hidden = item.dataset.status !== "concluida";
    }
  }
}

function atualizarResumo() {
  const tarefas = listaTarefas.querySelectorAll("li[data-status]");
  const pendentes = listaTarefas.querySelectorAll('li[data-status="pendente"]');
  const hoje = new Date().toDateString();
  let concluidasHoje = 0;

  for (const tarefa of tarefas) {
    if (
      tarefa.dataset.status === "concluida" &&
      tarefa.dataset.dataConclusao === hoje
    ) {
      concluidasHoje++;
    }
  }

  contadorTotal.textContent = tarefas.length;
  contadorPendentes.textContent = pendentes.length;
  contadorConcluidasHoje.textContent = concluidasHoje;
}

function criarBotao(texto, classe) {
  const botao = document.createElement("button");
  botao.type = "button";
  botao.textContent = texto;
  botao.classList.add("btn", classe);
  return botao;
}

function adicionarTarefa(
  titulo,
  categoriaEscolhida,
  status = "pendente",
  dataConclusao = null,
) {
  const li = document.createElement("li");
  li.classList.add("list-group-item");
  li.dataset.categoria = categoriaEscolhida;
  li.dataset.status = status;

  const t3 = document.createElement("h3");
  t3.textContent = titulo;
  if (status === "concluida") {
    t3.classList.add("text-decoration-line-through");
    if (dataConclusao) {
      li.dataset.dataConclusao = dataConclusao;
    }
  }

  const p = document.createElement("p");
  p.textContent = "Categoria: " + categoriaEscolhida;

  const btnConcluir = criarBotao("Concluir", "btn-outline-success");
  const btnEditar = criarBotao("Editar", "btn-outline-warning");
  const btnExcluir = criarBotao("Excluir", "btn-outline-danger");
  const acoes = document.createElement("div");
  acoes.classList.add("d-flex", "flex-wrap", "gap-2");
  acoes.append(btnConcluir, btnEditar, btnExcluir);

  btnConcluir.addEventListener("click", () => concluirTarefa(li, t3));
  btnEditar.addEventListener("click", () => editarTarefa(li, t3, p, acoes));
  btnExcluir.addEventListener("click", () => excluirTarefa(li));

  li.append(t3, p, acoes);
  listaTarefas.append(li);
}

function salvarTarefas() {
  const dados = [];
  for (const item of listaTarefas.querySelectorAll("li[data-status]")) {
    dados.push({
      titulo: item.querySelector("h3").textContent,
      categoria: item.dataset.categoria,
      status: item.dataset.status,
      dataConclusao: item.dataset.dataConclusao ?? null,
    });
  }

  try {
    localStorage.setItem(chaveTarefas, JSON.stringify(dados));
  } catch (erro) {
    console.warn("Não foi possível salvar as tarefas.", erro);
  }
}

function carregarTarefas() {
  let dados;
  try {
    dados = JSON.parse(localStorage.getItem(chaveTarefas) ?? "[]");
  } catch (erro) {
    console.warn("Não foi possível carregar as tarefas.", erro);
    return;
  }

  if (!Array.isArray(dados)) {
    return;
  }

  for (const tarefa of dados) {
    if (
      !tarefa ||
      typeof tarefa.titulo !== "string" ||
      typeof tarefa.categoria !== "string" ||
      (tarefa.status !== "pendente" && tarefa.status !== "concluida")
    ) {
      continue;
    }

    adicionarTarefa(
      tarefa.titulo,
      tarefa.categoria,
      tarefa.status,
      tarefa.dataConclusao,
    );
  }
}

filtroStatus.addEventListener("change", filtrarTarefas);

formEnviar.addEventListener("submit", function (evento) {
  evento.preventDefault();
  adicionarTarefa(tarefaNova.value, categoria.value);
  salvarTarefas();
  filtrarTarefas();
  atualizarResumo();
  formEnviar.reset();
});

carregarTarefas();
filtrarTarefas();
atualizarResumo();
