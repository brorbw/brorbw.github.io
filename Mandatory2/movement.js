var near = 0.1;
var far = 100;
var radius = 4.0;
var dr = 60.0 * Math.PI/180.0;

var  fovy = 45.0;
var  aspect;

// var eye = vec3(0.0,0,5);
// var at = vec3(0,0.0,0);

var eye = vec3(gridSize/2,2,gridSize/2 + 1);
var at = vec3(gridSize/2,2,gridSize/2);

const up = vec3(0.0, 3.0, 0.0);
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
    this.moveRight = moveRight,
    this.moveDown = moveDown,
    this.moveUp = moveUp,
    this.perspec = perspec,
    this.ortho = orthogonal
}

function lookUp(){
    var z = subtract(eye,at);
    var y = cross(z,up);
    rotX = rotate(dr,y);
    // vector from eye to at
    var atVec = vec4(subtract(at,eye),0);
    // rotated at
    var atNew  = __matrixVector(rotX,atVec);
    at = add(eye,vec3(atNew[0],atNew[1],atNew[2]));
    mvMatrix=lookAt(eye,at,up);
}

function lookDown(){
    var z = subtract(eye,at);
    var y = cross(z,up);
    rotX = rotate(-dr,y);
    var atVec = vec4(subtract(at,eye),0);
    var atNew  = __matrixVector(rotX,atVec);
    at = add(eye,vec3(atNew[0],atNew[1],atNew[2]));
    mvMatrix=lookAt(eye,at,up);
}

function lookLeft(){
    rotY = rotate(dr,vec3(0,1,0));
    var atVec = vec4(subtract(at,eye),0);
    var atNew  = __matrixVector(rotY,atVec);
    at = add(eye,vec3(atNew[0],atNew[1],atNew[2]));
    mvMatrix=lookAt(eye,at,up);
}

function lookRight(){
    rotY = rotate(-dr,vec3(0,1,0));
    var atVec = vec4(subtract(at,eye),0);
    var atNew  = __matrixVector(rotY,atVec);
    at = add(eye,vec3(atNew[0],atNew[1],atNew[2]));
    mvMatrix=lookAt(eye,at,up);
}

function moveForward(){
  if (!collisionForward()) {
    var atVec = subtract(at, eye);
    var xzAxis = cross(atVec, up);
    var direction = cross(up, xzAxis);
    direction = normalize(direction);
    eye = add(eye, mult(direction, vec3(0.25, 0.25, 0.25)));
    at = add(at, mult(direction, vec3(0.25, 0.25, 0.25)));
    mvMatrix = lookAt(eye, at, up);
  } else {
    // Check if there is a block above the block in front.
    // if not, move up to the center of that block.
    // no animation yet.
    var eyePrime = getPosOfBlockInFront();
    moveUp(eyePrime);
  }
}

function moveBackwards(){
  if (!collisionBack()) {
    var atVec = subtract(eye, at);
    var xzAxis = cross(atVec, up);
    var direction = cross(up, xzAxis);
    direction = normalize(direction);
    eye = add(eye, mult(direction, vec3(0.25, 0.25, 0.25)));
    at = add(at, mult(direction, vec3(0.25, 0.25, 0.25)));
    mvMatrix = lookAt(eye, at, up);
  }
}

function moveLeft(){
  if (!collisionLeft()) {
    var z = subtract(eye, at);
    var y = cross(z, up);
    var direction = normalize(y);
    eye = add(eye, mult(direction, vec3(0.25, 0.25, 0.25)));
    at = add(at, mult(direction, vec3(0.25, 0.25, 0.25)));
    mvMatrix = lookAt(eye, at, up);
  }
}

function moveRight(){
  if (!collisionRight()) {
    var z = subtract(at, eye);
    var y = cross(z, up);
    var direction = normalize(y);
    eye = add(eye, mult(direction, vec3(0.25, 0.25, 0.25)));
    at = add(at, mult(direction, vec3(0.25, 0.25, 0.25)));
    mvMatrix = lookAt(eye, at, up);
  }
}

function moveUp(pos){
  if (!collisionUp(pos)) {
    var eyePrime = pos || eye;
    var direction = up;
    direction = normalize(direction);
    eye = add(eyePrime, mult(direction, vec3(0.25, 0.25, 0.25)));
    at = add(at, mult(direction, vec3(0.25, 0.25, 0.25)));
    mvMatrix = lookAt(eye, at, up);
  } else {
    console.log("collision up");
  }
}

function moveDown() {
  if (!collisionDown()) {
    var direction = up;
    direction = negate(normalize(direction));
    eye = add(eye, mult(direction, vec3(0.25, 0.25, 0.25)));
    at = add(at, mult(direction, vec3(0.25, 0.25, 0.25)));
    mvMatrix = lookAt(eye, at, up);
  }
}

function orthogonal(){
    var halfGridSize = gridSize/2
    mvMatrix = lookAt(vec3(halfGridSize,10, halfGridSize), vec3(halfGridSize,0, halfGridSize), vec3(0,0,10))
    pMatrix = ortho(-gridSize,gridSize,-gridSize,gridSize,near,far);
}
function perspec(){
    mvMatrix= lookAt(eye,at,up);
    pMatrix = perspective(fovy, aspect, near, far);

}

function __matrixVector(m,v){
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
