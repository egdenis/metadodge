function UI(buttons,boxes){
  this.buttons = buttons||[];
  this.boxes = boxes||[];
}

UI.prototype.drawUI = function(){
    if (!GAME.state) {
      GAME.state = "menu"
    };
    for (var i = this.boxes.length - 1; i >= 0; i--) {

      if (GAME.state == this.boxes[i].state)
        this.boxes[i].draw();
    };

    for (var i = this.buttons.length - 1; i >= 0; i--) {
      if (GAME.state == this.buttons[i].state)
        this.buttons[i].draw();
    };
} 

function Box(x,y,width,height,fillStyle,strokeStyle,boxStyle,state,text,lineWidth,font){
  this.x = x-width/2;
  this.y = y-height/2;
  this.width = width;
  this.height = height;
  this.boxStyle = boxStyle;
  this.text = text || "";
  this.strokeStyle = strokeStyle || "rgb(130,130,130)"
  this.fillStyle = fillStyle || "rgb(50,50,50)"
  this.state = state;
  this.lineWidth = lineWidth||1.3;
  this.font =font||"bold 19px Verdana";
  this.fontSize = parseInt(this.font.replace( /(^.+)(\w\d+\w)(.+$)/i,'$2'))
}


Box.prototype.draw = function(){
  GAME.ctx.fillStyle = this.fillStyle;
  GAME.ctx.strokeStyle = this.strokeStyle;
  GAME.ctx.lineWidth = 3

  if (this.boxStyle == "roundRect"){
    roundRect(GAME.ctx,this.x,this.y,this.width,this.height,10)
    GAME.ctx.fill();
    GAME.ctx.stroke();
  }
  else{
    GAME.ctx.fillRect(this.x,this.y,this.width,this.height);
    GAME.ctx.strokeRect(this.x,this.y,this.width,this.height);

  }

  GAME.ctx.lineWidth = this.lineWidth
  GAME.ctx.font = this.font;
  GAME.ctx.strokeText(this.text,this.x+(this.width-GAME.ctx.measureText(this.text).width)/2,this.y+.5*this.height+.3*this.fontSize)
}



Button.prototype = new Box(0,0,0,0,"","","roundRect","")
function Button(x,y,width,height,text,state,callback,strokeStyle,fillStyle){
  this.x = x-width/2;
  this.y = y-height/2;
  this.width = width;
  this.height = height;
  this.callback = callback 
  this.text = text || "";
  this.strokeStyle = strokeStyle || "rgb(130,130,130)"
  this.fillStyle = fillStyle || "rgb(50,50,50)"
  this.state = state;
}

Button.prototype.isClicked = function(x,y){
  if (this.x<x&&this.y<y&&this.x+this.width>x&&this.y+this.height>y) {
    return true;
  };
}

function roundRect (ctx, x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  GAME.ctx.beginPath();
  GAME.ctx.moveTo(x+r, y);
  GAME.ctx.arcTo(x+w, y,   x+w, y+h, r);
  GAME.ctx.arcTo(x+w, y+h, x,   y+h, r);
  GAME.ctx.arcTo(x,   y+h, x,   y,   r);
  GAME.ctx.arcTo(x,   y,   x+w, y,   r);
  GAME.ctx.closePath();
}
