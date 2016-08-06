var near = 0.1;
var far = 100;
var radius = 4.0;
var dr = 60.0 * Math.PI/180.0;

var  fovy = 45.0;
var  aspect;

var eye = vec3(0.0,0,5);
var at = vec3(0,0.0,0);
const up = vec3(0.0, 1.0, 0.0);
var pMatrix;
var mvMatrix = lookAt(eye, at , up);
var rotX = rotate(0.0,vec3(1,0,0));
var rotY = rotate(0.0,vec3(0,1,0));
var rotMat = mult(rotY,rotX);
mvMatrix = mult(lookAt(eye, at , up),rotMat);

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
    rotX = rotate(dr,vec3(1,0,0));
    // vector from eye to at
    var atVec = vec4(subtract(at,eye),0);
    // rotated at
    var atNew  = __matrixVector(rotX,atVec);
    at = add(eye,vec3(atNew[0],atNew[1],atNew[2]));
    mvMatrix=lookAt(eye,at,up);
}

function lookDown(){
    rotX = rotate(-dr,vec3(1,0,0));
    // vector from eye to at
    var atVec = vec4(subtract(at,eye),0);
    // rotated at
    var atNew  = __matrixVector(rotX,atVec);
    at = add(eye,vec3(atNew[0],atNew[1],atNew[2]));
    mvMatrix=lookAt(eye,at,up);
}

function lookLeft(){
    rotY = rotate(dr,vec3(0,1,0));
    // vector from eye to at
    var atVec = vec4(subtract(at,eye),0);
    // rotated at
    var atNew  = __matrixVector(rotY,atVec);
    at = add(eye,vec3(atNew[0],atNew[1],atNew[2]));
    mvMatrix=lookAt(eye,at,up);
}

function lookRight(){
    rotY = rotate(-dr,vec3(0,1,0));
    // vector from eye to at
    var atVec = vec4(subtract(at,eye),0);
    // rotated at
    var atNew  = __matrixVector(rotY,atVec);
    at = add(eye,vec3(atNew[0],atNew[1],atNew[2]));
    mvMatrix=lookAt(eye,at,up);
}

function moveForward(){
    eye[2] -= 0.25;
    at[2] -= 0.25;
    mvMatrix = lookAt(eye,at,up);
}

function moveBackwards(){
    eye[2] += 0.25;
    at[2] += 0.25;
    mvMatrix = lookAt(eye,at,up);
}

function moveLeft(){
    eye[0] -= 0.25;
    at[0] -= 0.25;
    mvMatrix = lookAt(eye,at,up);
}

function moveRight(){
    eye[0] += 0.25;
    at[0] += 0.25;
    mvMatrix = lookAt(eye,at,up);
}

function __matrixVector(m,v){
    //only squared Matrix allowed
    //not proofed for matrix vector dim
    var result = vec4(0,0,0,0);
    for (i=0;i<m.length; i++){
        sum = 0;
        for (j=0;j<m.length;j++){
            sum += m[i][j]*v[j]
        }
        result[i] = sum;
    }
    return result;
}