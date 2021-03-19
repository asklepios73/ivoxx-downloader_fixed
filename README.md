# ivoox-download

Extension Chrome para descargar automáticamente podcast desde Ivoox

## Idea

https://twitter.com/ciberado/status/1372229716162252800

https://pastebin.com/raw/AkGicXnF

## Instalar

Descargar y descomprimir la última versión desde la pestaña de Releases del proyecto

Ir a las opciones de configuración del navegador, extensiones y añadir la carpeta como
extension descomprimida.

Reiniciar el navegador.

## Ivoox

La extensión se activará cuando se detecte que la pestaña actual corresponde al dominio
https://*.ivoox.com 

Una vez en la página, la extensión buscará el elemento "Filter" y creará un botón que al ser
pulsado descargará todos los podcast de la página

```
// Descargar podcasts de ivoox

t = "https://www.ivoox.com/listenembeded_mn_12345678_1.mp3?source=EMBEDEDHTML5";
[...document.querySelectorAll('.title-wrapper a')]
	.map(a => ({title : a.innerText, id : a.href.match(/\d{4,8}/g)[0]}))
	.map(d => ({...d, href : t.replace('12345678', d.id)}))
	.map(d => `curl -L "${d.href}" --output "${d.title.toLowerCase().replace(/ /g, '_')}.m4a"`)
	.forEach(c => console.log(c))
```

*NOTA* : para facilitar la descarga automática deshabilita la opción de "Confirmar la descarga de ficheros"

## Código

En el manifest se configura que este scritp se ejecutará sólo cuando el navegador esté visitando la web de ivoox:

```
"content_scripts": [
    {
      "matches": [
        "https://*.ivoox.com/*"
      ],      
      "run_at": "document_end",
      "js": [
        "src/FileSaver.min.js",
        "src/util.js",
        "src/inject/inject.js"
      ]
    }
  ]
```

Momento en el cual injectará los 3 scripts indicados.

- FileSaver es una librería publica para descargar ficheros remotos mediante Javascript
- util.js no tiene uso actualmente
- inject donde reside la lógica de la extensión

Prácticamente la totalidad de los ficheros de este proyecto son para tener la "infraestructura" mínima para construir una extensión
de Chrome salvo el fichero `ext/src/inject/injects.js` donde reside la lógica de la extensión

```
chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
		if (document.readyState === "complete") {		
                  clearInterval(readyStateCheckInterval);                  
                  var div = document.body.querySelector('div[id="main"]>div>div[class="container"]')
                  if( div ){
                        var newDiv = document.createElement("div");
                        var newContent = document.createElement("button",{id:"ivoox-download"});
                        newContent.innerHTML = "Lo quiero TODO";
                        newDiv.appendChild(newContent);
                        div.append(newDiv);
                        newContent.onclick=function(){
                              downloadPodcasts(newContent);
                        }
                  }
            }
	}, 10);
});
```

## Build

Para generar el zip con el formato que requiere Chrome hay que ejecutar

`./gradlew build`

En realidad no se requiere una herramienta como gradle pues lo que se hace simplemente es actualizar el manifest y comprimirlo pero es una
herramienta que uso a menudo y que me deja crear tasks y añadir extensiones 

