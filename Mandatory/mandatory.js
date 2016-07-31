"use strict";

var canvas;
var gl;

var gridSize = 25;
var vBuffer,cBuffer, mBuffer,centerBuffer;;
var vPos;
var vColor;
var cPos;
var width, height;
var typePicked = 0;
var cellStartCoordinates = [];
var typeCurrent;
var border = 9;

var radiusLoc;
var radius = 0.1;

var clickCenterLoc;
var clickCenter = [2,2];

var initiating = true;

var map = [];

var world;
var click = false;

var colors = [
    vec4( 0.0, 0.0, 0.0, 1.0), //nothing
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green-gras
    vec4( 0.0, 0.5, 1.0, 1.0 ),  // blue-water
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // fire
    vec4( 0.5, 0.25, 0.0, 1.0 ),  // brown-dirt
    vec4( 0.0, 1.0, 0.5, 1.0 ), // leafs
    vec4( 0.8, 0.5, 0.2, 1.0 ), // wood
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
  //vertix buffer
  vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, sizeOfTheArray(), gl.STATIC_DRAW);
  vPos = gl.getAttribLocation(program, "vPosition");

  //color buffer
  cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, gridSize*gridSize*sizeof['vec4']*4, gl.STATIC_DRAW)
  vColor = gl.getAttribLocation(program, "vColor");
  //mouse buffer
  mBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, mBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, 4*sizeof['vec4'], gl.STATIC_DRAW);

  //buffer for the center of the squares
  centerBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, centerBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, gridSize*gridSize*sizeof['vec2']*4, gl.STATIC_DRAW);
  cPos = gl.getAttribLocation(program, "cPosition");


  //settin up the uniform variables
  //radius
  radiusLoc = gl.getUniformLocation(program, "radius");
  //centerpoint
  clickCenterLoc = gl.getUniformLocation(program, "clickCenter");

  //onclicks
  canvas.addEventListener("click",clickFunction);
  canvas.addEventListener("mousemove", mousemove);
  var menu = document.getElementById("mymenu");
  initWorld();
  menu.addEventListener("click", function(){
    switch(menu.selectedIndex){
      case 0 : typePicked = 0 ; break;//nothing
      case 1 : typePicked = 1 ; break;//dirt
      case 2 : typePicked = 2 ; break;//dirt
      case 3 : typePicked = 3 ; break;//dirt
      case 4 : typePicked = 4 ; break;//dirt
      case 5 : typePicked = 5 ; break;//dirt
      case 6 : typePicked = 6 ; break;//dirt
      case 7 : typePicked = 7; break;//dirt
    }
  });
  //maybe there needs to be made links to the attributes in the vertex-shader

  drawGrid();
  populateBoxes();
  initiating = false;
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

function render(){
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniform1f(radiusLoc, radius);
  gl.uniform2fv(clickCenterLoc, flatten(clickCenter));

  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.vertexAttribPointer(vColor,4,gl.FLOAT,false,0,0);
  gl.enableVertexAttribArray(vColor);

  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.vertexAttribPointer(vPos, 2, gl.FLOAT, false, 0,0);
  gl.enableVertexAttribArray(vPos);

  gl.bindBuffer(gl.ARRAY_BUFFER, centerBuffer);
  gl.vertexAttribPointer(cPos, 2, gl.FLOAT, false,0,0);
  gl.enableVertexAttribArray(cPos);

  if(world != null){
    for(var i = 0; i < gridSize*gridSize; i++){
      var pos = indexToXYIn2DArray(i);
      if(world[pos[0]][pos[1]] != 0){
        gl.drawArrays(gl.TRIANGLE_FAN, i*4, 4);
      }
    }
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, mBuffer);
  gl.vertexAttribPointer(vPos, 2, gl.FLOAT, false, 0,0);
  gl.enableVertexAttribArray(vPos);

  gl.drawArrays(gl.LINE_LOOP, 0,4);
  if(click){
    if(radius >= 2){
      radius = 0.1;

      click = false;
      clickCenter = [2,2];
    } else {
      radius += 0.1;
    }
  }
  window.requestAnimFrame(render,canvas);
}


