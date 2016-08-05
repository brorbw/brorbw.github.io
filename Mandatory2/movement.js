var near = 0.1;
var far = 100;
var radius = 4.0;
var eye = vec3(0.0,0,12);
var at = vec3(0,0.0,0);
const up = vec3(0.0, 1.0, 0.0);
var pMatrix;
var mvMatrix = lookAt(eye, at , up);

function Camera() {
    this.lookLeft = lookLeft,
    this.lookRight = lookRight,
    this.lookUp = lookUp,
    this.lookDown = lookDown,
    this.moveForward = moveForward,
    this.moveBackwards = moveBackwards,
    this.moveLeft = moveLeft,
    this.moveRight = moveRight
}

function lookUp(){
    //do stuff that looks up
}

function lookDown(){
    //do stuff that looks down
}

function lookLeft(){
    //do stuff that looks left
}

function lookRight(){
    //do stuff that looks right
}

function moveForward(){
    mvMatrix[2][3] += 0.25;
}

function moveBackwards(){
    mvMatrix[2][3] -= 0.25;
}

function moveLeft(){
    mvMatrix[0][3] += 0.25;
}

function moveRight(){
    mvMatrix[0][3] -= 0.25;
}