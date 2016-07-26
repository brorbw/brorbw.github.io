var gl;
var points;

var vPosition, vPosition2;
var bufferId, bufferId2;
var program;

var turtleAngle;
var turtlePos;
var turtlePen;

var vertices = [];

window.onload = function init()
{
    var canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    //  Load shaders and initialize attribute buffers
    
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU
    /*
    bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );    

    render();
    */
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
    gl.drawArrays( gl.LINES, 0, vertices.length)
    
}

function init(x,y,theta){
    turtlePos = vec2(x,y);
    turtleAngle = theta;
    turtlePen = true;
}

function convert(number){
    var value = 0;
    var old = (512 - 0);
    if(number === 0){
        value = -1;
    } else {
        var newR = (1 - -1);
        value = (((number - 0)*newR)/old)+-1;
    }
    return value;
}

function forward(distance){
    if(turtlePen){
        vertices.push(vec2(convert(turtlePos[0]), convert(turtlePos[1])));
        turtlePos = add(turtlePos, scale(distance,vec2(Math.cos(rad(turtleAngle)),Math.sin(rad(turtleAngle)))));
        // (x,y) + (cos(angle),sin(angle)) * distance
        vertices.push(vec2(convert(turtlePos[0]), convert(turtlePos[1])));
        //vertices.push(vec2(convert(turtlePos[0]), convert(turtlePos[1])));
    } else {
        turtlePos = add(turtlePos, scale(distance,vec2(Math.cos(turtleAngle),Math.sin(turtleAngle))));
    }
}

function rad(degree){
    return degree * Math.PI/180;
}

function pen(up_down){
    turtlePen = up_down;
}

function right(angle){
    turtleAngle = (turtleAngle - angle) % 360;
}
function left(angle){
    turtleAngle = (turtleAngle + angle) % 360;
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

function fractialMountains(){
    
}

function devideTriangle(length, count){
    if(count < 0){
        buffer();
        render();
    } else{
        forward(length);
        left(120);
        devideTriangle(length/2, count-1);
        forward(length);
        left(120);
        devideTriangle(length/2, count-1);
        forward(length);
        left(120);
        devideTriangle(length/2, count-1);
    }
}

function triangle(length){
    forward(length);
    left(120);
    forward(length);
    left(120);
    forward(length);
    left(120);
    buffer();
    render();
}