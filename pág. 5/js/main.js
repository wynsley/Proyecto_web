// Estado inicial
const users = [
  { id: 1, nombre: "Duran Salazar Wynsley Jhackson", puntos: 0 },
  { id: 2, nombre: "Fustamante Olivares Yerson", puntos: 0 }
];

let currentUsers = [...users];

// Elementos
const tbody = document.getElementById('score-tbody');
const modal = document.getElementById('modal');
const modalContent = document.getElementById('modal-content');
const modalBackdrop = document.getElementById('modal-backdrop');
const emptyMsg = document.getElementById('empty-table-msg');

const renderTable = () => {
  tbody.innerHTML = '';
  if (currentUsers.length === 0) {
    emptyMsg.style.display = "block";
    return;
  }
  emptyMsg.style.display = "none";
  currentUsers.forEach(user => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${user.nombre}</td>
      <td>${user.puntos}</td>
      <td>
        <div class="score-table__acciones">
          <button class="score-table__btn score-table__btn--add" data-action="sumar" data-id="${user.id}" title="Aumentar">+</button>
          <button class="score-table__btn score-table__btn--sub" data-action="restar" data-id="${user.id}" title="Restar">-</button>
          <button class="score-table__btn score-table__btn--edit" data-action="editar" data-id="${user.id}" title="Editar">Editar</button>
          <button class="score-table__btn score-table__btn--delete" data-action="eliminar" data-id="${user.id}" title="Eliminar">Eliminar</button>
          <button class="score-table__btn score-table__btn--detail" data-action="detalle" data-id="${user.id}" title="Detalle">Detalles</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
};

// Utilidades Modal
function openModal(html) {
  modalContent.innerHTML = html;
  modal.setAttribute('aria-hidden', 'false');
}
function closeModal() {
  modal.setAttribute('aria-hidden', 'true');
}

modal.addEventListener('click', e => {
  if (e.target === modal || e.target === modalBackdrop || e.target.classList.contains('modal__close')) {
    closeModal();
  }
});

tbody.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const action = btn.dataset.action;
  const id = Number(btn.dataset.id);
  const user = currentUsers.find(u => u.id === id);
  switch (action) {
    case 'sumar': return modalSumarRestar('sumar', user);
    case 'restar': return modalSumarRestar('restar', user);
    case 'editar': return modalEditar(user);
    case 'eliminar': return modalEliminar(user);
    case 'detalle': return modalDetalle(user);
  }
});

// --------- Acciones principales ----------
document.getElementById('btn-calificar-todos').onclick = modalCalificarTodos;
document.getElementById('btn-agregar-miembro').onclick = modalAgregarMiembro;

// --------- Modal de sumar/restar puntos -----------
function modalSumarRestar(tipo, user) {
  openModal(`
    <button class="modal__close" title="Cerrar">&times;</button>
    <h2>${user.nombre}</h2>
    <div class="modal__sub">${tipo === 'sumar' ? 'Aumentar puntaje' : 'Restar puntaje'}</div>
    <label class="modal__label">Fecha
      <input type="date" class="modal__input" id="modal-fecha" value="${new Date().toISOString().split('T')[0]}"/>
    </label>
    <label class="modal__label">Motivo
      <textarea class="modal__textarea" id="modal-motivo" placeholder="Motivo..."></textarea>
    </label>
    <label class="modal__label">Puntuación
      <input type="number" class="modal__input" id="modal-puntaje" value="1" min="1"/>
    </label>
    <div class="modal__actions">
      <button class="modal__btn" id="modal-confirmar">Confirmar</button>
      <button class="modal__btn modal__btn--cancel" id="modal-cancelar">Cancelar</button>
    </div>
  `);
  document.getElementById('modal-cancelar').onclick = closeModal;
  document.getElementById('modal-confirmar').onclick = () => {
    const puntos = parseInt(document.getElementById('modal-puntaje').value, 10);
    if (isNaN(puntos) || puntos <= 0) return alert('La puntuación debe ser mayor a 0.');
    if (tipo === 'restar' && user.puntos - puntos < 0) return alert('No se puede restar más puntos de los que tiene el usuario.');
    user.puntos += tipo === 'sumar' ? puntos : -puntos;
    closeModal();
    renderTable();
  };
}

