//---------------Variables globales------------------------
const url_informes = "http://127.0.0.1:8002/informes";
const url_sprints = "http://127.0.0.1:8001/sprints";
const informeGeneralDiv = document.getElementById("informeGeneral");
const informeSprintDiv = document.getElementById("informeSprint");
const informeResponsableDiv = document.getElementById("informeResponsable");
const selectSprint = document.getElementById("sprintInforme");
const btnBuscarResponsable = document.getElementById("buscarResponsableBtn");
const inputResponsable = document.getElementById("responsableInforme");

//---------------Funciones------------------------
const cargarSprintsSelect = () => {
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

const consultarInformeGeneral = () => {
  fetch(url_informes + "/general")
    .then((response) => response.json())
    .then((data) => {
      informeGeneralDiv.innerHTML =
        "<ul>" +
        "<li><strong>Total de historias:</strong> " +
        data.total +
        "</li>" +
        "<li><strong>Finalizadas:</strong> " +
        data.finalizadas +
        "</li>" +
        "<li><strong>Pendientes:</strong> " +
        data.pendientes +
        "</li>" +
        "<li><strong>Con impedimentos:</strong> " +
        data.impedimentos +
        "</li>" +
        "</ul>";
    })
    .catch((error) => {
      informeGeneralDiv.innerHTML =
        "<p class='error'>Error al cargar el informe general.</p>";
      console.error("Error en el servicio: ", error);
    });
};

const consultarInformeSprint = (sprint_id) => {
  if (!sprint_id) {
    informeSprintDiv.innerHTML =
      "<p>Seleccione un sprint para ver su avance.</p>";
    return;
  }
  fetch(url_informes + "/sprint/" + sprint_id)
    .then((response) => response.json())
    .then((data) => {
      informeSprintDiv.innerHTML =
        "<ul>" +
        "<li><strong>Sprint ID:</strong> " +
        data.sprint_id +
        "</li>" +
        "<li><strong>Total de historias:</strong> " +
        data.total +
        "</li>" +
        "<li><strong>Finalizadas:</strong> " +
        data.finalizadas +
        "</li>" +
        "<li><strong>Pendientes:</strong> " +
        data.pendientes +
        "</li>" +
        "<li><strong>Con impedimentos:</strong> " +
        data.impedimentos +
        "</li>" +
        "</ul>";
    })
    .catch((error) => {
      informeSprintDiv.innerHTML =
        "<p class='error'>Error al cargar el informe del sprint.</p>";
      console.error("Error en el servicio: ", error);
    });
};

const buscarHistoriasPorResponsable = () => {
  const responsable = inputResponsable.value.trim();
  if (!responsable) {
    informeResponsableDiv.innerHTML =
      "<p>Ingrese un nombre de responsable.</p>";
    return;
  }
  fetch(url_informes + "/responsable/" + encodeURIComponent(responsable))
    .then((response) => response.json())
    .then((data) => {
      if (data.length === 0) {
        informeResponsableDiv.innerHTML =
          "<p>No se encontraron historias para este responsable.</p>";
        return;
      }
      let html =
        "<table><thead><tr><th>Título</th><th>Estado</th><th>Puntos</th><th>Sprint</th></tr></thead><tbody>";
      data.forEach((h) => {
        html +=
          "<tr>" +
          "<td>" +
          h.titulo +
          "</td>" +
          "<td>" +
          h.estado +
          "</td>" +
          "<td>" +
          h.puntos +
          "</td>" +
          "<td>" +
          h.sprint_id +
          "</td>" +
          "</tr>";
      });
      html += "</tbody></table>";
      informeResponsableDiv.innerHTML = html;
    })
    .catch((error) => {
      informeResponsableDiv.innerHTML =
        "<p class='error'>Error al buscar historias por responsable.</p>";
      console.error("Error en el servicio: ", error);
    });
};

//---------------Eventos------------------------
cargarSprintsSelect();
consultarInformeGeneral();

selectSprint.addEventListener("change", (evt) => {
  consultarInformeSprint(evt.target.value);
});

btnBuscarResponsable.addEventListener("click", () => {
  buscarHistoriasPorResponsable();
});

inputResponsable.addEventListener("keypress", (evt) => {
  if (evt.key === "Enter") {
    buscarHistoriasPorResponsable();
  }
});
