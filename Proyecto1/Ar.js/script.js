
// Activar filtros visualmente
document.querySelectorAll(".tag").forEach(tag=>{
    tag.addEventListener("click", ()=>{
        document.querySelectorAll(".tag").forEach(t=>t.classList.remove("active"));
        tag.classList.add("active");
    });
});




function toggleMenu() {
  const menu = document.getElementById('menu');
  menu.classList.toggle('active');
}


const fallback = "../img/Em3.jpg"; // imagen por defecto



document.querySelectorAll(".company").forEach(card => {

    const overlay = card.querySelector(".overlay");
    let img = card.getAttribute("data-img");

    // 🔹 Validar si no existe o está vacío
    if (!img || img.trim() === "") {
        img = fallback;
    }

    // 🔹 Crear objeto imagen para validar si carga
    const testImg = new Image();

    testImg.src = img;

    testImg.onload = () => {
        setBackground(overlay, img);
    };

    testImg.onerror = () => {
        setBackground(overlay, fallback);
    };

});

/* 🔥 Función reutilizable */
function setBackground(element, img){
    element.style.background = `
        linear-gradient(to top, rgba(0,0,0,0.7), transparent),
        url('${img}')
    `;
    element.style.backgroundSize = "cover";
    element.style.backgroundPosition = "center";
    element.style.backgroundRepeat = "no-repeat";
}
function aplicarImagenes(){

  const fallback = "../img/Em3.jpg";

  document.querySelectorAll(".company").forEach(card => {

    const overlay = card.querySelector(".overlay");
    let img = card.getAttribute("data-img") || fallback;

    const testImg = new Image();
    testImg.src = img;

    testImg.onload = () => setBackground(overlay, img);
    testImg.onerror = () => setBackground(overlay, fallback);

  });

}

// ================= EMPRESAS =================
fetch('../Ar.json/empresas.json')
  .then(res => res.json())
  .then(data => {

    const container = document.getElementById('empresas-container');

    // 🔥 CONTENEDOR DE FILTROS
const filtrosContainer = document.getElementById('filtros-container');

// 🔥 SET para evitar duplicados
const categoriasSet = new Set();

// 🔥 SOLO LOS 3 PRIMEROS
const empresasMostradas = data.slice(0, 3);

// 🔥 EXTRAER CATEGORÍAS
empresasMostradas.forEach(emp => {
  emp.categoria.split(',').forEach(cat => {
    categoriasSet.add(cat.trim().toLowerCase());
  });
});

// 🔥 CREAR BOTÓN "TODOS"
// 🔥 BOTÓN "TODOS"
const btnTodos = document.createElement('span');
btnTodos.classList.add('tag', 'active');
btnTodos.textContent = 'Todos';

btnTodos.onclick = () => {
  filter('all');

  document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
  btnTodos.classList.add('active');
};

filtrosContainer.appendChild(btnTodos);

// 🔥 CREAR BOTONES DINÁMICOS
categoriasSet.forEach(cat => {

  const span = document.createElement('span');
  span.classList.add('tag');
  span.textContent = cat;

  span.onclick = () => {
    filter(cat);

    // 🔥 activar visual
    document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
    span.classList.add('active');
  };

  filtrosContainer.appendChild(span);

});

    if (!container) return; // evita errores si no existe

    data.slice(0, 3).forEach(empresa => {

        const card = document.createElement('div');
        card.classList.add('company');
        card.setAttribute(
            'data-category',
            empresa.categoria
            .toLowerCase()
            .split(',')
            .map(c => c.trim())
            .join('|') // 🔥 separador interno
        );
      card.setAttribute('data-img', empresa.imagen);

      card.innerHTML = `
        <div class="overlay"></div>

        <div class="content">
            <h2>${empresa.nombre}</h2>
            ${empresa.categoria.split(',').map(cat => 
                `<span class="category">${cat.trim()}</span>`
            ).join('')}
        </div>

        <div class="extra">
            <h3>${empresa.nombre}</h3>
            ${empresa.categoria.split(',').map(cat => 
                `<span class="category">${cat.trim()}</span>`
            ).join('')}

            <p><strong>Definición:</strong> ${empresa.definicion}</p>
            <p><strong>Materiales:</strong> ${empresa.materiales}</p>
            <p><strong>Servicios:</strong> ${empresa.servicios}</p>
            <p><strong>Teléfono:</strong> ${empresa.telefono}</p>
            <p><strong>Email:</strong> ${empresa.email}</p>

            <div class="actions">
                <a class="btn" href="${empresa.ubicacion}" target="_blank">Ubicación</a>
                <a class="btn" href="${empresa.web}" target="_blank">Web</a>
            </div>
        </div>
      `;

      container.appendChild(card);
    });

    aplicarImagenes(); // 🔥 importante

  });

  // ================= CURSOS =================
fetch('../Ar.json/data.json')
  .then(res => res.json())
  .then(data => {

    const container = document.getElementById('cursos-container');

    if (!container) return;

    data.cursos.slice(0, 3).forEach(curso => {

      const card = document.createElement('div');
      card.classList.add('course');

      card.innerHTML = `
        <img src="${curso.imagen}">

        <div class="course-content">
            <span class="level">${curso.categoria}</span>
            <h3>${curso.nombre}</h3>
            <p>${curso.descripcion}</p>

            <div class="actions1">
                <a class="btn" href="#" data-id="${curso.id}">
                  Ver Curso
                </a>
            </div>
        </div>
      `;

      container.appendChild(card);
    });

    activarCursos(data.cursos);

  });

  function activarCursos(cursos){

  document.querySelectorAll('.course .btn').forEach(btn => {

    btn.addEventListener('click', (e) => {
      e.preventDefault();

      const id = btn.getAttribute('data-id');
      const curso = cursos.find(c => c.id == id);

      if (!curso) return;

      if (curso.externo) {
        window.open(curso.url, '_blank');
      } else {
        window.location.href = `CursoDescripcion.html?id=${curso.id}`;
      }

    });

  });

}

document.getElementById("btnCursos")?.addEventListener("click", () => {
    window.location.href = "CursosPrincipal.html";
});

function filter(category) {
  const cards = document.querySelectorAll('.company');

  cards.forEach(card => {

    const categorias = card.dataset.category.split('|');

    if (category === 'all' || categorias.includes(category)) {
      card.classList.remove('hidden');
    } else {
      card.classList.add('hidden');
    }

  });
}

  
