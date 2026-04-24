// OBTENER ID
const id = new URLSearchParams(location.search).get('id');

// BOTÓN VOLVER
document.getElementById('volver').onclick = ()=>{
    window.location.href = `CursoDescripcion.html?id=${id}`;
};

// FUNCIONES INTELIGENTES
function valorSeguro(valor, defecto){
    return (valor && valor !== "") ? valor : defecto;
}

function obtenerUsuario(url){
    try{
        if(url.includes("@")){
            return url.split("@")[1];
        }
        return null;
    }catch{
        return null;
    }
}

// MINIATURA
function getMiniatura(url){
    try{
        const idVideo = url.split('/embed/')[1].split('?')[0];
        return `https://img.youtube.com/vi/${idVideo}/hqdefault.jpg`;
    }catch{
        return "https://via.placeholder.com/120x70";
    }
}

// CARGAR DATA
fetch('../Ar.json/data.json')
.then(r=>r.json())
.then(data=>{

    const curso = data.cursos.find(c=>c.id==id);
    const lista = document.getElementById('lista');

    function cargar(v){

        // VIDEO
        document.getElementById('video').innerHTML =
        `<iframe class="player" src="${v.youtube}" allowfullscreen></iframe>`;

        titulo.innerText = v.titulo;

        // INFO
        document.getElementById('info').innerHTML = `
            <p><strong>Nombre:</strong> ${v.nombre}</p>
            <p><strong>Descripción:</strong> ${v.descripcion}</p>
            <p><strong>Duración:</strong> ${v.duracion}</p>
        `;

        // ===== AUTOR PRO =====
        let autor = v.autor || {};

        let nombre = valorSeguro(autor.nombre, "Autor desconocido");
        let canal = valorSeguro(autor.canal, "Canal no especificado");
        let licencia = valorSeguro(autor.licencia, "Licencia no especificada");
        let url = valorSeguro(autor.url, v.youtube);
        let verificado = autor.verificado ? true : false;

        let usuario = obtenerUsuario(url);

        let avatar = usuario 
            ? `https://unavatar.io/youtube/${usuario}`
            : `https://ui-avatars.com/api/?name=${nombre}&background=22c55e&color=fff`;

        let autorHTML = `
        <div class="autor-card">

            <img class="autor-avatar" src="${avatar}"
            onerror="this.src='https://via.placeholder.com/60'">

            <div>

                <div class="autor-nombre">
                    ${nombre}
                    ${verificado ? '<span class="verificado"> ✔</span>' : ''}
                </div>

                <p><strong>Canal:</strong> ${canal}</p>
                <p><strong>Licencia:</strong> ${licencia}</p>

                <a href="${url}" target="_blank" class="autor-link">
                    Ver fuente
                </a>

            </div>

        </div>
        `;

        document.getElementById('autor').innerHTML = autorHTML;
    }

    // LISTA
    curso.videos.forEach((v,i)=>{

        const div = document.createElement('div');
        div.className = 'lesson';

        div.innerHTML = `
            <img src="${getMiniatura(v.youtube)}">
            <span>${v.titulo}</span>
        `;

        div.onclick = ()=>cargar(v);

        lista.appendChild(div);

        if(i==0) cargar(v);
    });

});

// TABS
btnInfo.onclick = ()=>{
    info.style.display="block";
    autor.style.display="none";
    btnInfo.classList.add('active');
    btnAutor.classList.remove('active');
};

btnAutor.onclick = ()=>{
    info.style.display="none";
    autor.style.display="block";
    btnAutor.classList.add('active');
    btnInfo.classList.remove('active');
};
