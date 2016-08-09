function readWireFramePixel(xP, yP) {
    updatePoints();
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var cubesDrawn = 0;
    for (var i = 0; i < m; i++) {

        for (var j=0; j < n; j++) {
            for (var h=0; h<m; h++) {
                var block = world[i][j][h];
                if (block.material != "empty") {
                    for (var k = 0; k < 6; k++) {
                        var x = i * .01;
                        var y = j * .01;
                        var z = h * .01;
                        var w = k * .01;

                        var color = vec4(x, y,z, w);
                        gl.uniform4fv(gl.getUniformLocation(program, "fPickColor"), color);
                        gl.drawArrays(gl.TRIANGLES, 6*cubesDrawn, 6);
                        cubesDrawn++;
                    }
                }
            }
        }
    }
    gl.finish();
    readColor = new Uint8Array(4);
    gl.readPixels(xP, canvas.height-yP, 1,1,gl.RGBA, gl.UNSIGNED_BYTE, readColor);
    readColor = [Math.round(readColor[0] / 2.55),Math.round(readColor[1] / 2.55),Math.round(readColor[2] / 2.55), Math.round(readColor[3] / 2.55)];
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.uniform4fv(gl.getUniformLocation(program, "fPickColor"), flatten(vec4(1,0,0,0)));
}

texturePick = gl.createTexture();
gl.bindTexture( gl.TEXTURE_2D, texturePick );
gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 512, 512, 0,
    gl.RGBA, gl.UNSIGNED_BYTE, null);
gl.generateMipmap(gl.TEXTURE_2D);

renderBuffer = gl.createRenderbuffer();
gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer);
gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, canvas.width, canvas.height);


frameBuffer = gl.createFramebuffer();
gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texturePick, 0);
gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, renderBuffer);

gl.bindTexture(gl.TEXTURE_2D, null);
gl.bindRenderbuffer(gl.RENDERBUFFER, null);
gl.bindFramebuffer(gl.FRAMEBUFFER, null);