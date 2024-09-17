count = 0;

async function downloadPodcast(c, i){
        console.log(`curl -L "${c.href}" --output "${c.title}"`);
        let b = await fetch(c.href).then( r => r.blob())                  
        saveAs(b, c.title)
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function transformarFecha(fecha) {
    const meses = {
        'ene': '01',
        'feb': '02',
        'mar': '03',
        'abr': '04',
        'may': '05',
        'jun': '06',
        'jul': '07',
        'ago': '08',
        'sep': '09',
        'oct': '10',
        'nov': '11',
        'dic': '12'
    };
    let partes = fecha.match(/(\d{2}):(\d{2}) - (\d{2}) de (\w{3})\. de (\d{4})/);
    return `${partes[5]}.${meses[partes[4]]}.${partes[3]}`;
}

async function downloadPodcasts(button){
    button.innerHTML = "Bajando podcasts";
    button.disabled=true
    t = "https://www.ivoox.com/listenembeded_mn_12345678_1.mp3?source=EMBEDEDHTML5";
    var podcast = [...document.querySelectorAll('.title-wrapper a')]
    var fecha = [...document.querySelectorAll('.date')]

    count = podcast.length;
    var podcasts = podcast.map((a, index) => ({title : a.title, id : a.href.match(/mp3_rf_(.*?)_1.html/)[1], date: transformarFecha(fecha[index].title)}))
        .map(d => ({...d, href : t.replace('12345678', d.id)}))
        .map(d => ({...d, title : `${d.date} - ${d.title}.mp3`}));
    
    for (let i = 0; i < podcasts.length; i++) {
        await downloadPodcast(podcasts[i],i).then( ()=>{
            count--;
            console.log(count)
            button.innerHTML = `Quedan ${count}`;
            if( count < 1){
                button.innerHTML = "Lo quiero TODO";
                button.disabled=false
            }                                                                                                              
        }).catch(e => {
            count--;
            button.innerHTML = `Quedan ${count}`;
            if( count < 1){
                button.innerHTML = "Lo quiero TODO";
                button.disabled=false
            } 
        });
        await sleep(3000); // Espera 3 segundos antes de la próxima descarga
    }
}

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
                        newContent.onclick=function(){
                              downloadPodcasts(newContent);
                        }
                        div.append(newDiv);
                  }
            }
	}, 10);
});
