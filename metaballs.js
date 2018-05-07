var GAME;

window.onload = function(){
  window.addEventListener('mousemove', onMousemove, false);

  GAME = new game();
  console.log("gsf")
  GAME.metaball.makePoints(32);

  GAME.act();
}

function game(){
  this.preRenderCanvas = document.createElement("canvas")
  this.ctxPreRender = this.preRenderCanvas.getContext("2d");
  this.ctx = canvas.getContext("2d");
  canvas.style.cursor = 'none';
  canvas.style.border = "1px solid black"
  this.gameover = false;
  
this.score = 0
  this.preRenderCanvas.height = canvas.width = 600;
  this.preRenderCanvas.width = canvas.height = 600;

  this.width = canvas.width;
  this.height = canvas.height;

  this.player = new player();
  this.metaball = new metaballs();
  }

game.prototype.act = function(){
  GAME.metaball.metabolize();
  GAME.metaball.processMetaball();
  GAME.player.act();
  GAME.score +=1
  if(GAME.score%500 == 0){
    console.log(GAME.score);
  }
  requestAnimFrame(GAME.act);
}

function metaballs(){
  this.points = [];
  this.threshold = 220;
  this.MAX_SIZE = 200;
  this.MAX_SPEED = 4;
  }

metaballs.prototype.makePoints = function(num){
  for (var i = num; i >= 0; i--) {
    var x = GAME.width*.5;
    var y = GAME.width*.5;
    var vx = Math.random()*this.MAX_SPEED*2 - this.MAX_SPEED;
    var vy = Math.random()*this.MAX_SPEED*2 - this.MAX_SPEED;
    var size = Math.random()*this.MAX_SIZE+70;
    var color2 = randomColor(0);
    var color1 = randomColor(1);

    this.points.push({x:x,y:y,vx:vx,vy:vy,size:size, color1:color1, color2: color2});
  };
}
function parseRGBA(rgb){
    rgb = rgb.substring(4, rgb.length-1)
             .replace(/ /g, '')
             .split(',');
    return rgb
}
metaballs.prototype.metabolize =function(){ 
  GAME.ctxPreRender.clearRect(0,0,GAME.width,GAME.height)
  for (var i = this.points.length - 1; i >= 0; i--) {
    var point = this.points[i];
    point.x += point.vx;
    point.y += point.vy;

    //var colors = parseRGBA(color1)
    //var color2 = parseRGBA(color2)
    

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
    gradient.addColorStop(1,point.color2);
    gradient.addColorStop(0,point.color1);
    GAME.ctxPreRender.fillStyle = gradient;
    GAME.ctxPreRender.arc(point.x, point.y, point.size, 0, Math.PI*2);
    GAME.ctxPreRender.fill();
  };
}

metaballs.prototype.processMetaball = function(){
  var frame = GAME.ctxPreRender.getImageData(0,0,GAME.width,GAME.height)
  var pixel = frame.data;

  for (var i = 0, n = pixel.length; i <n; i += 4) {
    if(pixel[i+3]<this.threshold){
       pixel[i+3]=0;  
    }
  }

  var ymax = GAME.player.y+GAME.player.radius; 
  var xmax = GAME.player.x+GAME.player.radius;

  for (var y = GAME.player.y-GAME.player.radius; y < ymax; y+=3) {
    for (var x = GAME.player.x-GAME.player.radius; x < xmax; x+=3) {
      var index = (y * GAME.width + x) * 4;
      if (pixel[index+3]) {
        if(GAME.gameover == false)
          console.log(GAME.score)
           GAME.player.color = "rgba(0,0,0,0)";
        GAME.gameover = true;
        
      };
    }
  }
  GAME.ctx.putImageData(frame, 0, 0);    

}

function player(){
  this.x = -10;
  this.y = -10;
  this.radius = 3;
  this.color = "blue"
}

player.prototype.draw = function(){
  GAME.ctx.fillStyle = this.color
  GAME.ctx.beginPath();
  GAME.ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
  GAME.ctx.fill();
}

player.prototype.act = function(){
  this.draw();
}

function randomColor(alpha){
  return "rgba(" +Math.floor(Math.random()*255) +","+Math.floor(Math.random()*255) +","+Math.floor(Math.random()*255) +"," + alpha + ")";
}

function onMousedown(e){
  var pos = getMousePos(canvas, e);

}


function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

function onMousemove(e){
  var pos = getMousePos(canvas, e);
  GAME.player.x = pos.x;
  GAME.player.y = pos.y;
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

