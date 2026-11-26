const CHAVE = 'ritmo-tarefas';
const NOMES = { trabalho: 'Trabalho', pessoal: 'Pessoal', estudos: 'Estudos' };

// Tarefas de exemplo (só aparecem na primeira vez que o app abre)
function tarefasExemplo() {
  const agora = new Date().toISOString();
  return [
    { id: 1, titulo: 'Estudar Bootstrap', categoria: 'estudos', concluida: false, concluidaEm: null },
    { id: 2, titulo: 'Enviar relatório semanal', categoria: 'trabalho', concluida: false, concluidaEm: null },
    { id: 3, titulo: 'Reunião com a equipe', categoria: 'trabalho', concluida: true, concluidaEm: agora },
    { id: 4, titulo: 'Fazer compras do mês', categoria: 'pessoal', concluida: false, concluidaEm: null },
    { id: 5, titulo: 'Revisar lógica proposicional', categoria: 'estudos', concluida: false, concluidaEm: null },
    { id: 6, titulo: 'Marcar consulta de rotina', categoria: 'pessoal', concluida: false, concluidaEm: null }
  ];
}

// Leitura e gravação no localStorage
function carregar() {
  try {
    const salvo = localStorage.getItem(CHAVE);
    if (salvo) return JSON.parse(salvo);
  } catch (e) {}
  return tarefasExemplo();
}

function salvar() {
  localStorage.setItem(CHAVE, JSON.stringify(tarefas));
}

let tarefas = carregar();

// Elementos da página
const form = document.getElementById('form-nova-tarefa');
const lista = document.getElementById('lista-tarefas');
const filtro = document.getElementById('filtro-status');

// Evita que texto digitado vire código HTML
function escapar(texto) {
  const div = document.createElement('div');
  div.textContent = texto;
  return div.innerHTML;
}

// Desenha a lista e atualiza os contadores
function renderizar() {
  const hoje = new Date().toDateString();

  document.getElementById('total-tarefas').textContent = tarefas.length;
  document.getElementById('total-pendentes').textContent =
    tarefas.filter(t => !t.concluida).length;
  document.getElementById('total-concluidas-hoje').textContent =
    tarefas.filter(t => t.concluida && t.concluidaEm &&
      new Date(t.concluidaEm).toDateString() === hoje).length;

  let visiveis = tarefas;
  if (filtro.value === 'pendentes') visiveis = tarefas.filter(t => !t.concluida);
  if (filtro.value === 'concluidas') visiveis = tarefas.filter(t => t.concluida);

  if (visiveis.length === 0) {
    lista.innerHTML = '<li class="list-group-item">Nenhuma tarefa por aqui.</li>';
    return;
  }

  lista.innerHTML = visiveis.map(t => `
    <li class="list-group-item">
      <h3 class="${t.concluida ? 'text-decoration-line-through text-muted' : ''}">${escapar(t.titulo)}</h3>
      <p>Categoria: ${NOMES[t.categoria]}</p>
      <div class="d-flex flex-wrap gap-2">
        <button type="button" class="btn btn-outline-success" data-acao="concluir" data-id="${t.id}">
          ${t.concluida ? 'Reabrir' : 'Concluir'}
        </button>
        <button type="button" class="btn btn-outline-warning" data-acao="editar" data-id="${t.id}">Editar</button>
        <button type="button" class="btn btn-outline-danger" data-acao="excluir" data-id="${t.id}">Excluir</button>
      </div>
    </li>
  `).join('');
}

// Criar tarefa
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const titulo = document.getElementById('titulo-tarefa').value.trim();
  const categoria = document.getElementById('categoria-tarefa').value;
  if (!titulo || !categoria) return;

  tarefas.push({ id: Date.now(), titulo, categoria, concluida: false, concluidaEm: null });
  salvar();
  form.reset();
  renderizar();
});

// Concluir, editar e excluir (um único "ouvinte" para todos os botões)
lista.addEventListener('click', (e) => {
  const botao = e.target.closest('button[data-acao]');
  if (!botao) return;

  const id = Number(botao.dataset.id);
  const tarefa = tarefas.find(t => t.id === id);

  if (botao.dataset.acao === 'concluir') {
    tarefa.concluida = !tarefa.concluida;
    tarefa.concluidaEm = tarefa.concluida ? new Date().toISOString() : null;
  }

  if (botao.dataset.acao === 'editar') {
    const novoTitulo = prompt('Editar tarefa:', tarefa.titulo);
    if (novoTitulo && novoTitulo.trim()) tarefa.titulo = novoTitulo.trim();
  }

  if (botao.dataset.acao === 'excluir') {
    tarefas = tarefas.filter(t => t.id !== id);
  }

  salvar();
  renderizar();
});

// Filtro por status
filtro.addEventListener('change', renderizar);

renderizar();