//---------------Variables globales------------------------
const url_historias = "http://127.0.0.1:8002/historias";
const url_sprints = "http://127.0.0.1:8001/sprints";
const historia_tb = document.getElementById("historiasTb");
const filtroSprint = document.getElementById("filtroSprint");
const nuevaHistoriaBtn = document.getElementById("nuevaHistoriaBtn");
const historiaForm = document.forms["historiaForm"];
const historiaFormContent = document.getElementById("historiaForm");
const selectSprint = document.getElementById("sprint_id");
const msg = document.getElementById("msg");

//---------------Funciones------------------------
const consultarSprintsParaSelect = () => {
  fetch(url_sprints)
    .then((response) => response.json())
    .then((data) => {
      selectSprint.innerHTML = '<option value="">Seleccionar sprint</option>';
      data.forEach((sprint) => {
        const opt = document.createElement("option");
        opt.value = sprint.id;
        opt.textContent =
          sprint.nombre +
          " (" +
          sprint.fecha_inicio +
          " a " +
          sprint.fecha_fin +
          ")";
        selectSprint.appendChild(opt);
      });
    })
    .catch((error) => console.error("Error al cargar sprints: ", error));
};

const consultarHistorias = (sprint_id = "") => {
  let url = url_historias;
  if (sprint_id) {
    url = url_historias + "/sprint/" + sprint_id;
  }
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      mostrarDatos(data);
    })
    .catch((error) => console.error("Error en el servicio: ", error))
    .finally(() => console.info("---Fin del consumo del api de historias---"));
};
consultarHistorias();
consultarSprintsParaSelect();

const mostrarDatos = (lista) => {
  const tbody = historia_tb.getElementsByTagName("tbody")[0];
  tbody.textContent = "";
  if (lista.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 7;
    td.textContent = "No hay historias...";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }
  lista.forEach((item, index) => {
    const tdNo = document.createElement("td");
    tdNo.textContent = index + 1;
    const tdTitulo = document.createElement("td");
    tdTitulo.textContent = item.titulo;
    const tdResponsable = document.createElement("td");
    tdResponsable.textContent = item.responsable;
    const tdEstado = document.createElement("td");
    tdEstado.textContent = item.estado;
    const tdPuntos = document.createElement("td");
    tdPuntos.textContent = item.puntos;
    const tdSprint = document.createElement("td");
    tdSprint.textContent = item.sprint_id;

    const editarBtn = document.createElement("button");
    editarBtn.textContent = "Editar";
    editarBtn.className = "secondary";
    editarBtn.addEventListener("click", () => editarHistoria(item.id));

    const borrarBtn = document.createElement("button");
    borrarBtn.textContent = "Borrar";
    borrarBtn.className = "danger";
    borrarBtn.addEventListener("click", () => borrarHistoria(item.id));

    const tdAcciones = document.createElement("td");
    tdAcciones.appendChild(editarBtn);
    tdAcciones.appendChild(borrarBtn);

    const tr = document.createElement("tr");
    tr.appendChild(tdNo);
    tr.appendChild(tdTitulo);
    tr.appendChild(tdResponsable);
    tr.appendChild(tdEstado);
    tr.appendChild(tdPuntos);
    tr.appendChild(tdSprint);
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

const editarHistoria = (id) => {
  fetch(url_historias + "/" + id)
    .then((response) => response.json())
    .then((data) => {
      historiaForm["titulo"].value = data.titulo;
      historiaForm["descripcion"].value = data.descripcion;
      historiaForm["responsable"].value = data.responsable;
      historiaForm["estado"].value = data.estado;
      historiaForm["puntos"].value = data.puntos;
      historiaForm["fecha_creacion"].value = data.fecha_creacion;
      historiaForm["fecha_finalizacion"].value = data.fecha_finalizacion || "";
      historiaForm["sprint_id"].value = data.sprint_id;
      historiaForm.dataset.id = id;
      historiaFormContent.style.display = "block";
      limpiarMsg();
    })
    .catch((error) => console.error("Error: ", error));
};

const borrarHistoria = async (id) => {
  if (!confirm("¿Está seguro de eliminar esta historia?")) {
    return;
  }
  try {
    const response = await fetch(url_historias + "/" + id, {
      method: "delete",
    });
    if (response.status === 200) {
      mostrarMsg("Historia eliminada correctamente", "success");
      consultarHistorias(filtroSprint.value);
    } else {
      throw new Error("Error al borrar la historia");
    }
  } catch (error) {
    mostrarMsg("Error al borrar la historia", "error");
    console.error("Error en el servicio: ", error);
  }
};

//---------------Eventos------------------------
nuevaHistoriaBtn.addEventListener("click", () => {
  historiaForm.reset();
  delete historiaForm.dataset.id;
  consultaSprintsParaSelectLocal();
  historiaFormContent.style.display = "block";
  limpiarMsg();
});

const consultaSprintsParaSelectLocal = () => {
  fetch(url_sprints)
    .then((response) => response.json())
    .then((data) => {
      selectSprint.innerHTML = '<option value="">Seleccionar sprint</option>';
      data.forEach((sprint) => {
        const opt = document.createElement("option");
        opt.value = sprint.id;
        opt.textContent =
          sprint.nombre +
          " (" +
          sprint.fecha_inicio +
          " a " +
          sprint.fecha_fin +
          ")";
        selectSprint.appendChild(opt);
      });
    })
    .catch((error) => console.error("Error al cargar sprints: ", error));
};

historiaForm.addEventListener("reset", (evt) => {
  evt.preventDefault();
  historiaFormContent.style.display = "none";
});

historiaForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const id = historiaForm.dataset.id;
  const historia = {
    titulo: historiaForm["titulo"].value,
    descripcion: historiaForm["descripcion"].value,
    responsable: historiaForm["responsable"].value,
    estado: historiaForm["estado"].value,
    puntos: parseInt(historiaForm["puntos"].value),
    fecha_creacion: historiaForm["fecha_creacion"].value,
    fecha_finalizacion: historiaForm["fecha_finalizacion"].value || null,
    sprint_id: parseInt(historiaForm["sprint_id"].value),
  };
  const esEdicion = id !== undefined;

  fetch(esEdicion ? url_historias + "/" + id : url_historias, {
    method: esEdicion ? "put" : "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(historia),
  })
    .then((response) => {
      if (response.status === 200) {
        historiaFormContent.style.display = "none";
        mostrarMsg(
          esEdicion ? "Historia actualizada" : "Historia registrada",
          "success",
        );
        consultarHistorias(filtroSprint.value);
      } else {
        throw new Error("Error al guardar la historia");
      }
    })
    .catch((error) => {
      mostrarMsg("Error al guardar la historia", "error");
      console.error("Error en el servicio: ", error);
    });
});

filtroSprint.addEventListener("change", (evt) => {
  consultarHistorias(evt.target.value);
});
