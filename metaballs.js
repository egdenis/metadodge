var GAME;

window.onload = function(){
  GAME = new game();
  GAME.act();
}

function game(){
  this.preRenderCanvas = document.createElement("canvas")
  this.ctxPreRender = this.preRenderCanvas.getContext("2d");
  this.ctx = canvas.getContext("2d");

  

  this.preRenderCanvas.height = canvas.width = 1000;
  this.preRenderCanvas.width = canvas.height = 1000;

  this.width = canvas.width;
  this.height = canvas.height;


  this.ctx.fillRect(0,0,10,10)
  this.points = [];
  this.threshold = 240;

  for (var i = 50; i >= 0; i--) {
    var x = this.width*Math.random();
    var y = this.width*Math.random();
    var vx = Math.random()*10-5;
    var vy = Math.random()*10-5;
    var size = Math.random()*10+150;
    this.points.push({x:x,y:y,vx:vx,vy:vy,size:size});
  };
  this.metapoints = [];
}

game.prototype.act = function(){
  metabolize();
  processMetaball();
  requestAnimFrame(GAME.act);
}


function metabolize(){ 
  GAME.ctxPreRender.clearRect(0,0,GAME.width,GAME.height)
  for (var i = GAME.points.length - 1; i >= 0; i--) {
    var point = GAME.points[i];
    point.x += point.vx;
    point.y += point.vy;

    if(point.x > GAME.width+point.size){
        point.x = 0-point.size;
    }
    if(point.x < 0-point.size){
        point.x = GAME.width+point.size;
    }
    if(point.y > GAME.height+point.size){
        point.y = 0-point.size;
    }
    if(point.y < 0-point.size){
        point.y = GAME.height+point.size;
   }

    GAME.ctxPreRender.beginPath();
    var gradient = GAME.ctxPreRender.createRadialGradient(point.x, point.y, 1, point.x, point.y, point.size);
    gradient.addColorStop(1,"rgba(0,0,0,0)");
    gradient.addColorStop(0,"green");
    GAME.ctxPreRender.fillStyle = gradient;
    GAME.ctxPreRender.arc(point.x, point.y, point.size, 0, Math.PI*2);
    GAME.ctxPreRender.fill();
  };
}

function processMetaball(){
  var frame = GAME.ctxPreRender.getImageData(0,0,GAME.width,GAME.height)
  var pixel = frame.data;

  for (var i = 0, n = pixel.length; i <n; i += 4) {
    if(pixel[i+3]<GAME.threshold){
       pixel[i+3]=0;
        
        
    }
  }
  GAME.ctx.putImageData(frame, 0, 0);    
}

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
          };
})();

