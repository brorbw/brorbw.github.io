//This is the structure of the blocks in the world in a 3D way

//This will administrate the world for you, and give you the type of box at a specific index

//Right now there is only

var gridSize = 2;
var world = [gridSize*gridSize*gridSize];

function addBox(boxToAdd){
    var position = boxToAdd.position;
    var index = position.z*gridSize*gridSize+position.y*gridSize+position.x;
    world[index] = boxToAdd;
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
}
function Position(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
}

function buildWorld(levels){
    for (var z = 0; z < gridSize; z++){
        for (var y = 0; y < gridSize; y++){
            for (var x = 0; x < gridSize; x++){
                var p = new Position(x, y, z);
                    if (y < levels) {
                        var box = new Box(p);
                        addBox(box);
                    }
                }
            }
        }
    var p = new Position(0,0,1);
    removeBox(p);
}

function drawWorld() {
    for (var z = 0; z < gridSize; z++){
        for (var y = 0; y < gridSize; y++){
            for (var x = 0; x < gridSize; x++){
                var p = new Position(x, y, z);
                var cube = getCube(p);
                if(cube !== undefined) {
                    if(cube === 0){
                        buildSpinningCube(p);
                    } else {
                        buildRegularCube(p);
                    }
                }
            }
        }
    }
}