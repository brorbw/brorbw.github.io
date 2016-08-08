function allowedToRemove(){
  for (i=1;i<5;i++){
    var pos = getPosOfBlockInFrontForward(i);
    var centerFront = posToCenter(pos[0],pos[1],pos[2]);
    var cubeInFront = getCube(centerFront);
    if (cubeInFront !== undefined && cubeInFront !== 0){
       console.log('allowed to remove cube');
     }
   }
}

function allowedToBuild(){
  for (i=2;i<5;i++){
    var pos = getPosOfBlockInFrontForward(i);
    var centerFront = posToCenter(pos[0],pos[1],pos[2]);
    var cubeInFront = getCube(centerFront);
    // cubeInFront at least at the distance 2
    if (cubeInFront !== undefined && cubeInFront !== 0){
      var centerNew = getPosOfBlockInFrontForward(i-1);
      console.log('allowed to build '+ centerNew);
    } else{
      console.log('not allowed to build');
    }
  }
}

function getPosOfBlockInFrontForward(i) {
  var atVec = subtract(at, eye);
  var xzAxis = cross(atVec, up);
  var direction = cross(up, xzAxis);
  direction = normalize(direction);
  return add(eye, mult(direction, vec3(i+0.3, i+0.3, i+0.3)));
}
