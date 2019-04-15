
var ws=new WebSocket("ws://localhost:6002");
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