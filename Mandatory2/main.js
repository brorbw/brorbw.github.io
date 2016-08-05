var canvas;
var gl;



var dr = 60.0 * Math.PI/180.0;

var  fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect;       // Viewport aspect ratio


var modelView, projection;

var vBuffer,cBuffer,vRBuffer,cRBuffer;
var vPosition,vColor,vRPosition,cRColor;

var camera;

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

    cBuffer = gl.createBuffer();

    vColor = gl.getAttribLocation( program, "vColor" );

    vBuffer = gl.createBuffer();

    vPosition = gl.getAttribLocation( program, "vPosition" );

    cRBuffer = gl.createBuffer();

    vRBuffer = gl.createBuffer();



    modelView = gl.getUniformLocation( program, "modelView" );
    projection = gl.getUniformLocation( program, "projection" );

// buttons for viewing parameters
    camera = new Camera();
    document.getElementById("Button1").onclick = function(){near  *= 1.1; far *= 1.1;};
    document.getElementById("Button2").onclick = function(){near *= 0.9; far *= 0.9;};
    document.getElementById("Button3").onclick = function(){radius *= 2.0;};
    document.getElementById("Button4").onclick = function(){radius *= 0.5;};
    document.getElementById("Button5").onclick = function(){camera.lookLeft();};
    document.getElementById("Button6").onclick = function(){camera.lookRight();};
    document.getElementById("Button7").onclick = function(){camera.lookUp();};
    document.getElementById("Button8").onclick = function(){camera.lookDown();};

    //Trying to move the eye
    window.addEventListener("keydown", function(event){
        //im not sure that im handling the movement right, im reading chaptor 4 again
        if(event.keyCode === 37){
            camera.moveLeft();
        } else if (event.keyCode === 39) {
            camera.moveRight()
        } else if (event.keyCode === 38){
            camera.moveForward();
        } else if (event.keyCode === 40){
            camera.moveBackwards();
        }

    });
    buildWorld(2);
    var p1 = new Position(1,0,1);
    var p2 = new Position(0,1,1);
    removeBox(p2);
    render();
}


var render = function(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    pMatrix = perspective(fovy, aspect, near, far);

    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
    gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );

    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.drawArrays( gl.TRIANGLES, 0, pointsArray.length );


    gl.bindBuffer(gl.ARRAY_BUFFER, cRBuffer);
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.bindBuffer(gl.ARRAY_BUFFER, vRBuffer);
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);


    gl.drawArrays(gl.TRIANGLES, 0, spinningArray.length);

    requestAnimFrame(render);
}

function resendBuffers() {
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, vRBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(spinningArray), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, cRBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(spinningNormals), gl.STATIC_DRAW);
}

/*
setTimeout(function(){
    window.location.reload(1);
}, 5000);

*/