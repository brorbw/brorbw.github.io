/**
 * Created by phili_000 on 05/08/2016.
 */

function collisionForward() {
  var eyePrime = getPosOfBlockInFront();
  if (inWorld(eyePrime[0], eyePrime[1], eyePrime[2])) {
    var p = posToCenter(eyePrime[0], eyePrime[1], eyePrime[2]);
    return getCube(p) !== undefined && getCube(p) !== 0;
  }
  return true;
}

function getPosOfBlockInFront() {
  var atVec = subtract(at, eye);
  var xzAxis = cross(atVec, up);
  var direction = cross(up, xzAxis);
  direction = normalize(direction);
  return add(eye, mult(direction, vec3(0.3, 0.3, 0.3)));
}

function collisionBack() {
  var atVec = subtract(eye, at);
  var xzAxis = cross(atVec, up);
  var direction = cross(up, xzAxis);
  direction = normalize(direction);
  var eyePrime = add(eye, mult(direction, vec3(.8, .8, .8)));
  if (inWorld(eyePrime[0], eyePrime[1], eyePrime[2])) {
    var p = posToCenter(eyePrime[0], eyePrime[1], eyePrime[2]);
    return getCube(p) !== undefined && getCube(p) !== 0;
  }
  return true;
}

function collisionLeft() {
  var z = subtract(eye,at);
  var y = cross(z,up);
  var direction = normalize(y);
  var eyePrime = add(eye,mult(direction,vec3(0.3,0.3,0.3)));
  if (inWorld(eyePrime[0], eyePrime[1], eyePrime[2])) {
    var p = posToCenter(eyePrime[0], eyePrime[1], eyePrime[2]);
    return getCube(p) !== undefined && getCube(p) !== 0;
  }
  return true;
}

function collisionRight() {
  var z = subtract(at, eye);
  var y = cross(z, up);
  var direction = normalize(y);
  var eyePrime = add(eye, mult(direction, vec3(0.8, 0.8, 0.8)));
  if (inWorld(eyePrime[0], eyePrime[1], eyePrime[2])) {
    var p = posToCenter(eyePrime[0], eyePrime[1], eyePrime[2]);
    return getCube(p) !== undefined && getCube(p) !== 0;
  }
  return true;
}

function collisionUp(pos) {
  pos = pos || false;
  var direction, eyePrime, p;
  // should be checking if pos is a vec3 here but.... lazy..
  if (pos) {
    direction = up;
    direction = normalize(direction);
    eyePrime = add(pos,mult(direction,vec3(0.8,0.8,0.8)));
    if (inWorld(eyePrime[0], eyePrime[1], eyePrime[2])) {
      p = posToCenter(eyePrime[0], eyePrime[1], eyePrime[2]);
      return getCube(p) !== undefined && getCube(p) !== 0;
    }
  } else {
    direction = up;
    direction = normalize(direction);
    eyePrime = add(eye,mult(direction,vec3(0.8,0.8,0.8)));
    if (inWorld(eyePrime[0], eyePrime[1], eyePrime[2])) {
      p = posToCenter(eyePrime[0], eyePrime[1], eyePrime[2]);
      return getCube(p) !== undefined && getCube(p) !== 0;
    }
  }
  return true; // outside the world, so return a collision
}

function collisionDown() {
  var direction = up;
  direction = negate(normalize(direction));
  var eyePrime = add(eye, mult(direction, vec3(0.3, 0.3, 0.3)));
  if (inWorld(eyePrime[0], eyePrime[1], eyePrime[2])) {
    var p = posToCenter(eyePrime[0], eyePrime[1], eyePrime[2]);
    return getCube(p) !== undefined && getCube(p) !== 0;
  }
  return true;
}

function posToCenter(x,y,z){
  var xCenter = ( x%1 < 0.5) ? Math.floor(x):Math.ceil(x);
  var yCenter = ( y%1 < 0.5) ? Math.floor(y):Math.ceil(y);
  var zCenter = ( z%1 < 0.5) ? Math.floor(z):Math.ceil(z);
  return new Position(xCenter, yCenter, zCenter);
}

function gravity() {
  moveDown();
}

function inWorld(x,y,z){
  return (!(x < 0 || y < 0 || z < 0 || x > gridSize || y > gridSize || z > gridSize));
}
