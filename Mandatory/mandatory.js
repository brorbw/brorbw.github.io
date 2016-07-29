"use strict";

var canvas;
var gl;

var gridSize = 20;
var numberOfBoxes = 0;
var vBuffer;
var vPos;

var width, height;

window.onload = function init(){
  canvas = document.getElementById( "gl-canvas");
  gl = WebGLUtils.setupWebGL(canvas);
  if(!gl){alert("WebGL isn't available");}
  width = canvas.width;
  height = canvas.height;
  gl.viewport(0,0,width,height);
  gl.clearColor(0.8,0.8,0.8,1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  var program = initShaders(gl, "vertex-shader","fragment-shader");
  gl.useProgram(program);
  vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, sizeOfTheArray(), gl.STATIC_DRAW);
  vPos = gl.getAttribLocation(program, "vPosition");
  //maybe there needs to be made links to the attributes in the vertex-shader
  drawGrid();
  render();
}

function sizeOfTheArray(){
  //for calculating the size of the buffer containing the blocks
  return sizeof["vec2"]*4*gridSize*gridSize;
}

function drawGrid(){
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  var index = 0;
  var tmpArray = [];
  for(var x = 0; x < gridSize; x++){
   for(var y = 0; y < gridSize; y++){
     var box = drawSquare(x*(width/gridSize),y*(height/gridSize));
     //tmpArray.push(box);
     gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2']*4*index, flatten(box));
     console.log(index+':'+x+':'+y+' square:'+box.toString());
     index++;
     numberOfBoxes++;
   }
 }
 //gl.bufferSubData(gl.ARRAY_BUFFER, 0, flatten(box));
}

function drawSquare(x,y){
  //cellStartCoordinate.push(vec2(x,y));//put the starting coordinate of the square to find it
  return [
    convert(x,y),
    convert(x+width/gridSize,y),
    convert(x+width/gridSize,y+height/gridSize),
    convert(x,y+height/gridSize)
  ];
}
function convert(x,y){
  return vec2(-1+((2*x)/width),-1+(2*(height-y))/height);
}

function render(){
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.vertexAttribPointer(vPos, 2, gl.FLOAT, false, 0,0);
  gl.enableVertexAttribArray(vPos);
  //gl.drawArrays(gl.LINE_LOOP, 0, gridSize*gridSize*4);
  for(var i = 0; i < 4*numberOfBoxes; i+=4){
    gl.drawArrays(gl.LINE_LOOP, i, 4);
  }
}
