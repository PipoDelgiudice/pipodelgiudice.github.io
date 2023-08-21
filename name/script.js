// Obtenemos la URL completa
        var url = window.location.href;
        var queryString = url.split('?')[1];

        if (queryString !== undefined){
            var queryParams = queryString.split('&');
            var variables = {};

            for (var i = 0; i < queryParams.length; i++) {
                var pair = queryParams[i].split('=');
                var key = decodeURIComponent(pair[0]);
                var value = decodeURIComponent(pair[1]);
                variables[key] = value;
            }

            // Accedemos a la variable "name"
            var variable1 = variables["name"];

            // Verificamos si la variable está presente y tiene un valor
            if (variable1 !== undefined && variable1 !== "") {
                console.log("La variable 'name' está presente con el valor:", variable1);
                async function consultarAPIs() {
                    nombre = 'agustin';

                    try {
                      const [nationalizeResponse, genderizeResponse, agifyResponse] = await Promise.all([
                        fetch(`https://api.nationalize.io?name=${nombre}`).then(response => response.json()),
                        fetch(`https://api.genderize.io/?name=${nombre}`).then(response => response.json()),
                        fetch(`https://api.agify.io/?name=${nombre}`).then(response => response.json())
                      ]);

                      const data = {
                        nombre,
                        paisesComunes: nationalizeResponse.country,
                        genero: genderizeResponse.gender,
                        probabilidadGenero: genderizeResponse.probability,
                        edad: agifyResponse.age
                      };

                      mensajeDiv.textContent = JSON.stringify(data, null, 2);
                    } catch (error) {
                      mensajeDiv.textContent = 'Ocurrió un error al consultar las APIs';
                    }
                }
                consultarAPIs()
            }
        }
         else {
            console.log("La variable 'name' no está presente o no tiene valor.");
            var containerDiv = document.createElement("div");
            containerDiv.className = "container";

            var h1 = document.createElement("h1");
            h1.textContent = "Consulta de Información";

            var input = document.createElement("input");
            input.type = "text";
            input.id = "nombreInput";
            input.placeholder = "Ingresa un nombre";

            var button = document.createElement("button");
            button.id = "consultarBtn";
            button.textContent = "Consultar";

            var pre = document.createElement("pre");
            pre.id = "resultados";
            pre.className = "resultados";

            containerDiv.appendChild(h1);
            containerDiv.appendChild(input);
            containerDiv.appendChild(button);
            containerDiv.appendChild(pre);

            // Agregar el contenedor al cuerpo del documento
            document.body.appendChild(containerDiv);
        }

document.addEventListener('DOMContentLoaded', () => {
  const consultarBtn = document.getElementById('consultarBtn');
  const nombreInput = document.getElementById('nombreInput');
  const resultadosDiv = document.getElementById('resultados');

  consultarBtn.addEventListener('click', async () => {
    resultadosDiv.textContent = '';

    const nombre = nombreInput.value.trim();

    if (nombre === '') {
      resultadosDiv.textContent = 'Ingresa un nombre válido';
      return;
    }

    try {
      const [nationalizeResponse, genderizeResponse, agifyResponse] = await Promise.all([
        fetch(`https://api.nationalize.io?name=${nombre}`).then(response => response.json()),
        fetch(`https://api.genderize.io/?name=${nombre}`).then(response => response.json()),
        fetch(`https://api.agify.io/?name=${nombre}`).then(response => response.json())
      ]);

      const data = {
        nombre,
        paisesComunes: nationalizeResponse.country,
        genero: genderizeResponse.gender,
        probabilidadGenero: genderizeResponse.probability,
        edad: agifyResponse.age
      };

      resultadosDiv.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
      resultadosDiv.textContent = 'Ocurrió un error al consultar las APIs';
    }
  });
});
