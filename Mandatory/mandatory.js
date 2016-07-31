"use strict";

var canvas;
var gl;

var gridSize = 30;
var vBuffer,cBuffer, mBuffer,centerBuffer;;
var vPos;
var vColor;
var cPos;
var width, height;
var typePicked = 0;
var cellStartCoordinates = [];
var typeCurrent;
var border = 9;
var jumping = false;
var jumpingPos;
var up, left, right;
// stickman globals
var smBuffer;
var smBoxW = 50;
var smIndex;
var smCurrPos;
var smMovement = 2;
var smMaxVelocity = 20;
var rightKeyDown, leftKeyDown;

// var mouseHold = false;

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

  initNavKeys();

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

  // stickman events
  // keyboard event listener
  window.addEventListener("keydown", function(event){
    if (event.keyCode === 68) {
      rightKeyDown = true;
      if(!isSolid(collisionRight(pixPosToBoxPos(smCurrPos[0],smCurrPos[1]))))
        moveRight();
    } else if (event.keyCode === 65) {
      leftKeyDown = true;
      if(!isSolid(collisionLeft(pixPosToBoxPos(smCurrPos[0],smCurrPos[1]))))
        moveLeft();
    } else if (event.keyCode === 87) {
      // if (onSolidBlock()) {
      jump();
      // }
    }
  });
  window.addEventListener("keyup", function(event){
    if (event.keyCode === 68 || event.keyCode === 65) {
      initNavKeys();
      // resetVelocity();
    }
  });
  // click event listeners stickman
  left = document.getElementById("ButtonLeft")
  left.addEventListener("click", function(){
    moveLeft();
  });

  up = document.getElementById("ButtonUp")
  up.addEventListener("click", function(){
    jump();
  });

  right = document.getElementById("ButtonRight")
  right.addEventListener("click", function(){
    moveRight();
  });

  ////////////////////////SM----BEGINNING//////////////////////////////////////////////////////////////////////////////////////////////
  smBoxW = width/gridSize*2;
  var yPosMan =  (gridSize%2 === 0) ? height/gridSize*(Math.floor(gridSize/2)-2):(height/gridSize*(Math.floor(gridSize/2)-1));
  var xPosMan =  height/gridSize;
  smCurrPos = vec2(yPosMan,xPosMan);

  // Stick man buffer
  smBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, smBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, sizeof["vec2"]*8*8,gl.DYNAMIC_DRAW);
  // var sm = smVertices(vec2(smCurrPos[0], smCurrPos[1]));
  // gl.bufferSubData(gl.ARRAY_BUFFER,
  //   sizeof["vec2"]*smIndex,
  //   flatten(sm));

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

  // _______ FOR DRAWING
  // canvas.addEventListener("mousedown", function(event){
  //   mouseHold = true;
  // });
  // canvas.addEventListener("mouseup", function(event){
  //   mouseHold = false;
  // });

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
  buildStaticWorld();
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

  // Render stickman
  if (jumping) {
    jump();
  }
  gravity();
  var sm = drawStickMan(vec2(smCurrPos[0], smCurrPos[1]));
  gl.bindBuffer(gl.ARRAY_BUFFER, smBuffer);
  gl.bufferSubData(gl.ARRAY_BUFFER,
    sizeof["vec2"]*smIndex,
    flatten(sm));
  gl.vertexAttribPointer( vPos, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray(vPos);

  gl.drawArrays(gl.LINES, smIndex, smIndex);

  window.requestAnimFrame(render,canvas);
}

function isSolid(boxType) {
  switch (boxType) {
    case 0: return false; break;
    case 2: return false; break;
    case 3: return false; break;
    default: return true; break;
  }
}

