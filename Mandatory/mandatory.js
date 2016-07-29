"use strict";

var canvas;
var gl;

var gridSize = 10;
var numberOfBoxes = 0;
var vBuffer,cBuffer;
var vPos;
var vColor;
var toggle = true;
var width, height;
var type = 0;
var cellStartCoordinates = [];

var map = [];

var world;

var colors = [
    vec4( 0.0, 0.0, 0.0, 0.0), //nothing
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green-gras
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue-water
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red-water
    vec4( 0.5, 0.25, 0.0, 1.0 ),  // brown-dirt
    vec4( 0.0, 0.0, 0.0, 1) // curser maybe
];

window.onload = function init(){

  //initialize
  canvas = document.getElementById( "gl-canvas");
  gl = WebGLUtils.setupWebGL(canvas);
  if(!gl){alert("WebGL isn't available");}
  width = canvas.width;
  height = canvas.height;
  gl.viewport(0,0,width,height);
  gl.clearColor(0.6,0.8,1,1);
  gl.clear(gl.COLOR_BUFFER_BIT);
  var program = initShaders(gl, "vertex-shader","fragment-shader");
  gl.useProgram(program);


  //making the buffers
  vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, sizeOfTheArray(), gl.STATIC_DRAW);
  vPos = gl.getAttribLocation(program, "vPosition");
  cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, gridSize*gridSize*sizeof['vec4']*4, gl.STATIC_DRAW)
  vColor = gl.getAttribLocation(program, "vColor");
  //onclicks
  canvas.addEventListener("click",clickFunction);
  var menu = document.getElementById("mymenu");
  initWorld();
  menu.addEventListener("click", function(){
    switch(menu.selectedIndex){
      case 0 : type = 0 ; break;//nothing
      case 1 : type = 1 ; break;//dirt
      case 2 : type = 2 ; break;//dirt
      case 3 : type = 3 ; break;//dirt
      case 4 : type = 4 ; break;//dirt
      case 5 : type = 5 ; break;//dirt
    }
  });
  //maybe there needs to be made links to the attributes in the vertex-shader
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.vertexAttribPointer(vPos, 2, gl.FLOAT, false, 0,0);
  gl.enableVertexAttribArray(vPos);

  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.vertexAttribPointer(vColor,4,gl.FLOAT,false,0,0);
  gl.enableVertexAttribArray(vColor);

  drawGrid();
  render();

}

function sizeOfTheArray(){
  //for calculating the size of the buffer containing the blocks
  return sizeof["vec2"]*4*gridSize*gridSize;
}

function drawGrid(){
  var tmpArray = [];
  for(var x = 0; x < gridSize; x++){
    for(var y = 0; y < gridSize; y++){
      //This fills op the grid so we know wehre everything is
      cellStartCoordinates.push(vec2(x*(width/gridSize),y*(height/gridSize)));
    }
  }
}

function drawSquare(y,x){
  //put the starting coordinate of the square to find it
  numberOfBoxes++;
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
  gl.clear(gl.COLOR_BUFFER_BIT);
  //gl.drawArrays(gl.LINE_LOOP, 0, gridSize*gridSize*4);

  if(world != null){
    for(var i = 0; i < gridSize*gridSize; i++){
      //var pos = indexToXYIn2DArray(i);
      //if(world[pos[0]][pos[1]] != 0){
        gl.drawArrays(gl.TRIANGLE_FAN, i*4, 4);
      //}
    }
  }



}

function clickFunction(event){
  toggle = !toggle;
  var x = event.clientX;
  var y = event.clientY;
  var startCoordinates = getCellNumberFromXYMouseInput(x,y);
  var newX = (cellStartCoordinates[startCoordinates])[0];
  var newY = (cellStartCoordinates[startCoordinates])[1];
  var arrayIndex = indexToXYIn2DArray(startCoordinates);
  console.log(arrayIndex[0]);
  console.log("world: "+ world+", type: "+ type);
  var indexX = arrayIndex[0];
  var indexY = arrayIndex[1];
  world[indexX][indexY] = type;
  var newBoxToDraw = drawSquare(newX,newY);
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2']*4*startCoordinates, flatten(newBoxToDraw));

  var color = vec4(colors[type]);
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec4']*(startCoordinates*4), flatten(color));
  gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec4']*(startCoordinates*4+1), flatten(color));
  gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec4']*(startCoordinates*4+2), flatten(color));
  gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec4']*(startCoordinates*4+3), flatten(color));
  console.log(startCoordinates+' : '+x+':'+y+' square:'+newBoxToDraw.toString());


  render();
}

function getCellNumberFromXYMouseInput(y,x){ //turn'd the algo the wrong way
  //gridIndex running from 0-8
  var index = 0;
  for(var iX = 1; iX < gridSize+1; iX++){
    for(var iY = 1; iY < gridSize+1; iY++){
      if(x < iX*width/gridSize && y < iY*width/gridSize){
        return index;
      }
      index++;
    }
  }
}

function indexToXYIn2DArray(index){
  var tmp = 0;
  for(var i = 0; i < gridSize; i++){
    for(var j = 0; i < gridSize; j++){
      if(tmp === index){
        return vec2(i,j);

      }
      tmp++;
    }
  }
}

function initWorld(){
  world = new Array(gridSize);
    for(var i = 0; i < gridSize; i++){
      world[i] = new Array(gridSize);
      for(var j = 0; j < gridSize; j++){
        world[i][j] = 0;
      }
    }
}
