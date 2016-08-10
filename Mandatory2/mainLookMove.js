var canvas;
var gl;


var boxLength = 1;

var near = 1;
var far = 8;
var radius = 4.0;
var dr = 60.0 * Math.PI/180.0;

var  fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect;       // Viewport aspect ratio

var mvMatrix, pMatrix;
var tmpM = perspective(fovy, aspect, near, far);
var modelView, projection;
var eye = vec3(0.0,0.0,5.0);
var at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);
var tmpat = vec3(0.0,0.0,0.0);
var rotX = rotate(0.0,vec3(1,0,0)); 
var rotY = rotate(0.0,vec3(0,1,0));
var rotMat = mult(rotY,rotX);
mvMatrix = mult(lookAt(eye, at , up),rotMat);
var ctm = mat4();

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    aspect =  canvas.width/canvas.height;

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);


    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    var p = new Position(0,0,0);
    var box = new Box(p);
    addBox(box);
    //var p = new Position(0,1,0);
    //var box = new Box(p);
    //addBox(box);


    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelView = gl.getUniformLocation( program, "modelView" );
    projection = gl.getUniformLocation( program, "projection" );

// buttons for viewing parameters

    document.getElementById("Button1").onclick = function(){near  *= 1.1; far *= 1.1;};
    document.getElementById("Button2").onclick = function(){near *= 0.9; far *= 0.9;};
	// "the Map"
    document.getElementById("Button3").onclick = function(){
		mvMatrix[1][1] = Math.cos(90* Math.PI/180.0);
		mvMatrix[1][2] = -Math.sin(90* Math.PI/180.0);
		mvMatrix[2][1] = Math.sin(90* Math.PI/180.0);
		mvMatrix[2][2] = Math.cos(90* Math.PI/180.0);
		
		tmpM = ortho(-1.0,1.0,-1.0,1.0,near,far);
	};
	// "the Player"
    document.getElementById("Button4").onclick = function(){		
		mvMatrix[1][1] = 1;
		mvMatrix[1][2] = 0;
		mvMatrix[2][1] = 0;
		mvMatrix[2][2] = 1;
		
		tmpM = perspective(fovy, aspect, near, far);
	};
	// "look left"
    document.getElementById("Button5").onclick = function(){
		rotY = rotate(dr,vec3(0,1,0));
		// vector from eye to at
		var atVec = vec4(subtract(at,eye),0);
		// rotated at
		var atNew  = matrixVector(rotY,atVec);
		at = add(eye,vec3(atNew[0],atNew[1],atNew[2]));
		mvMatrix=lookAt(eye,at,up);
	};
	// "look right" 
    document.getElementById("Button6").onclick = function(){
		rotY = rotate(-dr,vec3(0,1,0));
		// vector from eye to at
		var atVec = vec4(subtract(at,eye),0);
		// rotated at
		var atNew  = matrixVector(rotY,atVec);
		at = add(eye,vec3(atNew[0],atNew[1],atNew[2]));
		mvMatrix=lookAt(eye,at,up);
	};
	//look up
    document.getElementById("Button7").onclick = function(){		
		rotX = rotate(dr,vec3(1,0,0));
		// vector from eye to at
		var atVec = vec4(subtract(at,eye),0);
		// rotated at
		var atNew  = matrixVector(rotX,atVec);
		at = add(eye,vec3(atNew[0],atNew[1],atNew[2]));
		mvMatrix=lookAt(eye,at,up);
	};
	//look down
    document.getElementById("Button8").onclick = function(){
		rotX = rotate(-dr,vec3(1,0,0));
		// vector from eye to at
		var atVec = vec4(subtract(at,eye),0);
		// rotated at
		var atNew  = matrixVector(rotX,atVec);
		at = add(eye,vec3(atNew[0],atNew[1],atNew[2]));
		mvMatrix=lookAt(eye,at,up);
	};

    //Trying to move the eye
    window.addEventListener("keydown", function(event){
        //im not sure that im handling the movement right, im reading chaptor 4 again
        //left arrow
		if(event.keyCode === 37){
			// vector from eye to at
			var atVec = subtract(at,eye);
			var move = cross(atVec,up);
			// moving direction
			move = normalize(move);
			eye = add(eye,mult(move,vec3(-0.25,-0.25,-0.25)));
			at = add(at,mult(move,vec3(-0.25,-0.25,-0.25)));
			mvMatrix = lookAt(eye,at,up);
        //right arrow
		} else if (event.keyCode === 39) {
			// vector from eye to at
			var atVec = subtract(at,eye);
			var move = cross(atVec,up);
			// moving direction
			move = normalize(move);
			eye = add(eye,mult(move,vec3(0.25,0.25,0.25)));
			at = add(at,mult(move,vec3(0.25,0.25,0.25)));
			mvMatrix = lookAt(eye,at,up);
		//up arrow
		} else if (event.keyCode === 38){
			// vector from eye to at
			var atVec = subtract(at,eye);
			var move = atVec;
			// moving direction
			move = normalize(move);
			eye = add(eye,mult(move,vec3(0.25,0.25,0.25)));
			at = add(at,mult(move,vec3(0.25,0.25,0.25)));
			mvMatrix = lookAt(eye,at,up);
        //down arrow
		} else if (event.keyCode === 40){
			// vector from eye to at
			var atVec = subtract(at,eye);
			var move = atVec;
			// moving direction
			move = normalize(move);
			eye = add(eye,mult(move,vec3(-0.25,-0.25,-0.25)));
			at = add(at,mult(move,vec3(-0.25,-0.25,-0.25)));
			mvMatrix = lookAt(eye,at,up);
        }

    })

    render();
}


var render = function(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	pMatrix = tmpM;

    gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
    gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );

    gl.drawArrays( gl.TRIANGLES, 0, pointsArray.length );
    requestAnimFrame(render);
}
function matrixVector(m,v){
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