//event listneres
function clickFunction(event){
  var x = event.clientX;
  var y = event.clientY;
  var startCoordinates = getCellNumberFromXYMouseInput(x,y);
  if(startCoordinates===undefined)
	return;
  var newX = (cellStartCoordinates[startCoordinates])[0];
  var newY = (cellStartCoordinates[startCoordinates])[1];
  var worldCoordinates = indexToXYIn2DArray(startCoordinates);
  typeCurrent = world[worldCoordinates[0]][worldCoordinates[1]];
  if(allowedToBuild(worldCoordinates)){
    addBox(startCoordinates,typePicked);
  }
}

function mousemove(event){
  var x = event.clientX;
  var y = event.clientY;
  var startCoordinates = getCellNumberFromXYMouseInput(x,y);
  if(startCoordinates===undefined)
	return;
  var newX = (cellStartCoordinates[startCoordinates])[0];
  var newY = (cellStartCoordinates[startCoordinates])[1];
  var newBoxToDraw = drawSquare(newX,newY);
  gl.bindBuffer(gl.ARRAY_BUFFER, mBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(newBoxToDraw), gl.STATIC_DRAW);
  //render();
}



//Helper methods

function addBox(startCoordinates,type){
  var worldCoordinates = indexToXYIn2DArray(startCoordinates);
  //this is for sending the square coordinates to the shader
  var x = (cellStartCoordinates[startCoordinates])[0];
  var y = (cellStartCoordinates[startCoordinates])[1];
  world[worldCoordinates[0]][worldCoordinates[1]] = type;
  var newBoxToDraw = drawSquare(x,y);
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2']*4*startCoordinates, flatten(newBoxToDraw));

  //this is for coloring of the 4 vertecies
  var color = vec4(colors[type]);
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec4']*(startCoordinates*4), flatten(color));
  gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec4']*(startCoordinates*4+1), flatten(color));
  gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec4']*(startCoordinates*4+2), flatten(color));
  gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec4']*(startCoordinates*4+3), flatten(color));


  //sending the center position to the shader
  var centerX = mix(newBoxToDraw[0],newBoxToDraw[1],0.5);
  var centerY = mix(newBoxToDraw[0],newBoxToDraw[2],0.5);
  var center = vec2(centerX[0],centerY[1]);
  gl.bindBuffer(gl.ARRAY_BUFFER, centerBuffer);
  gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2']*(startCoordinates*4),flatten(center));
  gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2']*(startCoordinates*4+1),flatten(center));
  gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2']*(startCoordinates*4+2),flatten(center));
  gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2']*(startCoordinates*4+3),flatten(center));
  if(!initiating){
    click = true;
    var newX = (cellStartCoordinates[startCoordinates])[0];
    var newY = (cellStartCoordinates[startCoordinates])[1];
    clickCenter = convert(newY+width/25/2,newX+width/25/2);
  }

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
    for(var j = 0; j < gridSize; j++){
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

function populateBoxes(){
  for(var i = 0; i < gridSize*gridSize; i++){
    if(i > gridSize*gridSize-gridSize*Math.floor(gridSize/2)-1){
		addBox(i,4);
    }
  }
}

function drawSquare(y,x){
  //put the starting coordinate of the square to find it
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

// function canBuild(worldCoordinates){
//   if(initiating){
//     return true;
//   }
//   //  console.log(worldCoordinates);
//   var yCoordinate = worldCoordinates[0]+1;
//   if(yCoordinate > 24){
//     return true;
//   }
//   var boxUnder = world[yCoordinate][worldCoordinates[1]];
//   var returnBool;
//   if(!boxUnder==0){
//     returnBool = true;
//   } else {
//     returnBool = false;
//   }
//   return returnBool;
// }

// ----- For mergeing

function pixPosToBoxPos(posX, posY){
	// converts PixelPosition to BoxIndex
	var gridx = Math.floor(posX/(canvas.width/gridSize));
	var gridy = Math.floor(posY/(canvas.height/gridSize));

	return vec2(gridx,gridy);
}

//Collision detection;

function collisionDown(gridpos){
	// returns type of collision ; border is type 6
	return ((gridpos[0]+1)>=gridSize) ? border : world[gridpos[0]+1][gridpos[1]];
}

function collisionLeft(gridpos){
	// returns type of collision ; border is type 6
	return ((gridpos[1]-1)<0) ? border : world[gridpos[0]][gridpos[1]-1];
}

function collisionRight(gridpos){
	// returns type of collision ; border is type 6
	return ((gridpos[1]+1)>=gridSize) ? border : world[gridpos[0]][gridpos[1]+1];
}

function collisionUp(gridpos){
	// returns type of collision ; border is type 6
	return ((gridpos[0]-1)<0) ? border : world[gridpos[0]-1][gridpos[1]];
}

//bulding

function allowedToBuild(gridpos){
  if(initiating){
    return true;
  }
	if(world[gridpos[0]][gridpos[1]]!= 8){
		switch(typePicked){
			case 0 : return allowedToDelete(gridpos); break;
			case 1 : return allowedToBuildGras(gridpos); break;
			case 2 : return allowedToBuildWater(gridpos); break;
			case 3 : return allowedToBuildFire(gridpos); break;
			case 4 : return allowedToBuildDirt(gridpos); break;
			case 5 : return allowedToBuildDirt(gridpos); break;
      case 6 : return allowedToBuildDirt(gridpos); break;
      case 7 : return allowedToBuildDeath(gridpos); break;
		}
	}else{
		return false;
	}
}

function allowedToDelete(gridpos){
	// only allowed if currentBox is not clear AND but the upper one is clear or top
	if((typeCurrent!=0)){
		return true;
  }
}

function allowedToBuildGras(gridpos){
	// only allowed if currentBox is clear and on top of dirt
	if(typeCurrent===0 && (collisionDown(gridpos)===4))
		return (true);
}

function allowedToBuildWater(gridpos){
	// only allowed if currentBox is clear AND on top of border, water, dirt AND there is something left or rigth of it
	if(typeCurrent===0)
		if(collisionDown(gridpos)===border || collisionDown(gridpos)===2 || collisionDown(gridpos)===4)
			if ( collisionLeft(gridpos)===border || collisionLeft(gridpos)===2 || collisionLeft(gridpos)===4)
				if(collisionRight(gridpos)===border || collisionRight(gridpos)===2 || collisionRight(gridpos)===4)
					return true;
}

function allowedToBuildFire(gridpos){
	// only allowed if currentBox is clear AND on top of border, fire, dirt, death AND there is something like this left or rigth of it
	if(typeCurrent===0)
		if(collisionDown(gridpos)===border || collisionDown(gridpos)===2 || collisionDown(gridpos)===3 || collisionDown(gridpos)===5)
			if((collisionLeft(gridpos)!=0 || collisionLeft(gridpos)!=4)&& (collisionRight(gridpos)!=0 || collisionRight(gridpos)===3))
				return true;
}

function allowedToBuildDirt(gridpos){
	// only allowed if currentBox is clear AND on top of border, dirt, death
	if((typeCurrent===0) && (collisionDown(gridpos)===border || collisionDown(gridpos)===4 || collisionDown(gridpos)===5 ))
		return true;
}

function allowedToBuildDeath(gridpos){
	// only allowed if currentBox is clear AND on top of border, dirt, death AND inbetween border, dirt, death
	if((typeCurrent===0) && (collisionDown(gridpos)===border || collisionDown(gridpos)===4 || collisionDown(gridpos)===5 ))
		if(collisionLeft(gridpos)===border || collisionLeft(gridpos)===4 || collisionLeft(gridpos)===5)
			if(collisionRight(gridpos)===border || collisionRight(gridpos)===4 || collisionRight(gridpos)===4)
				return true;
}
