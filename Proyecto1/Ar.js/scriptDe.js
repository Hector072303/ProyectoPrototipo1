document.addEventListener("DOMContentLoaded", () => {

    const id = new URLSearchParams(location.search).get('id');

    fetch('../ar.Json/data.json')
    .then(r => r.json())
    .then(data => {

        document.getElementById('btnCurso').onclick = () => {
            location.href = `CursoVideos.html?id=${curso.id}`;
        };
        const curso = data.cursos.find(c => c.id == id);

        if(!curso){
            document.body.innerHTML = "<h2>Curso no encontrado</h2>";
            return;
        }

        // INFO
        document.getElementById('nombre').innerText = curso.nombre;
        document.getElementById('desc').innerText = curso.descripcion;
        document.getElementById('duracion').innerText = "Duración: " + curso.duracion_total;

        const contenedor = document.getElementById('listaVideos');

        if(!contenedor){
            console.error("No existe #listaVideos en el HTML");
            return;
        }

        // LIMPIAR
        contenedor.innerHTML = "";

        // CREAR VIDEOS
        curso.videos.forEach(video => {

            const div = document.createElement('div');
            div.classList.add('video-item');

            div.innerHTML = `
                <div class="video-header">
                    <div class="video-title">${video.nombre}</div>
                    <div class="icono">▶</div>
                </div>
                <div class="video-content">
                    <p><strong>${video.titulo}</strong></p>
                    <p>${video.descripcion}</p>
                    <p>Duración: ${video.duracion}</p>
                </div>
            `;

            // CLICK
            div.querySelector('.video-header').addEventListener("click", () => {

                document.querySelectorAll('.video-item').forEach(item => {
                    if(item !== div){
                        item.classList.remove('active');
                    }
                });

                div.classList.toggle('active');
            });

            contenedor.appendChild(div);
        });

    })
    .catch(err => {
        console.error("Error cargando JSON:", err);
    });

});