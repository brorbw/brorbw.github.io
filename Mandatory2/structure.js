//This is the structure of the blocks in the world in a 3D way

//This will administrate the world for you, and give you the type of box at a specific index

//Right now there is only

var gridSize = 10;
var world = [gridSize*gridSize*gridSize];

function addBox(boxToAdd){
    var position = boxToAdd.position;
    var index = position.z*gridSize*gridSize+position.y*gridSize+position.x;
    world[index] = boxToAdd;
    buildCube(position);
}

//might not be needed
function getCube(position){
    return world[position.z*gridSize*gridSize+position.y*gridSize+position.x];
}

function removeBox(position){
    world[position.z*gridSize*gridSize+position.y*gridSize+position.x] = 0;
}


function Box(position){
    this.position = position;
    //this.matype = matype;
}
function Position(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
}

