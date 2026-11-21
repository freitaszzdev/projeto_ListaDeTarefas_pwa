const formEnviar = document.querySelector("#form-nova-tarefa");
const tarefaNova = document.querySelector("#titulo-tarefa");
const categoria = document.querySelector("#categoria-tarefa");
const listaTarefas = document.querySelector("#lista-tarefas");

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

  filtrarTarefas();
  atualizarResumo();
}

function editarTarefa(item, titulo, textoCategoria, acoes) {
  if (titulo.hidden === true) {
    return;
  }

  if (document.querySelector(".fundo-edicao")) {
    return;
  }

  const fundoEdicao = document.createElement("div");
  fundoEdicao.classList.add("fundo-edicao");

  document.body.append(fundoEdicao);
  item.classList.add("tarefa-em-edicao");

  const campot1 = document.createElement("input");
  campot1.type = "text";
  campot1.classList.add("form-control");
  campot1.value = titulo.textContent;

  titulo.hidden = true;
  titulo.after(campot1);

  const campoCategoria = document.createElement("select");
  campoCategoria.classList.add("form-select", "mt-3");

  const opcaoTrabalho = document.createElement("option");
  opcaoTrabalho.value = "trabalho";
  opcaoTrabalho.textContent = "Trabalho";

  const opcaoPessoal = document.createElement("option");
  opcaoPessoal.value = "pessoal";
  opcaoPessoal.textContent = "Pessoal";

  const opcaoEstudos = document.createElement("option");
  opcaoEstudos.value = "estudos";
  opcaoEstudos.textContent = "Estudos";

  campoCategoria.append(opcaoTrabalho, opcaoPessoal, opcaoEstudos);
  campoCategoria.value = item.dataset.categoria;

  textoCategoria.hidden = true;
  textoCategoria.after(campoCategoria);

  const btnSalvar = document.createElement("button");
  btnSalvar.type = "button";
  btnSalvar.textContent = "Salvar";
  btnSalvar.classList.add("btn", "btn-success");

  const btnCancelar = document.createElement("button");
  btnCancelar.type = "button";
  btnCancelar.textContent = "Cancelar";
  btnCancelar.classList.add("btn", "btn-outline-secondary");

  const divBtnSC = document.createElement("div");
  divBtnSC.classList.add("d-flex", "gap-2", "mt-3");
  divBtnSC.append(btnSalvar, btnCancelar);

  item.append(divBtnSC);
  acoes.classList.add("d-none");
  campot1.focus();

  btnSalvar.addEventListener("click", function () {
    const novoTitulo = campot1.value.trim();

    if (novoTitulo === "") {
      campot1.focus();
      return;
    }

    titulo.textContent = novoTitulo;
    item.dataset.categoria = campoCategoria.value;
    textoCategoria.textContent = "Categoria: " + campoCategoria.value;

    campot1.remove();
    campoCategoria.remove();
    divBtnSC.remove();
    fundoEdicao.remove();

    titulo.hidden = false;
    textoCategoria.hidden = false;
    acoes.classList.remove("d-none");
    item.classList.remove("tarefa-em-edicao");
  });

  btnCancelar.addEventListener("click", function () {
    campot1.remove();
    campoCategoria.remove();
    divBtnSC.remove();
    fundoEdicao.remove();

    titulo.hidden = false;
    textoCategoria.hidden = false;
    acoes.classList.remove("d-none");
    item.classList.remove("tarefa-em-edicao");
  });
}

function excluirTarefa(item) {
  item.remove();
  atualizarResumo();
}

formEnviar.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const li = document.createElement("li");
  li.dataset.categoria = categoria.value;
  li.dataset.status = "pendente";
  li.classList.add("list-group-item");

  const t3 = document.createElement("h3");
  t3.textContent = tarefaNova.value;

  const p = document.createElement("p");
  p.textContent = "Categoria: " + categoria.value;

  const btnConcluir = document.createElement("button");
  btnConcluir.type = "button";
  btnConcluir.textContent = "Concluir";
  btnConcluir.classList.add("btn", "btn-outline-success");

  const btnEditar = document.createElement("button");
  btnEditar.type = "button";
  btnEditar.textContent = "Editar";
  btnEditar.classList.add("btn", "btn-outline-warning");

  const btnExcluir = document.createElement("button");
  btnExcluir.type = "button";
  btnExcluir.textContent = "Excluir";
  btnExcluir.classList.add("btn", "btn-outline-danger");

  const acoes = document.createElement("div");
  acoes.classList.add("d-flex", "flex-wrap", "gap-2");
  acoes.append(btnConcluir, btnEditar, btnExcluir);

  btnConcluir.addEventListener("click", function () {
    concluirTarefa(li, t3);
  });

  btnEditar.addEventListener("click", function () {
    editarTarefa(li, t3, p, acoes);
  });

  btnExcluir.addEventListener("click", function () {
    excluirTarefa(li);
  });

  li.append(t3, p, acoes);
  listaTarefas.append(li);
  atualizarResumo();
  filtrarTarefas();

  //  formEnviar.reset();
});

const filtroStatus = document.querySelector("#filtro-status");

function filtrarTarefas() {
  const statusSelecionado = filtroStatus.value;
  const tarefas = listaTarefas.querySelectorAll("li");
  for (const item of tarefas) {
    console.log(statusSelecionado, item.dataset.status);
    if (statusSelecionado === "todas") {
      item.hidden = false;
    } else if (statusSelecionado === "pendentes") {
      item.hidden = item.dataset.status !== "pendente";
    } else {
      item.hidden = item.dataset.status !== "concluida";
    }
  }
}

filtroStatus.addEventListener("change", function () {
  filtrarTarefas();
});

const contadorTotal = document.querySelector("#total-tarefas");
const contadorPendentes = document.querySelector("#total-pendentes");
const contadorConcluidasHoje = document.querySelector("#total-concluidas-hoje");

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
