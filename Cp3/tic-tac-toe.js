var canvas;
var gl;

var grid = [9][9];

var coordinates;

var vertices = [];

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
  buildGrid();
  render();
}

function buildGrid(){
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  var index = 0;
  var box = square(0*(width/3),0*(height/3));
  gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2']*index, flatten(box));
  // for(var x = 0; x < 3; x++){
  //   for(var y = 0; y < 3; y++){
  //     var box = square(x*(width/3),y*(height/3));
  //     gl.bufferSubData(gl.ARRAY_BUFFER, sizeof['vec2']*index, flatten(box));
  //     index++;
  //   }
  // }
}

function square(x,y){
  return [
    convert(x,y),
    convert(x+width/3,y),
    convert(x,y+height/3),
    convert(x+width/3,y+height/3)
  ];
}
function convert(x,y){
  return vec2(-1+2*x/width,-1+2*(height-y)/height);
}

function render(){
  gl.clear(gl.COLOR_BUFFER_BIT);
  for(var i = 0; i < sizeof['vec2']*4*9; i+=8){
    gl.drawArrays(gl.LINE_LOOP, i, 8);
  }
  //window.requestAnimFrame(render);
}
