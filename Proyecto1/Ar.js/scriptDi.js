const toggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");

toggle.addEventListener("click", () => {
    menu.classList.toggle("active");
});


const fallback = "../img/Em3.jpg";

const contenedor = document.getElementById("catalogo");
const filtrosContainer = document.getElementById("filtros");

let empresasGlobal = [];

/* 🔥 CARGAR JSON */
fetch("../Ar.json/empresas.json")
.then(res => res.json())
.then(data => {
    empresasGlobal = data;
    crearFiltros(data);
    renderizar(data);

    // 🔥 BUSCADOR (VA AQUÍ DENTRO)
    const buscador = document.getElementById("buscadorCategorias");

    buscador.addEventListener("input", () => {
        const texto = buscador.value.toLowerCase().trim();

        const botones = filtrosContainer.querySelectorAll("button");

        botones.forEach(btn => {
            const categoria = btn.textContent.toLowerCase();

            if (categoria.includes(texto) || btn.dataset.cat === "Todos") {
                btn.style.display = "flex";
            } else {
                btn.style.display = "none";
            }
        });
    });
});



/* 🔥 CREAR FILTROS DINÁMICOS */
function crearFiltros(data){
    let todas = [];

    data.forEach(e => {
        const cats = e.categoria.split(",").map(c => c.trim());
        todas.push(...cats);
    });

    const categorias = ["Todos", ...new Set(todas)];

    filtrosContainer.querySelectorAll("button").forEach(b => b.remove());

    categorias.forEach((cat, index) => {
        const btn = document.createElement("button");
        btn.textContent = cat;
        btn.dataset.cat = cat;

        if(index === 0) btn.classList.add("active");

        btn.onclick = function(){
            filtrar(cat, this);
        };

        filtrosContainer.appendChild(btn);
    });
}

/* 🔥 FILTRAR */
function filtrar(categoria, boton){
    document.querySelectorAll(".filtros button").forEach(b => b.classList.remove("active"));
    boton.classList.add("active");

    if(categoria === "Todos"){
        renderizar(empresasGlobal);
    }else{
        const filtradas = empresasGlobal.filter(e => {
            const categorias = e.categoria.split(",").map(c => c.trim());
            return categorias.includes(categoria);
        });
        renderizar(filtradas);
    }
}

/* 🔥 RENDERIZAR CARDS */
function renderizar(data){
    contenedor.innerHTML = "";

    data.forEach(empresa => {

        const card = document.createElement("div");
        card.classList.add("card");

        const overlay = document.createElement("div");
        overlay.classList.add("overlay");

        let img = empresa.imagen;
        if (!img || img.trim() === "") img = fallback;

        const testImg = new Image();
        testImg.src = img;

        testImg.onload = () => setBackground(overlay, img);
        testImg.onerror = () => setBackground(overlay, fallback);
        const categoriasArray = empresa.categoria
            .split(",")
            .map(c => c.trim())
            .filter(c => c !== ""); // elimina vacíos

        const categoriasUnicas = [...new Set(categoriasArray)];

        const categoriasHTML = categoriasUnicas
            .map(c => `<span class="category">${c}</span>`)
            .join("");
        const content = document.createElement("div");
        content.classList.add("content");
        
        content.innerHTML = `
            <h2>${empresa.nombre}</h2>
            <span class="categorias">${categoriasHTML}</span>
            <div class="btns">
                <a href="${empresa.ubicacion}">Ubicación</a>
                <a href="${empresa.web}">Web</a>
            </div>
        `;

        const extra = document.createElement("div");
        extra.classList.add("extra");

        extra.innerHTML = `
            <h3>${empresa.nombre}</h3>
            <span class="categorias">${categoriasHTML}</span>
            <p><strong>Definición:</strong> ${empresa.definicion}</p>
            <p><strong>Materiales:</strong> ${empresa.materiales}</p>
            <p><strong>Servicios:</strong> ${empresa.servicios}</p>
            <p><strong>Tel:</strong> ${empresa.telefono}</p>
            <p><strong>Email:</strong> ${empresa.email}</p>
            <div class="btns">
                <a href="${empresa.ubicacion}" class="btn">Ubicación</a>
                <a href="${empresa.web}" class="btn">Página Web</a>
            </div>
        `;

        card.appendChild(overlay);
        card.appendChild(content);
        card.appendChild(extra);

        contenedor.appendChild(card);
    });
}

/* 🔥 BACKGROUND */
function setBackground(element, img){
    element.style.background = `
        linear-gradient(to top, rgba(0,0,0,0.7), transparent),
        url('${img}')
    `;
    element.style.backgroundSize = "cover";
    element.style.backgroundPosition = "center";
    element.style.backgroundRepeat = "no-repeat";
}

const buscador = document.getElementById("buscadorCategorias");

buscador.addEventListener("input", () => {
    const texto = buscador.value.toLowerCase().trim();

    const botones = document.querySelectorAll(".filtros button");

    botones.forEach(btn => {
        const categoria = btn.textContent.toLowerCase();

        if (categoria.includes(texto)) {
            btn.style.display = "inline-block";
        } else {
            btn.style.display = "none";
        }
    });
});