// --------- Modal editar -----------
function modalEditar(user) {
  openModal(`
    <button class="modal__close" title="Cerrar">&times;</button>
    <h2>Editar miembro</h2>
    <label class="modal__label">Nombre y apellidos
      <input type="text" class="modal__input" id="modal-nombre" value="${user.nombre}"/>
    </label>
    <div class="modal__actions">
      <button class="modal__btn" id="modal-guardar">Guardar</button>
      <button class="modal__btn modal__btn--cancel" id="modal-cancelar">Cancelar</button>
    </div>
  `);
  document.getElementById('modal-cancelar').onclick = closeModal;
  document.getElementById('modal-guardar').onclick = () => {
    const nombre = document.getElementById('modal-nombre').value.trim();
    if (!nombre) return alert('Debe ingresar el nombre y apellidos.');
    user.nombre = nombre;
    closeModal();
    renderTable();
  };
}

// --------- Modal eliminar -----------
function modalEliminar(user) {
  openModal(`
    <button class="modal__close" title="Cerrar">&times;</button>
    <h2>Eliminar miembro</h2>
    <div style="margin: 0.8rem 0;">
      ¿Seguro que quieres eliminar a <b>${user.nombre}</b>?
    </div>
    <div class="modal__actions">
      <button class="modal__btn modal__btn--danger" id="modal-eliminar">Eliminar</button>
      <button class="modal__btn modal__btn--cancel" id="modal-cancelar">Cancelar</button>
    </div>
  `);
  document.getElementById('modal-cancelar').onclick = closeModal;
  document.getElementById('modal-eliminar').onclick = () => {
    currentUsers = currentUsers.filter(u => u.id !== user.id);
    closeModal();
    renderTable();
  };
}

// --------- Modal detalle -----------
function modalDetalle(user) {
  openModal(`
    <button class="modal__close" title="Cerrar">&times;</button>
    <h2>Detalles de ${user.nombre}</h2>
    <div style="margin:.6rem 0 1.1rem 0;">
      <b>Puntos:</b> ${user.puntos}
    </div>
    <div class="modal__actions">
      <button class="modal__btn modal__btn--cancel" id="modal-cerrar">Cerrar</button>
    </div>
  `);
  document.getElementById('modal-cerrar').onclick = closeModal;
}

// --------- Modal calificar a todos -----------
function modalCalificarTodos() {
  openModal(`
    <button class="modal__close" title="Cerrar">&times;</button>
    <h2>Calificar a todos</h2>
    <label class="modal__label">Fecha
      <input type="date" class="modal__input" id="modal-fecha" value="${new Date().toISOString().split('T')[0]}"/>
    </label>
    <label class="modal__label">Motivo
      <textarea class="modal__textarea" id="modal-motivo" placeholder="Motivo..."></textarea>
    </label>
    <label class="modal__label">Puntuación
      <input type="number" class="modal__input" id="modal-puntaje" value="1" min="1"/>
    </label>
    <div class="modal__actions">
      <button class="modal__btn" id="modal-confirmar">Confirmar</button>
      <button class="modal__btn modal__btn--cancel" id="modal-cancelar">Cancelar</button>
    </div>
  `);
  document.getElementById('modal-cancelar').onclick = closeModal;
  document.getElementById('modal-confirmar').onclick = () => {
    const puntos = parseInt(document.getElementById('modal-puntaje').value, 10);
    if (isNaN(puntos) || puntos <= 0) return alert('La puntuación debe ser mayor a 0.');
    currentUsers.forEach(u => u.puntos += puntos);
    closeModal();
    renderTable();
  };
}

// --------- Modal agregar miembro -----------
function modalAgregarMiembro() {
  openModal(`
    <button class="modal__close" title="Cerrar">&times;</button>
    <h2>Agregar miembro</h2>
    <label class="modal__label">Nombre y apellidos
      <input type="text" class="modal__input" id="modal-nombre" placeholder="Nombre completo..."/>
    </label>
    <div class="modal__actions">
      <button class="modal__btn" id="modal-agregar">Agregar</button>
      <button class="modal__btn modal__btn--cancel" id="modal-cancelar">Cancelar</button>
    </div>
  `);
  document.getElementById('modal-cancelar').onclick = closeModal;
  document.getElementById('modal-agregar').onclick = () => {
    const nombre = document.getElementById('modal-nombre').value.trim();
    if (!nombre) return alert('Debe ingresar el nombre completo.');
    currentUsers.push({ id: Date.now(), nombre, puntos: 0 });
    closeModal();
    renderTable();
  };
}

// --------- Inicialización ----------
renderTable();

// --- Control de errores extremos y vacío ---
// - Nombres vacíos en agregar y editar: bloquea con alert y no permite continuar.
// - Puntuaciones negativas o vacías: bloquea con alert y no permite continuar.
// - Eliminar todos: tabla muestra "No hay miembros registrados".
// - Restar más puntos de los que tiene: bloquea.
// - Todos los cambios se reflejan en tiempo real.
// - Modal siempre se puede cerrar haciendo click fuera, en la X, o Cancelar.
