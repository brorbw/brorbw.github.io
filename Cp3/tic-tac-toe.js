"use strict";
var canvas;
var gl;

var grid = [9][9];

var coordinates;

var width, height;

var cellStartCoordinate = [];

var vBuffer;
var vPlayerBuffer;
var cross;

window.onload = function init(){
  cross=true;
  canvas = document.getElementById( "gl-canvas" );
  canvas.addEventListener("click", function(){
    gl.bindBuffer(gl.ARRAY_BUFFER, vPlayerBuffer);
    var x = event.clientX
    var y = event.clientY
    var startCoordinates = getCellNumberFromXYMouseInput(x,y);
    //debuggin coordinate input
    console.log("MouseInput:" + " start"+startCoordinates+", x: "+x+", y: "+y);
  })
  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }

  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor( 0.8, 0.8, 0.8, 1.0 );
  gl.clear( gl.COLOR_BUFFER_BIT );

  width = canvas.width;
  height = canvas.height;

  var program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );

  vPlayerBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vPlayerBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, sizeof["vec2"]*4,gl.STATIC_DRAW);
  var vPPos = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPPos,2,gl.FLOAT, false,0,0);
  gl.enableVertexAttribArray(vPPos);


  vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, sizeof['vec2']*4*9, gl.STATIC_DRAW);
  var vPos = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPos,2,gl.FLOAT,false,0,0);
  gl.enableVertexAttribArray(vPos);


  drawGrid();
  render();
}


//part of the snapTool, use for snapping border on blocks
function getCellNumberFromXYMouseInput(y,x){ //turn'd the algo the wrong way
  //gridIndex running from 0-8
  var index = 0;
  for(var iX = 1; iX < 4; iX++){
    for(var iY = 1; iY < 4; iY++){
      if(x < iX*width/3 && y < iY*width/3){
        return index;
      }
      index++;
    }
  }
}

function drawGrid(){
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  var index = 0;
  var vertarray = [
    vec2(-1,1),
    vec2(1,1),
    vec2(1,-1),
    vec2(-1,-1)
  ];

  for(var x = 0; x < 3; x++){
   for(var y = 0; y < 3; y++){
     var box = drawSquare(x*(width/3),y*(height/3));
     gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2']*4*index, flatten(box));
     console.log(index+':'+x+':'+y+' square:'+box.toString());
     index++;
   }
 }
}

function drawSquare(x,y){
  cellStartCoordinate.push(vec2(x,y));//put the starting coordinate of the square to find it
  return [
    convert(x,y),
    convert(x+width/3,y),
    convert(x+width/3,y+height/3),
    convert(x,y+height/3)
  ];
}

function drawCross(x,y){
  return [
    convert(x,y),
    convert(x+width/3,y+height/3),
    convert(x+width/3,y),
    convert(x,y+height/3)
  ];
}

function convert(x,y){
  return vec2(-1+((2*x)/width),-1+(2*(height-y))/height);
}

function render(){
  gl.clear(gl.COLOR_BUFFER_BIT);
  for(var i = 0; i < 9*4; i+=4){
     //onsole.log("printing point at: "+i);
     gl.drawArrays(gl.LINE_LOOP, i, 4);
  }
  window.requestAnimFrame(render);
}
