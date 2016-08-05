//This is the structure of the blocks in the world in a 3D way

//This will administrate the world for you, and give you the type of box at a specific index

//Right now there is only

var gridSize = 10;
var world = [gridSize*gridSize*gridSize];

function addBox(boxToAdd){
    var position = boxToAdd.position;
    var index = position.z*gridSize*gridSize+position.y*gridSize+position.x;
    world[index] = boxToAdd;
    buildRegularCube(position);
}

//might not be needed
function getCube(position){
    return world[position.z*gridSize*gridSize+position.y*gridSize+position.x];
}

function removeBox(position){
    //This is where we should build a rotating cube
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

function buildWorld(levels){
    for (var z = 0; z < 10; z++){
        for (var y = 0; y < 10; y++){
            for (var x = 0; x < 10; x++){
                if(y < levels) {
                    var p = new Position(x, y, z);
                    var box = new Box(p);
                    addBox(box);
                }
            }
        }
    }
}