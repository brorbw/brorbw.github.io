var gl;
var points;

var vPosition, vPosition2;
var bufferId, bufferId2;
var program;

var turtleAngle;
var turtlePos;
var turtlePen;

var vertices = [
    vec2(0,0),
    vec2(1,0),
    vec2(1,-1)
    
];

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    var vertices = [
    vec2(0,0),
    vec2(1,0),
    vec2(1,-1)
    ];
    

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    
    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );    

    render();
};

function buffer(){
    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
}

function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    gl.drawArrays( gl.TRIANGLES, 0, 3);
    
}

function init(x,y,theta){
    turtlePos = vec2(x,y);
    turtleAngle = theta;
    turtlePen = true;
    vertices.push(vec2(turtlePos[0],turtlePos[1]));
}

function forward(distance){
    turtlePos = add(turtlePos, scale(distance,vec2(Math.cos(turtleAngle), Math.sin(turtleAngle))));
    if(turtlePen){
        vertices.push(vec2(turtlePos[0], turtlePos[1]));
    }
}
function pen(up_down){
    turtlePen = up_down;
}

function right(angle){
    turtleAngle = turtleAngle - angle % 360;
}
function left(angle){
    turtleAngle = turtleAngle + angle % 360;
}

function testMove(){
    init(1,1,0);
    forward(10);
    console.log(turtlePos);
}

function testRightTurn(){
    init(1,1,0);
    right(380);
    console.log(turtleAngle);
}

function testLeftTurn(){
    init(1,1,0);
    left(10);
    console.log(turtleAngle);
}


