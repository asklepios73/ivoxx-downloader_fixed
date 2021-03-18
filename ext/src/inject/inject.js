count = 0;
async function downloadPodcast(c, i){
      console.log(`curl -L "${c.href}" --output "${c.title}"`);
      let b = await fetch(c.href).then( r => r.blob())                  
      saveAs(b, c.title)      
}

function downloadPodcasts(button){
      button.innerHTML = "Bajando podcasts";
      button.disabled=true
      t = "https://www.ivoox.com/listenembeded_mn_12345678_1.mp3?source=EMBEDEDHTML5";
      var podcast = [...document.querySelectorAll('.title-wrapper a')]
      count = podcast.length;
      podcast.map(a => ({title : a.innerText, id : a.href.match(/\d{4,8}/g)[0]}))
            .map(d => ({...d, href : t.replace('12345678', d.id)}))
            .map(d => ({...d, title : `"${d.title.toLowerCase().replace(/ /g, '_')}.m4a"`}))                                    
            .forEach( (c,i) => {
                  downloadPodcast(c,i).then( ()=>{
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
            })
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
                        div.append(newDiv);
                        newContent.onclick=function(){
                              downloadPodcasts(newContent);
                        }
                  }
            }
	}, 10);
});