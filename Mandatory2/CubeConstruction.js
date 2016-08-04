var pointsArray = [];
var colorsArray = [];

function buildCube(centerPoint) {
    console.log(centerPoint.z);
    var vertForCube = [
        vec4(centerPoint.x - boxLength / 2, centerPoint.y - boxLength / 2, centerPoint.z + boxLength / 2),
        vec4(centerPoint.x - boxLength / 2, centerPoint.y + boxLength / 2, centerPoint.z + boxLength / 2),
        vec4(centerPoint.x + boxLength / 2, centerPoint.y + boxLength / 2, centerPoint.z + boxLength / 2),
        vec4(centerPoint.x + boxLength / 2, centerPoint.y - boxLength / 2, centerPoint.z + boxLength / 2),
        vec4(centerPoint.x - boxLength / 2, centerPoint.y - boxLength / 2, centerPoint.z - boxLength / 2),
        vec4(centerPoint.x - boxLength / 2, centerPoint.y + boxLength / 2, centerPoint.z - boxLength / 2),
        vec4(centerPoint.x + boxLength / 2, centerPoint.y + boxLength / 2, centerPoint.z - boxLength / 2),
        vec4(centerPoint.x + boxLength / 2, centerPoint.y - boxLength / 2, centerPoint.z - boxLength / 2)
    ];
    console.log(vertForCube.toString());
    quad( 1, 0, 3, 2 ,vertForCube);
    quad( 2, 3, 7, 6 ,vertForCube);
    quad( 3, 0, 4, 7 ,vertForCube);
    quad( 6, 5, 1, 2 ,vertForCube);
    quad( 4, 5, 6, 7 ,vertForCube);
    quad( 5, 4, 0, 1 ,vertForCube);
}


function quad(a, b, c, d, verts) {

    var x = subtract(verts[a],verts[b]);
    var y = subtract(verts[b],verts[c]);
    var color = vec4(cross(x,y),1);

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