function gravity() {
  var vMove = 5;
  if (!onSolidBlock() && !jumping) {
    var boxPosMan =  pixPosToBoxPos(smCurrPos[0]+vMove, smCurrPos[1]);
    if(isSolid(collisionDown(vec2(boxPosMan[0],boxPosMan[1])))){
      var ground = boxPosMan[0]*width/gridSize;
      console.log(ground, smCurrPos[0]);
    //if (smCurrPos[0] + vMove > ground) {
      vMove = ground - smCurrPos[0];
    }else if(collisionDown(vec2(boxPosMan[0],boxPosMan[1]))===3){

      jump();
      return;
    }

    smCurrPos[0] += vMove;
    // if (rightKeyDown) {
    //   smCurrPos[1] += smMovement;
    // } else if (leftKeyDown) {
    //   smCurrPos[1] -= smMovement;
    // }
  }
}

function maxJumpHeight() {
  return jumpingPos - smBoxW*2;
}

function jump() {
  // if max height not reached...
  if (!jumping) {
    jumpingPos = smCurrPos[0];
  }
  //console.log(maxJumpHeight());
//  console.log(jumpingPos);
  var boxPosMan =  pixPosToBoxPos(smCurrPos[0] + 5, smCurrPos[1]);
  console.log(!isSolid(collisionUp(vec2(boxPosMan[0],boxPosMan[1]))));
  if (smCurrPos[0] > maxJumpHeight() && !isSolid(collisionUp((vec2(boxPosMan[0],boxPosMan[1]))))) {
    jumping = true;
    smCurrPos[0] -= 5;
    console.log(smCurrPos[0]);
    if (rightKeyDown) {
      smCurrPos[1] += 5;
    } else if (leftKeyDown) {
      smCurrPos[1] -= 5;
    }
    // smCreateBuffer();
    // render();
    // requestAnimFrame(jump);
  } else {
    jumping = false;
  }
}

// stickman stuff

function initNavKeys() {
  rightKeyDown = false;
  leftKeyDown = false;
}

function drawStickMan(locVec2) {
  var x = locVec2[1];
  var y = locVec2[0];
  var smArray =  [
    convert(x, y),
    convert(x, y + smBoxW/2),
    convert(x - (smBoxW/2), y + (smBoxW*0.25)),
    convert(x + (smBoxW/2), y + (smBoxW*0.25)),
    convert(x, y + smBoxW /2),
    convert(x - (smBoxW*0.25), y + smBoxW),
    convert(x, y + smBoxW /2),
    convert(x + (smBoxW*0.25), y + smBoxW)
  ];
  smIndex = smArray.length;
  return smArray;
}

function moveRight() {
  if (smMovement < smMaxVelocity) {
    smMovement += 1;
  }
  smCurrPos[1] += smMovement;
}

