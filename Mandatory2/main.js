var canvas;
var gl;

var modelView, projection;

var vBuffer,cBuffer,vRBuffer,cRBuffer, centerSpinningBuffer ,centerBuffer;
var vPosition,vColor,vRotation, vCenter;
var sunPivot,vSun,cSun;
var vEye;
var rotationMat;
var sunMat;
var sunRotation;
var angle = 0;
var init = true;
var camera;
var jump = false;
var jumpTime = 0;
var sunAngle = 0;

var program

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    canvas.style.cursor= "none";

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    aspect =  canvas.width/canvas.height;
    pMatrix = perspective(fovy, aspect, near, far)

    gl.clearColor( 0.3, 0.3, 0.3, 1.0 );

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);


    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    cBuffer = gl.createBuffer();

    vColor = gl.getAttribLocation( program, "vColor" );

    vBuffer = gl.createBuffer();

    vPosition = gl.getAttribLocation( program, "vPosition" );

    centerBuffer = gl.createBuffer();

    centerSpinningBuffer = gl.createBuffer();

    vCenter = gl.getAttribLocation(program, "vCenter");

    cRBuffer = gl.createBuffer();

    vRBuffer = gl.createBuffer();

    sunPivot = gl.createBuffer();
    vSun = gl.createBuffer();
    cSun = gl.createBuffer();

    vEye = gl.getUniformLocation(program, "eyePosition");
    vRotation = gl.getUniformLocation(program, "vRotation");
    sunRotation = gl.getUniformLocation(program, "sunRotation");
    modelView = gl.getUniformLocation( program, "modelView" );
    projection = gl.getUniformLocation( program, "projection" );

// buttons for viewing parameters
    camera = new Camera();
    document.getElementById("Button1").onclick = function(){camera.perspec()};
    document.getElementById("Button2").onclick = function(){camera.ortho()};
    document.getElementById("Button3").onclick = function(){toggleFlying()};
    document.getElementById("Button4").onclick = function(){radius *= 0.5;};
    document.getElementById("Button5").onclick = function(){camera.lookLeft();};
    document.getElementById("Button6").onclick = function(){camera.lookRight();};
    document.getElementById("Button7").onclick = function(){camera.lookUp();};
    document.getElementById("Button8").onclick = function(){camera.lookDown();};

    //Trying to move the eye
    window.addEventListener("keydown", function(event){
        //im not sure that im handling the movement right, im reading chaptor 4 again
        if(event.keyCode === 65){
            camera.moveLeft();
        } else if (event.keyCode === 68) {
            console.log("right");
            camera.moveRight();
        } else if (event.keyCode === 87){//w
            camera.moveForward();
        } else if (event.keyCode === 83){//s
            camera.moveBackwards();
        } else if (event.keyCode === 37) {
            camera.lookLeft();
        } else if (event.keyCode === 39) {
            camera.lookRight();
        } else if (event.keyCode === 38){
            camera.lookDown();
        } else if (event.keyCode === 40){
            camera.lookUp();
        } else if (event.keyCode === 32){
            if(collisionDown()) {
                jump = true;
            }
        }

    });

    canvas.addEventListener("mouseout", function(){firstMouseMove=true;});
    canvas.addEventListener("mousemove", mousemove);
    buildMountainsSmall();
    buildSun();
    initMaterial();
    init = false;
    render();
}


var render = function() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    if (!flying) {
        gravity();
    }
    if (jump == true) {
        if (jumpTime <= 20) {
            moveUp();
            jumpTime++;
        } else {
            jump = false;
            jumpTime = 0;
        }
    }
    boxShader();
    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
    gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );
    gl.uniform3fv(vEye,flatten(eye));

    rotationMat = flatten(rotate(0,vec3(0,1,0)));
    gl.uniformMatrix4fv( vRotation, false, flatten(rotationMat));

    gl.bindBuffer(gl.ARRAY_BUFFER, centerBuffer);
    gl.vertexAttribPointer( vCenter, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vCenter);

    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);

    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    gl.drawArrays( gl.TRIANGLES, 0, pointsArray.length );

    //____SPINNING____
    if(spinningArray.length !== 0) {
        rotationMat = flatten(rotate(angle, vec3(0, 1, 0)));
        angle += 0.5;
        gl.uniformMatrix4fv(vRotation, false, flatten(rotationMat));

        gl.bindBuffer(gl.ARRAY_BUFFER, centerSpinningBuffer);
        gl.vertexAttribPointer(vCenter, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vCenter);

        gl.bindBuffer(gl.ARRAY_BUFFER, cRBuffer);
        gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vColor);

        gl.bindBuffer(gl.ARRAY_BUFFER, vRBuffer);
        gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vPosition);

        gl.drawArrays(gl.TRIANGLES, 0, spinningArray.length);
    }

    sunShader();
    sunMat = flatten(rotate(sunAngle,vec3(0,0,1)));
    sunAngle++;
    gl.uniformMatrix4fv( vRotation, false, flatten(sunMat));
    gl.uniformMatrix4fv( sunRotation, false, flatten(sunMat));

    gl.bindBuffer(gl.ARRAY_BUFFER, sunPivot);
    gl.vertexAttribPointer(vCenter, 4,gl.FLOAT, false,0,0);
    gl.enableVertexAttribArray(vCenter);

    gl.bindBuffer(gl.ARRAY_BUFFER, cSun);
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);

    gl.bindBuffer(gl.ARRAY_BUFFER, vSun);
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    gl.drawArrays(gl.TRIANGLES, 0, centerSun.length);

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

    gl.bindBuffer(gl.ARRAY_BUFFER, centerBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(centerArray), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, centerSpinningBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(centerSpinningArray), gl.STATIC_DRAW);
}




/*
setTimeout(function(){
    window.location.reload(1);
}, 5000);

*/
