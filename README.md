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