function moveLeft() {
  if (smMovement < smMaxVelocity) {
    // Need collision detection here
    smMovement += 1;
    // Need to check if still on solid ground
  }
  smCurrPos[1] -= smMovement;
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
  var newBoxToDraw;
  var worldCoordinates = indexToXYIn2DArray(startCoordinates);
  typeCurrent = world[worldCoordinates[0]][worldCoordinates[1]];
  var gridpos = pixPosToBoxPos(newX,newY);
  if(allowedToBuild(gridpos)){
      newBoxToDraw = drawSquare(newX,newY);
      console.log()
  } else {
     newBoxToDraw = drawSquare(-width/gridSize,-width/gridSize);
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, mBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(newBoxToDraw), gl.STATIC_DRAW);
  //render();

  // _______ FOR DRAWING
  // if(mouseHold){
  //   addBox(startCoordinates,typePicked);
  //   if(allowedToBuild(worldCoordinates)){
  //   }
  // }
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
    clickCenter = convert(newY+width/gridSize/2,newX+width/gridSize/2);
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
    if(i > gridSize*gridSize-gridSize*Math.floor(gridSize/3)-1){
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

function onSolidBlock() {
  var boxPosMan =  pixPosToBoxPos(smCurrPos[0], smCurrPos[1]);
  var blockType = collisionDown(vec2(boxPosMan[0]+1,boxPosMan[1]));
  // console.log((blockType));
  return isSolid(blockType);
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
			case 5 : return allowedToBuildLeafs(gridpos); break;
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
	// only allowed if currentBox is clear AND not top of air, water, man AND there is no water next to it
	if(typeCurrent===0)
		if(collisionDown(gridpos)!=0 && collisionDown(gridpos)!=2 && collisionDown(gridpos)!=8)
			if(collisionLeft(gridpos)!=2&& collisionRight(gridpos)!=2)
				return true;
}


function allowedToBuildDirt(gridpos){
	// only allowed if currentBox is clear AND not on top of fire and water, man and in air if there is wood or dirt
	if((typeCurrent===0) && (collisionDown(gridpos)!=2 || collisionDown(gridpos)!=3 || collisionDown(gridpos)!=8)){
		if(collisionDown(gridpos)===0){
			if(collisionLeft(gridpos)===4 || collisionLeft(gridpos)===6 || collisionRight(gridpos)===4 || collisionRight(gridpos)===6) {
				return true;
			}else{
				return false;
			}
		}else{
			return true;
		}
	}
}

function allowedToBuildLeafs(gridpos){
	// only allowed if currentBox is clear AND not top of fire, water, man
	if(typeCurrent===0 && collisionDown(gridpos)!=2 && collisionDown(gridpos)!=3 && collisionDown(gridpos)!=8){
			// if building on top of air check if there is wood or leaf next to
			if(collisionDown(gridpos)===0){
				if(collisionLeft(gridpos)===5 || collisionLeft(gridpos)===6 || collisionRight(gridpos)===5 || collisionRight(gridpos)===6) {
					return true;
				}else{
					return false;
				}
			}else{
				return true;
			}
	}
}


function allowedToBuildDeath(gridpos){
	// only allowed if currentBox is clear AND on top of border, dirt, death AND inbetween border, dirt, death
	if((typeCurrent===0) && (collisionDown(gridpos)===border || collisionDown(gridpos)===4 || collisionDown(gridpos)===5 ))
		if(collisionLeft(gridpos)===border || collisionLeft(gridpos)===4 || collisionLeft(gridpos)===5)
			if(collisionRight(gridpos)===border || collisionRight(gridpos)===4 || collisionRight(gridpos)===4)
				return true;
}

function prittyPrintWorld(){
  var string = "";
  string +="[";
  for(var i = 0; i < gridSize; i++){
    string +="[";
    for(var j = 0; j < gridSize; j++){
      if (j == gridSize-1) {
        string += world[i][j];
      } else {
        string += world[i][j] + ",";
      }
    }
    string +="],";
  }
  string +="]";
  console.log(string);
}

function buildStaticWorld(){
  var index = 0;
  for (var i = 0; i < gridSize; i++){
    for (var j = 0; j < gridSize; j++){
      addBox(index,staticWorld[i][j]);
      index++;
    }
  }
}

var staticWorld = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,5,5,5,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,5,6,5,5,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,5,6,5,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,6,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,3,3,3,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,3,3,1,1,2,2,2,2,2],
  [4,4,4,3,3,3,4,4,4,4,4,4,4,2,2,4,4,4,4,4,4,3,3,4,4,2,2,2,2,2],
  [4,4,4,3,3,3,4,4,4,4,4,4,4,2,2,4,4,4,4,4,4,3,3,4,4,2,2,2,2,2],
  [4,4,4,4,3,4,4,4,4,4,4,4,4,2,2,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2],
  [4,4,4,4,3,4,4,4,4,4,4,4,4,2,2,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2],
  [4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2],
  [4,4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,4,4,4,4,4,4,4,4,4,2,2,2,2,2],
  [4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2,4,4,4,4,4,4,4,4,2,2,2,2,2],
  [4,4,4,4,4,4,4,4,4,2,2,2,2,2,2,2,2,4,4,4,4,4,4,4,4,2,2,2,2,2],
  [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,2,2,2,2,2]
];
