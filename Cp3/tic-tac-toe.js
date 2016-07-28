"use strict";
var canvas;
var gl;

var grid = [9][9];

var coordinates;

var width, height;

var vBuffer;

window.onload = function init(){
  canvas = document.getElementById( "gl-canvas" );

  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) { alert( "WebGL isn't available" ); }

  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor( 0.8, 0.8, 0.8, 1.0 );
  gl.clear( gl.COLOR_BUFFER_BIT );

  width = canvas.width;
  height = canvas.height;

  var program = initShaders( gl, "vertex-shader", "fragment-shader" );
  gl.useProgram( program );

  vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, sizeof['vec2']*4*9, gl.STATIC_DRAW);
  var vPos = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPos,2,gl.FLOAT,false,0,0);
  gl.enableVertexAttribArray(vPos);
  buildGrid();
  ///////////BEGINNING////////////////////////////////////////////////////////////////////////////
  canvas.addEventListener("mousedown", function(event){
	// indices of the chosen box
	var gridx = Math.floor(event.clientX/(canvas.width/3));
	var gridy = Math.floor(event.clientY/(canvas.height/3));
	console.log(gridx+','+gridy);
	
	// index of the first vertice of the chosen box in an array
	var index = gridy*12 + gridx*4;
	console.log(index);
	
	// location of all the 4 vertices of the chosen box
	var box = square(gridx*(width/3),gridy*(height/3));
	console.log(box);
	
	// switch color (red/green) each click
	red= !red;
    var color = (red ? vec4(1.0, 0.0, 0.0, 1.0): vec4(0.0, 1.0, 0.0, 1.0));
	console.log(color);

	// no clue how to buffer or render that..
	gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
	gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(box));
	
	gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
    gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index), flatten(color));
    gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index+1), flatten(color));
    gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index+2), flatten(color));
    gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index+3), flatten(color));
	
  });
  //////////END/////////////////////////////////////////////////////////////////////////////
  render();
}

function buildGrid(){
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
     var box = square(x*(width/3),y*(height/3));
     gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2']*4*index, flatten(box));
     console.log(index+':'+x+':'+y+' square:'+box.toString());
     index++;
   }
 }
}

function square(x,y){
  return [
    convert(x,y),
    convert(x+width/3,y),
    convert(x+width/3,y+height/3),
    convert(x,y+height/3)
  ];
}
function convert(x,y){
  return vec2(-1+((2*x)/width),-1+(2*(height-y))/height);
}

function render(){
  gl.clear(gl.COLOR_BUFFER_BIT);
  for(var i = 0; i < 9*4; i+=4){
     console.log("printing point at: "+i);
     gl.drawArrays(gl.LINE_LOOP, i, 4);
  }
  window.requestAnimFrame(render);
}
