var build = false;
var framePoints=[];

function allowedToRemove(){
  for (i=1;i<5;i++){
    var pos = getPosOfBlocksInFront(i);
    var centerFront = posToCenter(pos[0],pos[1],pos[2]);
    var cubeInFront = getCube(centerFront);
    if (cubeInFront !== undefined && cubeInFront !== 0){
       console.log('allowed to remove cube');
       world[centerFront.z*gridSize*gridSize+centerFront.y*gridSize+centerFront.x] = 0;
       emptyArrays();
       drawWorld();
       resendBuffers();
       return;
    }
  }
}

function allowedToBuild(){
  for (i=2;i<5;i++){
    var pos = getPosOfBlocksInFront(i);
    var centerFront = posToCenter(pos[0],pos[1],pos[2]);
    var cubeInFront = getCube(centerFront);
    // cubeInFront at least at the distance 2
    if (cubeInFront !== undefined && cubeInFront !== 0){
      for(j=0;j<11;j++){
        var posNew = getPosOfBlocksInFront(i-0.1*j);
        var centerNew = posToCenter(posNew[0],posNew[1],posNew[2]);
        if(centerNew.x!==centerFront.x || centerNew.y!==centerFront.y ||centerNew.z!==centerFront.z){
          if(build){
            console.log('build'+centerNew.x+', '+centerNew.y+', '+centerNew.z);
            var pos = new Position(centerNew.x,centerNew.y,centerNew.z);
            var box = new Box(pos);
            addBox(box);
            drawWorld();
            resendBuffers();
            build = false;
            break;
          }
          drawWireFrame(centerNew.x,centerNew.y,centerNew.z,1);
          break;
        }
      }
    } else{
      //console.log('not allowed to build');
    }
  }
}


function drawWireFrame(x,y,z, boxLength){

      framePoints=[];
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
      framePoints.push(verts[2]);
      framePoints.push(verts[3]);

      framePoints.push(verts[2]);
      framePoints.push(verts[1]);
      framePoints.push(verts[5]);
      framePoints.push(verts[6]);

      framePoints.push(verts[2]);
      framePoints.push(verts[3]);
      framePoints.push(verts[7]);
      framePoints.push(verts[6]);

      framePoints.push(verts[5]);
      framePoints.push(verts[1]);
      framePoints.push(verts[0]);
      framePoints.push(verts[4]);

      framePoints.push(verts[4]);
      framePoints.push(verts[0]);
      framePoints.push(verts[3]);
      framePoints.push(verts[7]);

      framePoints.push(verts[5]);
      framePoints.push(verts[6]);
      framePoints.push(verts[7]);
      framePoints.push(verts[4]);
// console.log('should dra'+x+', '+y+', '+z);


      gl.bindBuffer( gl.ARRAY_BUFFER, vDBuffer );
      gl.bufferData(gl.ARRAY_BUFFER, flatten(framePoints), gl.STATIC_DRAW);
      gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
      gl.enableVertexAttribArray( vPosition );
      for(var i = 0; i < framePoints.length; i+=4){
        gl.drawArrays( gl.LINE_LOOP, i, 4);
      }
}


function getPosOfBlocksInFront(i) {
  var atVec = subtract(at, eye);
  direction  =normalize(atVec);
  return add(eye, mult(direction, vec3(i+0.3, i+0.3, i+0.3)));
}


function onClick(){

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    //gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);


    gl.uniform1f(gl.getUniformLocation(program, "bufferOrNot"), 1);
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferBuffer);
    gl.vertexAttribPointer( bufferColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( bufferColor );

    gl.drawArrays(gl.TRIANGLES,0,frameColors.length);

    //this is where the off screen render should go
    gl.disableVertexAttribArray(bufferColor);
    gl.uniform1f(gl.getUniformLocation(program, "bufferOrNot"), 0);
    //gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);


    var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    console.log(status +":"+ gl.FRAMEBUFFER_COMPLETE);






}
function initFramebuffer(){
    var texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 512, 512, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.generateMipmap(gl.TEXTURE_2D);

    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    //gl.bindRenderbuffer(gl.RENDERBUFFER, renderbuffer);
    //gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT16, canvas.width, canvas.height);

    var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    console.log(status +":"+ gl.FRAMEBUFFER_COMPLETE);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    //gl.bindRenderbuffer(gl.RENDERBUFFER, null);

}