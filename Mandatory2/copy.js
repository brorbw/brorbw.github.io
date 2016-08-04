

var canvas;
var gl;

var NumVertices  = 36;

var pointsArray = [];
var colorsArray = [];

var vertices;
function buildCube(centerPoint, length) {
    vertices = [
        vec4(centerPoint[0] - length / 2, centerPoint[1] - length / 2, centerPoint[2] + length / 2),
        vec4(centerPoint[0] - length / 2, centerPoint[1] + length / 2, centerPoint[2] + length / 2),
        vec4(centerPoint[0] + length / 2, centerPoint[1] + length / 2, centerPoint[2] + length / 2),
        vec4(centerPoint[0] + length / 2, centerPoint[1] - length / 2, centerPoint[2] + length / 2),
        vec4(centerPoint[0] - length / 2, centerPoint[1] - length / 2, centerPoint[2] - length / 2),
        vec4(centerPoint[0] - length / 2, centerPoint[1] + length / 2, centerPoint[2] - length / 2),
        vec4(centerPoint[0] + length / 2, centerPoint[1] + length / 2, centerPoint[2] - length / 2),
        vec4(centerPoint[0] + length / 2, centerPoint[1] - length / 2, centerPoint[2] - length / 2)
    ];
}



var near = 1;
var far = 8;
var radius = 4.0;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var  fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect;       // Viewport aspect ratio

var mvMatrix, pMatrix;
var modelView, projection;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

function quad(a, b, c, d) {

    var x = subtract(vertices[a],vertices[b]);
    var y = subtract(vertices[b],vertices[c]);
    var color = vec4(cross(x,y),1);

    pointsArray.push(vertices[a]);
    colorsArray.push(color);
    pointsArray.push(vertices[b]);
    colorsArray.push(color);
    pointsArray.push(vertices[c]);
    colorsArray.push(color);
    pointsArray.push(vertices[a]);
    colorsArray.push(color);
    pointsArray.push(vertices[c]);
    colorsArray.push(color);
    pointsArray.push(vertices[d]);
    colorsArray.push(color);
}


function colorCube(){
    buildCube(vec3(0.0,0.0,0.0),1);
    //buildCube(vec3(0,1,1),1);

    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    aspect =  canvas.width/canvas.height;

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);


    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    colorCube();

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelView = gl.getUniformLocation( program, "modelView" );
    projection = gl.getUniformLocation( program, "projection" );

// buttons for viewing parameters

    document.getElementById("Button1").onclick = function(){near  *= 1.1; far *= 1.1;};
    document.getElementById("Button2").onclick = function(){near *= 0.9; far *= 0.9;};
    document.getElementById("Button3").onclick = function(){radius *= 2.0;};
    document.getElementById("Button4").onclick = function(){radius *= 0.5;};
    document.getElementById("Button5").onclick = function(){theta += dr;};
    document.getElementById("Button6").onclick = function(){theta -= dr;};
    document.getElementById("Button7").onclick = function(){phi += dr;};
    document.getElementById("Button8").onclick = function(){phi -= dr;};

    render();
}


var render = function(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(radius*Math.sin(theta)*Math.cos(phi),
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));
    mvMatrix = lookAt(eye, at , up);
    pMatrix = perspective(fovy, aspect, near, far);

    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
    gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );

    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
    requestAnimFrame(render);
}