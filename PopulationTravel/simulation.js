/**
 * Created by brorbw on 10/12/16.
 */

var canvas;
var gl;

//buffers
var vBuffer;
//attributes
var vPos;

var width, height;

var program;

var vertices = [
    vec2(0,0)
];

var r = 0.5;

var points = [];

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

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(!gl){alert("WebGL isn't available");}
    width = canvas.width;
    height = canvas.height;

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor(0.6,0.8,1,1);

    program = initShaders(gl,"vertex-shader","fragment-shader");
    
    gl.useProgram(program);
    
    vBuffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER,vBuffer);

    circle(vertices[0]);

    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
    console.log(points.length);
    render();
}

function render(){
    gl.clear(gl.COLOR_BUFFER_BIT);


    //vertixbuffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    vPos = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPos,2,gl.FLOAT,false,0,0);
    gl.enableVertexAttribArray(vPos);
    
    gl.drawArrays(gl.TRIANGLE_FAN, 0, points.length);
    
}

function circle(center) {
    points.push(center);
    var max = 20;
    var procentage = 5;
    //product of max and procentage needs to be 100
    for (i = 0; i <= max; i++) {
        var j = i * procentage;
        points.push(vec2(
                r * Math.cos(j * 2 * Math.PI / 100),
                r * Math.sin(j * 2 * Math.PI / 100)
            ));
    }
}

function dotPeople(){
    
}