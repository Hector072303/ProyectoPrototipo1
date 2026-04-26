const toggleBtn = document.getElementById('toggleBtn');
const filters = document.querySelector('.filters-wrapper');

// 👉 Abrir / cerrar menú
toggleBtn.addEventListener('click',()=>{
    filters.classList.toggle('show');
});

// 👉 Cerrar SOLO cuando se haga click en un filtro
filters.addEventListener('click',(e)=>{

    // Verificar que hizo click en un botón de categoría
    if(e.target.classList.contains('filter-btn')){
        filters.classList.remove('show');
    }

});

const grid = document.getElementById('courses');
const filtersContainer = document.getElementById('filters');

let cursosData = [];
let categoriaActiva = "all";

// 📌 Cargar JSON
fetch('../Ar.json/data.json')
.then(res => res.json())
.then(data => {
    cursosData = data.cursos;

    generarCategorias(cursosData);
    renderCursos(cursosData);
});

// 📌 Generar botones dinámicos de categorías
function generarCategorias(data){

    // Obtener categorías únicas
    let categoriasSet = new Set();

    data.forEach(curso => {

        // 🔥 separar por coma
        const cats = curso.categoria.split(",");

        cats.forEach(cat => {
            const limpia = cat.trim().toLowerCase(); // limpiar espacios
            if(limpia) categoriasSet.add(limpia);
        });

    });

    const categorias = ["all", ...categoriasSet];

    filtersContainer.innerHTML = "";

    categorias.forEach(cat => {

        const btn = document.createElement('button');
        btn.classList.add('filter-btn');

        if(cat === "all"){
            btn.textContent = "Todos";
            btn.classList.add('active');
        } else {
            btn.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        }

        btn.dataset.cat = cat;

        btn.addEventListener('click',()=>{
            document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
            btn.classList.add('active');

            categoriaActiva = cat;
            aplicarFiltros();
        });

        filtersContainer.appendChild(btn);
    });
}

// 📌 Render cursos
function renderCursos(lista){
    grid.innerHTML = "";

    lista.forEach(curso => {

        const imagen = curso.imagen ? curso.imagen : "../img/Reci2.jpg";

        const card = document.createElement('div');
        
        card.classList.add('card');
        card.setAttribute('data-cat', curso.categoria);
        
        card.innerHTML = `
            <img src="${imagen}">
            <div class="content">
                <div class="category">${curso.categoria}</div>
                <div class="title">${curso.nombre}</div>
                <div class="level">Duración: ${curso.duracion_total}</div>
                <span class="badge ${curso.externo ? 'external' : 'free'}">
                    ${curso.externo ? 'Externo' : 'Curso'}
                </span>
                <div class="type">${curso.descripcion}</div>
                
            </div>
        `;
        card.onclick = () => {

            if(curso.externo){
                window.open(curso.url, '_blank'); // abre en nueva pestaña
            } else {
                location.href = `CursoDescripcion.html?id=${curso.id}`;
            }

        };

        grid.appendChild(card);
    });
}

// 📌 Buscador
const search = document.getElementById('search');

search.addEventListener('keyup',()=>{
    aplicarFiltros();
});

// 📌 Filtro combinado
function aplicarFiltros(){

    const texto = search.value.toLowerCase();

    const filtrados = cursosData.filter(curso => {

        const coincideTexto =
            curso.nombre.toLowerCase().includes(texto) ||
            curso.descripcion.toLowerCase().includes(texto);

        const coincideCategoria =

            categoriaActiva === "all" ||

            curso.categoria
                .toLowerCase()
                .split(",")
                .map(c => c.trim())
                .includes(categoriaActiva);

        return coincideTexto && coincideCategoria;
    });

    renderCursos(filtrados);
}
/* filtrador de categorias */
const searchInput = document.querySelector(".category-search");
const filterButtons = document.querySelectorAll(".filter-btn");

document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.querySelector(".category-search");

    searchInput.addEventListener("input", () => {
        const texto = searchInput.value.toLowerCase().trim();

        const filterButtons = document.querySelectorAll(".filter-btn"); // 🔥 AQUÍ

        filterButtons.forEach(btn => {
            const categoria = btn.textContent.toLowerCase();

            if (texto === "" || categoria.includes(texto)) {
                btn.style.display = "flex";
            } else {
                btn.style.display = "none";
            }
        });
    });

});