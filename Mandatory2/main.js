/**
 * Created by brorbw on 03/08/16.
 */

var vBuffer,cBuffer;
var vPos,vColor;


window.onload = function init(){
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl){alert("WebGL isn't available");}

    width = canvas.width;
    height = canvas.height;
    gl.viewport(0,0,width,height);
    gl.clearColor(0.6,0.8,1,1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    var program = initShaders(gl, "vertex-shader","fragment-shader");
    gl.useProgram(program);

    //vertix buffer
    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sizeOfTheArray(), gl.STATIC_DRAW);
    vPos = gl.getAttribLocation(program, "vPosition");

    cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, sizeOfTheArray(), gl.STATIC_DRAW);
    vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);

    buildCube(vec3(0,0,0),1);
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points),gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colors),gl.STATIC_DRAW);

    render();
}


function render(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    requestAnimFrame(render);
}