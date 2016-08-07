var canvas;
var gl;

var boxLength = 1;

var near = 1;
var far = 8;
var radius = 4.0;
var theta = 0.0;
var phi = 0.0;
var dr = 5.0 * Math.PI / 180.0;

var fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var aspect;       // Viewport aspect ratio

var mvMatrix, pMatrix;
var modelView, projection;
var eye = vec3(0.0, 0.0, 5.0);
var at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);
var tmpat = vec3(0.0, 0.0, 0.0);
var rotMat = mat4();
mvMatrix = lookAt(eye, at, up);
var program, program2, vPosition, rVPosition;
var rvBuffer, rcBuffer;

window.onload = function init() {

  canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    alert("WebGL isn't available");
  }

  gl.viewport(0, 0, canvas.width, canvas.height);

  aspect = canvas.width / canvas.height;

  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  gl.enable(gl.DEPTH_TEST);

  //
  //  Load shaders and initialize attribute buffers
  //
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  program2 = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  var p = new Position(0, 0, 0);
  var box = new Box(p);
  addBox(box);
  addBox(new Box(new Position(0, 1, 0)), true);
  //var p = new Position(0,1,0);
  //var box = new Box(p);
  //addBox(box);

  var cBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);

  var vColor = gl.getAttribLocation(program, "vColor");
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vColor);

  var vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

  vPosition = gl.getAttribLocation(program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  modelView = gl.getUniformLocation(program, "modelView");
  projection = gl.getUniformLocation(program, "projection");

// buttons for viewing parameters

  document.getElementById("Button1").onclick = function () {
    near *= 1.1;
    far *= 1.1;
  };
  document.getElementById("Button2").onclick = function () {
    near *= 0.9;
    far *= 0.9;
  };
  document.getElementById("Button3").onclick = function () {
    radius *= 2.0;
  };
  document.getElementById("Button4").onclick = function () {
    radius *= 0.5;
  };
  document.getElementById("Button5").onclick = function () {
    theta += dr;
  };
  document.getElementById("Button6").onclick = function () {
    theta -= dr;
  };
  document.getElementById("Button7").onclick = function () {
    phi += dr;
  };
  document.getElementById("Button8").onclick = function () {
    phi -= dr;
  };

  //Trying to move the eye
  window.addEventListener("keydown", function (event) {
    //im not sure that im handling the movement right, im reading chaptor 4 again
    if (event.keyCode === 37) {
      mvMatrix[0][3] += 0.25;
    } else if (event.keyCode === 39) {
      mvMatrix[0][3] -= 0.25;
    } else if (event.keyCode === 38) {
      mvMatrix[2][3] += 0.25;
    } else if (event.keyCode === 40) {
      mvMatrix[2][3] -= 0.25;
    }
  });

  render();
};

var render = function () {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var rotX = rotate(phi, vec3(1, 0, 0));
  var rotY = rotate(theta, vec3(0, 1, 0));
  rotMat = mult(rotY, rotX);
  mvMatrix = mult(mvMatrix, rotMat);
  pMatrix = perspective(fovy, aspect, near, far);

  gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
  gl.uniformMatrix4fv(projection, false, flatten(pMatrix));

  gl.drawArrays(gl.TRIANGLES, 0, pointsArray.length);

  // gl.uniformMatrix4fv(modelView, false, flatten(mvMatrix));
  // gl.uniformMatrix4fv(projection, false, flatten(pMatrix));

  gl.useProgram(program2);

  rcBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, rcBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(rColorsArray), gl.STATIC_DRAW);

  rvBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, rvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(rPointsArray), gl.STATIC_DRAW);

  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);

  gl.drawArrays(gl.TRIANGLES, 0, rPointsArray.length);

  requestAnimFrame(render);
};
