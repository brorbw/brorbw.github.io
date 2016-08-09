var texturePick;




function initFrameBuffer(){
    gl.bindBuffer(gl.ARRAY_BUFFER, vPosBuf);
    gl.vertexAttribPointer(vPos, 2,gl.FLOAT, false, 0,0);
    gl.enableVertexAttribArray(vPos);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray),gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, cColBuf);
    gl.vertexAttribPointer(cCol, 4,gl.FLOAT, false, 0,0);
    gl.enableVertexAttribArray(cCol);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(frameColors),gl.STATIC_DRAW);

    frameBuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);

    texturePick = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texturePick );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 512, 512, 0,
        gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.generateMipmap(gl.TEXTURE_2D);



    gl.drawArrays(gl.TRIANGLES, 0, frameColors.length);
    renderBuffer = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, canvas.width, canvas.height);

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texturePick, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderBuffer);





    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if(status != gl.FRAMEBUFFER_COMPLETE) alert("Framebuffer not complete");




}

