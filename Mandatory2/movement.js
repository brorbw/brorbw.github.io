var near = 0.1;
var far = 100;
var radius = 4.0;
var dr = 60.0 * Math.PI/180.0;

var  fovy = 45.0;
var  aspect;

var flying = false;

var eye = vec3(gridSize/2,20,gridSize/2+5);
var at = vec3(gridSize/2,10,gridSize/2);


const up = vec3(0.0, 1.0, 0.0);
var pMatrix;
var mvMatrix = lookAt(eye, at , up);
var rotX = rotate(0.0,vec3(1,0,0));
var rotY = rotate(0.0,vec3(0,1,0));
var rotMat = mult(rotY,rotX);
mvMatrix = mult(lookAt(eye, at , up),rotMat);

var firstMouseMove = true;
var mouseX, mouseY;
var mouseDir;

function mousemove(event){
  if(firstMouseMove){
      mouseX = event.clientX;
      mouseY = event.clientY;
      firstMouseMove = false;
  }else{
    var deltaX = event.clientX-mouseX;
    var deltaY = event.clientY-mouseY;
    dr = deltaX;
    lookRight();
    dr = deltaY;
    lookUp();
    mouseX = event.clientX;
    mouseY = event.clientY;
  }

}

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

    var atVec = subtract(at,eye);
    if(!flying){
        var xzAxis = cross(atVec,up);
        var direction = cross(up,xzAxis);
    } else {
        var direction = atVec;
    }
    direction = normalize(direction);
    eye = add(eye,mult(direction,vec3(0.25,0.25,0.25)));
    at = add(at,mult(direction,vec3(0.25,0.25,0.25)));
    mvMatrix=lookAt(eye,at,up);
}

function moveBackwards(){
    var atVec = subtract(eye,at);
    if(!flying){
        var xzAxis = cross(atVec,up);
        var direction = cross(up,xzAxis);
    } else {
        var direction = atVec;
    }
    direction = normalize(direction);
    eye = add(eye,mult(direction,vec3(0.25,0.25,0.25)));
    at = add(at,mult(direction,vec3(0.25,0.25,0.25)));
    mvMatrix=lookAt(eye,at,up);
}

function moveLeft(){
    var z = subtract(eye,at);
    var y = cross(z,up);
    var direction = normalize(y);
    eye = add(eye,mult(direction,vec3(0.25,0.25,0.25)));
    at = add(at,mult(direction,vec3(0.25,0.25,0.25)));
    mvMatrix=lookAt(eye,at,up);
}

function moveRight(){
    var z = subtract(at,eye);
    var y = cross(z,up);
    var direction = normalize(y);
    eye = add(eye,mult(direction,vec3(0.25,0.25,0.25)));
    at = add(at,mult(direction,vec3(0.25,0.25,0.25)));
    mvMatrix=lookAt(eye,at,up);
}

function moveUp(){
    var direction = up;
    direction = normalize(direction);
    eye = add(eye,mult(direction,vec3(0.25,0.25,0.25)));
    at = add(at,mult(direction,vec3(0.25,0.25,0.25)));
    mvMatrix=lookAt(eye,at,up);
}

function moveDown() {
    var direction = up;
    direction = negate(normalize(direction));
    eye = add(eye,mult(direction,vec3(0.25,0.25,0.25)));
    at = add(at,mult(direction,vec3(0.25,0.25,0.25)));
    mvMatrix=lookAt(eye,at,up);
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

function toggleFlying(){
    flying = !flying;
    console.log(flying);
}
