//---------------Variables globales------------------------
const url_sprints = "http://127.0.0.1:8001/sprints";
const sprint_tb = document.getElementById("sprintsTb");
const nuevoSprintBtn = document.getElementById("nuevoSprintBtn");
const sprintForm = document.forms["sprintForm"];
const sprintFormContent = document.getElementById("sprintForm");
const msg = document.getElementById("msg");

//---------------Funciones------------------------
const consultarSprints = () => {
  fetch(url_sprints)
    .then((response) => response.json())
    .then((data) => {
      mostrarDatos(data);
    })
    .catch((error) => console.error("Error en el servicio: ", error))
    .finally(() => console.info("---Fin del consumo del api de sprints---"));
};
consultarSprints();

const mostrarDatos = (lista) => {
  const tbody = sprint_tb.getElementsByTagName("tbody")[0];
  tbody.textContent = "";
  if (lista.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 5;
    td.textContent = "No hay sprints...";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }
  lista.forEach((item, index) => {
    const tdNo = document.createElement("td");
    tdNo.textContent = index + 1;
    const tdNombre = document.createElement("td");
    tdNombre.textContent = item.nombre;
    const tdInicio = document.createElement("td");
    tdInicio.textContent = item.fecha_inicio;
    const tdFin = document.createElement("td");
    tdFin.textContent = item.fecha_fin;

    const editarBtn = document.createElement("button");
    editarBtn.textContent = "Editar";
    editarBtn.className = "secondary";
    editarBtn.addEventListener("click", () => editarSprint(item.id));

    const borrarBtn = document.createElement("button");
    borrarBtn.textContent = "Borrar";
    borrarBtn.className = "danger";
    borrarBtn.addEventListener("click", () => borrarSprint(item.id));

    const tdAcciones = document.createElement("td");
    tdAcciones.appendChild(editarBtn);
    tdAcciones.appendChild(borrarBtn);

    const tr = document.createElement("tr");
    tr.appendChild(tdNo);
    tr.appendChild(tdNombre);
    tr.appendChild(tdInicio);
    tr.appendChild(tdFin);
    tr.appendChild(tdAcciones);

    tbody.appendChild(tr);
  });
};

const limpiarMsg = () => {
  msg.textContent = "";
  msg.className = "msg";
};

const mostrarMsg = (texto, tipo) => {
  msg.textContent = texto;
  msg.className = "msg " + tipo;
};

const editarSprint = (id) => {
  fetch(url_sprints + "/" + id)
    .then((response) => response.json())
    .then((data) => {
      sprintForm["nombre"].value = data.nombre;
      sprintForm["fecha_inicio"].value = data.fecha_inicio;
      sprintForm["fecha_fin"].value = data.fecha_fin;
      sprintForm.dataset.id = id;
      sprintFormContent.style.display = "block";
      limpiarMsg();
    })
    .catch((error) => console.error("Error: ", error));
};

const borrarSprint = async (id) => {
  if (
    !confirm(
      "¿Está seguro de eliminar este sprint? Las historias asociadas también se eliminarán.",
    )
  ) {
    return;
  }
  try {
    const response = await fetch(url_sprints + "/" + id, {
      method: "delete",
    });
    if (response.status === 200) {
      mostrarMsg("Sprint eliminado correctamente", "success");
      consultarSprints();
    } else {
      throw new Error("Error al borrar el sprint");
    }
  } catch (error) {
    mostrarMsg("Error al borrar el sprint", "error");
    console.error("Error en el servicio: ", error);
  }
};

//---------------Eventos------------------------
nuevoSprintBtn.addEventListener("click", () => {
  sprintForm.reset();
  delete sprintForm.dataset.id;
  sprintFormContent.style.display = "block";
  limpiarMsg();
});

sprintForm.addEventListener("reset", (evt) => {
  evt.preventDefault();
  sprintFormContent.style.display = "none";
});

sprintForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const id = sprintForm.dataset.id;
  const sprint = {
    nombre: sprintForm["nombre"].value,
    fecha_inicio: sprintForm["fecha_inicio"].value,
    fecha_fin: sprintForm["fecha_fin"].value,
  };
  const esEdicion = id !== undefined;

  fetch(esEdicion ? url_sprints + "/" + id : url_sprints, {
    method: esEdicion ? "put" : "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sprint),
  })
    .then((response) => {
      if (response.status === 200) {
        sprintFormContent.style.display = "none";
        mostrarMsg(
          esEdicion ? "Sprint actualizado" : "Sprint registrado",
          "success",
        );
        consultarSprints();
      } else {
        throw new Error("Error al guardar el sprint");
      }
    })
    .catch((error) => {
      mostrarMsg("Error al guardar el sprint", "error");
      console.error("Error en el servicio: ", error);
    });
});
