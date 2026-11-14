const formEnviar = document.querySelector("#form-nova-tarefa");
const tarefaNova = document.querySelector("#titulo-tarefa");
const categoria = document.querySelector("#categoria-tarefa");
const listaTarefas = document.querySelector("#lista-tarefas");

function concluirTarefa(t1) {
  t1.classList.toggle("text-decoration-line-through");
}

function editarTarefa(item, titulo, textoCategoria, acoes) {
  if (titulo.hidden === true){
    return;
  }
  const campot1 = document.createElement("input");
  campot1.type = "text";
  campot1.classList.add("form-control");
  campot1.value = titulo.textContent;
  titulo.hidden = true;
  titulo.after(campot1);
  campot1.focus();
/*  const btnSalvar = document.createElement("button");
  const divBtnSC = document.createElement("div")
  divBtnSC.append(btnSalvar)
  btnSalvar.textContent = "Salvar";
  btnSalvar.type = "button" | AINDA ESTOU TESTANDO (NÃO MEXER)*/
}

function excluirTarefa(item) {
  item.remove();
}

formEnviar.addEventListener("submit", function (evento) {
  evento.preventDefault();
  const li = document.createElement("li");
  const t3 = document.createElement("h3");
  const p = document.createElement("p");
  const btnConcluir = document.createElement("button");
  const btnEditar = document.createElement("button");
  const btnExcluir = document.createElement("button");
  const acoes = document.createElement("div");
  t3.textContent = tarefaNova.value;
  p.textContent = "Categoria: " + categoria.value;
  acoes.append(btnConcluir, btnEditar, btnExcluir);
  acoes.classList.add("d-flex", "flex-wrap", "gap-2");
  btnConcluir.textContent = "Concluir";
  btnConcluir.type = "button";
  btnConcluir.classList.add("btn", "btn-outline-success");
  btnEditar.textContent = "Editar";
  btnEditar.type = "button";
  btnEditar.classList.add("btn", "btn-outline-warning");
  btnExcluir.textContent = "Excluir";
  btnExcluir.type = "button";
  btnExcluir.classList.add("btn", "btn-outline-danger");
  li.append(t3);
  li.append(p);
  li.append(acoes);
  listaTarefas.append(li);
  li.classList.add("list-group-item");
//  formEnviar.reset(); (NÃO MEXER)
  btnConcluir.addEventListener("click", function () {
    concluirTarefa(t3);
  });
  btnEditar.addEventListener("click", function () {
    editarTarefa(li, t3, p, acoes);
  });
  btnExcluir.addEventListener("click", function () {
    excluirTarefa(li);
  });
});
