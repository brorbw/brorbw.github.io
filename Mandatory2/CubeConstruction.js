
//This is for cube creation, so doing the math for the cube

var colors = [];
var points = [];

function buildCube(centerPoint, length){
  var vertices = [
    vec4(centerPoint[0]-length/2,centerPoint[1]-length/2,centerPoint[2]+length),
    vec4(centerPoint[0]-length/2,centerPoint[1]+length/2,centerPoint[2]+length/2),
    vec4(centerPoint[0]+length/2,centerPoint[1]+length/2,centerPoint[2]+length/2),
    vec4(centerPoint[0]+length/2,centerPoint[1]-length/2,centerPoint[2]+length/2),
    vec4(centerPoint[0]-length/2,centerPoint[1]-length/2,centerPoint[2]-length/2),
    vec4(centerPoint[0]-length/2,centerPoint[1]+length/2,centerPoint[2]-length/2),
    vec4(centerPoint[0]+length/2,centerPoint[1]+length/2,centerPoint[2]-length/2),
    vec4(centerPoint[0]+length/2,centerPoint[1]-length/2,centerPoint[2]-length/2)
  ];
  var faceColor = [];
  y = subtract(vertices[1],vertices[0]); //y vector 01
  x = subtract(vertices[3],vertices[0]); //x vector 03
  faceColor.push(vec4(cross(x,y),1));
  // face b
  y = subtract(vertices[2],vertices[3]); //y vector 32
  x = subtract(vertices[7],vertices[3]); //x vector 37
  faceColor.push(vec4(cross(x,y),1));
  // face c
  y = subtract(vertices[0],vertices[4]); //y vector 40
  x = subtract(vertices[7],vertices[4]); //x vector 47
  faceColor.push(vec4(cross(x,y),1));
  // face d
  y = subtract(vertices[5],vertices[1]); //y vector 15
  x = subtract(vertices[2],vertices[1]); //x vector 12
  faceColor.push(vec4(cross(x,y),1));
  // face e
  y = subtract(vertices[6],vertices[7]); //y vector 76
  x = subtract(vertices[4],vertices[7]); //x vector 74
  faceColor.push(vec4(cross(x,y),1));
  // face f
  y = subtract(vertices[5],vertices[4]); //y vector 45
  x = subtract(vertices[0],vertices[4]); //x vector 40
  faceColor.push(vec4(cross(x,y),1));
  quad( 1, 0, 3, 2 ,vertices,faceColor[0]);
  quad( 2, 3, 7, 6 ,vertices,faceColor[1]);
  quad( 3, 0, 4, 7 ,vertices,faceColor[2]);
  quad( 6, 5, 1, 2 ,vertices,faceColor[5]);
  quad( 4, 5, 6, 7 ,vertices,faceColor[3]);
  quad( 5, 4, 0, 1 ,vertices,faceColor[4]);
}



function quad(a,b,c,d,vertices,color){
    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        colors.push(color);
    }
}