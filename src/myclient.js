
var ws=new WebSocket("https://hashland.herokuapp.com");
ws.onopen=function(){
    setTitle("Connected to heroku")
};
ws.onclose=function(){
    setTitle("Disconnected")
}
ws.onmessage=function(event){
    console.log(event.data)
}

function setTitle(title){
    document.querySelector('h1').innerHTML=title;
};