const modal = document.getElementById("modalGrupo");
const nombreInput = document.getElementById("nombreGrupo");
const miembrosInput = document.getElementById("miembrosGrupo");
const groupList = document.getElementById("groupList");
const sinGrupos = document.getElementById("sinGrupos");

function abrirModal() {
  modal.style.display = "block";
}

function cerrarModal() {
  modal.style.display = "none";
  nombreInput.value = "";
  miembrosInput.value = "";
}

function crearGrupo() {
  const nombre = nombreInput.value.trim();
  const cantidad = parseInt(miembrosInput.value);

  if (!nombre || isNaN(cantidad) || cantidad <= 0) {
    alert("Por favor completa los datos correctamente.");
    return;
  }

  agregarGrupo(nombre, cantidad);
  cerrarModal();
}

function agregarGrupo(nombre, cantidad) {
  if (sinGrupos) sinGrupos.remove();

  const fila = document.createElement("div");
  fila.classList.add("table-row");

  fila.innerHTML = `
    <div class="group-text">${nombre}</div>
    <div class="group-text">${cantidad}</div>
    <div class="group-actions">
      <button class="btnAction" onclick="evaluarGrupo('${nombre}')">Evaluar</button>
      <button class="btnAction" onclick="generarReporte('${nombre}')">Generar reportes</button>
    </div>
  `;

  groupList.appendChild(fila);
}

function mostrarGrupos() {
  alert("Vista de grupos");
}

function mostrarReportes() {
  alert("Vista de reportes");
}

function evaluarGrupo(nombre) {
  alert("Evaluando grupo: " + nombre);
}

function generarReporte(nombre) {
  alert("Generando reporte de: " + nombre);
}

window.onclick = function(e) {
  if (e.target === modal) {
    cerrarModal();
  }
}