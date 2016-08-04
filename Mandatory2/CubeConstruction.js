function buildCube(centerPoint, length) {
    vertForCube = [
        vec4(centerPoint[0] - length / 2, centerPoint[1] - length / 2, centerPoint[2] + length / 2),
        vec4(centerPoint[0] - length / 2, centerPoint[1] + length / 2, centerPoint[2] + length / 2),
        vec4(centerPoint[0] + length / 2, centerPoint[1] + length / 2, centerPoint[2] + length / 2),
        vec4(centerPoint[0] + length / 2, centerPoint[1] - length / 2, centerPoint[2] + length / 2),
        vec4(centerPoint[0] - length / 2, centerPoint[1] - length / 2, centerPoint[2] - length / 2),
        vec4(centerPoint[0] - length / 2, centerPoint[1] + length / 2, centerPoint[2] - length / 2),
        vec4(centerPoint[0] + length / 2, centerPoint[1] + length / 2, centerPoint[2] - length / 2),
        vec4(centerPoint[0] + length / 2, centerPoint[1] - length / 2, centerPoint[2] - length / 2)
    ];
    quad( 1, 0, 3, 2 ,vertForCube);
    quad( 2, 3, 7, 6 ,vertForCube);
    quad( 3, 0, 4, 7 ,vertForCube);
    quad( 6, 5, 1, 2 ,vertForCube);
    quad( 4, 5, 6, 7 ,vertForCube);
    quad( 5, 4, 0, 1 ,vertForCube);
}


function quad(a, b, c, d,verts) {

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
