var pointsArray = [];
var colorsArray = [];
var spinningArray = [];
var spinningNormals = []; //they are not suppose to be here, but they'll stay for now

var centerArray = [];
var centerSpinningArray = [];

var rotatedZ = rotate(45, vec3(0,0,1));
var rotatedY = rotate(45, vec3(1,0,0));

function __buildVertsForCube(centerPoint, boxLength) {
    //second param is suppose to be the size of the cube so we can make
    //different sized cubes depending of whether we are makeing a spinning og regular cube
    return [
        vec4(centerPoint.x - boxLength / 2, centerPoint.y - boxLength / 2, centerPoint.z + boxLength / 2),
        vec4(centerPoint.x - boxLength / 2, centerPoint.y + boxLength / 2, centerPoint.z + boxLength / 2),
        vec4(centerPoint.x + boxLength / 2, centerPoint.y + boxLength / 2, centerPoint.z + boxLength / 2),
        vec4(centerPoint.x + boxLength / 2, centerPoint.y - boxLength / 2, centerPoint.z + boxLength / 2),
        vec4(centerPoint.x - boxLength / 2, centerPoint.y - boxLength / 2, centerPoint.z - boxLength / 2),
        vec4(centerPoint.x - boxLength / 2, centerPoint.y + boxLength / 2, centerPoint.z - boxLength / 2),
        vec4(centerPoint.x + boxLength / 2, centerPoint.y + boxLength / 2, centerPoint.z - boxLength / 2),
        vec4(centerPoint.x + boxLength / 2, centerPoint.y - boxLength / 2, centerPoint.z - boxLength / 2)
    ];
}


function buildSpinningCube(centerPoint){
    //this is where the spinning cube is build
    var centerPointTmp = vec4(centerPoint.x,centerPoint.y,centerPoint.z,1)
    for(var i = 0; i < 36; i++){
        centerSpinningArray.push(centerPointTmp);
    }
    var vertsForCube = __buildVertsForCube(centerPoint,0.5);
    for(var i = 0; i < vertsForCube.length;i++){
        //this is where the code for the initial rotation
        var vecCenter = subtract(vec4(centerPoint.x,centerPoint.y,centerPoint.z,1),vertsForCube[i]);
        vecCenter = mult(rotatedZ,vecCenter);
        vecCenter = mult(rotatedY,vecCenter);

        vertsForCube[i] = add(vecCenter,vec4(centerPoint.x,centerPoint.y,centerPoint.z,1));
    }
    console.log("building spinning cube");
    //There should be some kind of claculation that
    //rotats the box in 45° in one direction and then 45° in another direction
    //and then send the updated array to the __quadSpinning
    __quadSpinning( 1, 0, 3, 2 ,vertsForCube);
    __quadSpinning( 2, 3, 7, 6 ,vertsForCube);
    __quadSpinning( 3, 0, 4, 7 ,vertsForCube);
    __quadSpinning( 6, 5, 1, 2 ,vertsForCube);
    __quadSpinning( 4, 5, 6, 7 ,vertsForCube);
    __quadSpinning( 5, 4, 0, 1 ,vertsForCube);
}

function buildRegularCube(centerPoint){
    //this is where the regular cube is build
    var vertsForCube = __buildVertsForCube(centerPoint,1);
    console.log("building regular cube");
    var centerPointTmp = vec4(centerPoint.x,centerPoint.y,centerPoint.z,1)
    for(var i = 0; i < 36; i++){
        centerArray.push(centerPointTmp);
    }
    __quadRegular( 1, 0, 3, 2 ,vertsForCube);
    __quadRegular( 2, 3, 7, 6 ,vertsForCube);
    __quadRegular( 3, 0, 4, 7 ,vertsForCube);
    __quadRegular( 6, 5, 1, 2 ,vertsForCube);
    __quadRegular( 4, 5, 6, 7 ,vertsForCube);
    __quadRegular( 5, 4, 0, 1 ,vertsForCube);
}

function __quadRegular(a, b, c, d, verts) {
    //normals
    var x = subtract(verts[a],verts[b]);
    var y = subtract(verts[b],verts[c]);
    var color = vec4(normalize(cross(x,y)),1);


    //to the arrays
    pointsArray.push(verts[a]);
    colorsArray.push(color);
    pointsArray.push(verts[b]);
    colorsArray.push(color);
    pointsArray.push(verts[c]);
    colorsArray.push(color);
    pointsArray.push(verts[a]);
    colorsArray.push(color);
    pointsArray.push(verts[c]);
    colorsArray.push(color);
    pointsArray.push(verts[d]);
    colorsArray.push(color);
}

function __quadSpinning(a, b, c, d, verts) {


    //Making the normals
    var x = subtract(verts[a], verts[b]);
    var y = subtract(verts[b], verts[c]);
    var color = vec4(normalize(cross(y,x)), 1);
    
    //pushing to the array
    spinningArray.push(verts[a]);
    spinningNormals.push(color);
    spinningArray.push(verts[b]);
    spinningNormals.push(color);
    spinningArray.push(verts[c]);
    spinningNormals.push(color);
    spinningArray.push(verts[a]);
    spinningNormals.push(color);
    spinningArray.push(verts[c]);
    spinningNormals.push(color);
    spinningArray.push(verts[d]);
    spinningNormals.push(color);
}

function emptyArrays(){
    pointsArray = [];
    colorsArray = [];
    spinningArray = [];
    spinningNormals = [];
    centerArray = [];
    centerSpinningArray = [];
}
