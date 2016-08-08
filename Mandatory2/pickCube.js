var framePoints=[];
function allowedToRemove(){
  for (i=1;i<5;i++){
    var pos = getPosOfBlockInFrontForward(i);
    var centerFront = posToCenter(pos[0],pos[1],pos[2]);
    var cubeInFront = getCube(centerFront);
    if (cubeInFront !== undefined && cubeInFront !== 0){
       console.log('allowed to remove cube');
       world[centerFront.z*gridSize*gridSize+centerFront.y*gridSize+centerFront.x] = 0;
       emptyArrays();
       drawWorld();
       resendBuffers();
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
      var posNew = getPosOfBlockInFrontForward(i-1);
      var centerNew = posToCenter(posNew[0],posNew[1],posNew[2]);
      drawWireFrame(centerNew.x,centerNew.y,centerNew.z,1);
      break;
    } else{
      //console.log('not allowed to build');
    }
  }
}


function drawWireFrame(x,y,z, boxLength){
      framePoints=[];
      colorsDArray=[];
      //second param is suppose to be the size of the cube so we can make
      //different sized cubes depending of whether we are makeing a spinning og regular cube
      var verts = [  vec4( x - boxLength / 2,  y - boxLength / 2,  z + boxLength / 2),
        vec4( x - boxLength / 2,  y + boxLength / 2,  z + boxLength / 2),
        vec4( x + boxLength / 2,  y + boxLength / 2,  z + boxLength / 2),
        vec4( x + boxLength / 2,  y - boxLength / 2,  z + boxLength / 2),
        vec4( x - boxLength / 2,  y - boxLength / 2,  z - boxLength / 2),
        vec4( x - boxLength / 2,  y + boxLength / 2,  z - boxLength / 2),
        vec4( x + boxLength / 2,  y + boxLength / 2,  z - boxLength / 2),
        vec4( x + boxLength / 2,  y - boxLength / 2,  z - boxLength / 2)
      ]

      framePoints.push(verts[0]);
      framePoints.push(verts[1]);
      framePoints.push(verts[0]);
      framePoints.push(verts[3]);
      framePoints.push(verts[0]);
      framePoints.push(verts[4]);

      framePoints.push(verts[2]);
      framePoints.push(verts[1]);
      framePoints.push(verts[2]);
      framePoints.push(verts[3]);
      framePoints.push(verts[2]);
      framePoints.push(verts[6]);

      framePoints.push(verts[7]);
      framePoints.push(verts[2]);
      framePoints.push(verts[7]);
      framePoints.push(verts[3]);
      framePoints.push(verts[7]);
      framePoints.push(verts[6]);

      framePoints.push(verts[5]);
      framePoints.push(verts[1]);
      framePoints.push(verts[5]);
      framePoints.push(verts[4]);
      framePoints.push(verts[5]);
      framePoints.push(verts[6]);
      for (i=0;i<24;i++){
        colorsDArray.push(vec4(0.0,0.0,0.0,1.0));
      }
 console.log('should dra'+x+', '+y+', '+z);
  gl.bindBuffer(gl.ARRAY_BUFFER, cDBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsDArray), gl.STATIC_DRAW);

      gl.bindBuffer( gl.ARRAY_BUFFER, vDBuffer );
      gl.bufferData(gl.ARRAY_BUFFER, flatten(framePoints), gl.STATIC_DRAW);
      gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
      gl.enableVertexAttribArray( vPosition );

      gl.drawArrays( gl.LINES, 0, framePoints.length );
}




function getPosOfBlockInFrontForward(i) {
  var atVec = subtract(at, eye);
  var xzAxis = cross(atVec, up);
  var direction = cross(up, xzAxis);
  direction = normalize(direction);
  return add(eye, mult(direction, vec3(i+0.3, i+0.3, i+0.3)));
}
