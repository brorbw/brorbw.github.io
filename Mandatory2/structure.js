//This is the structure of the blocks in the world in a 3D way

//This will administrate the world for you, and give you the type of box at a specific index

//Right now there is only

var gridSize =40;
var world = [gridSize*gridSize*gridSize];

function addBox(boxToAdd){
    var position = boxToAdd.position;
    var index = position.z*gridSize*gridSize+position.y*gridSize+position.x;
    world[index] = boxToAdd;
    if(!init) {
        emptyArrays();
        drawWorld();
        resendBuffers();
    }
}

//might not be needed
function getCube(position){
    return world[position.z*gridSize*gridSize+position.y*gridSize+position.x];
}

function removeBox(position){
    //This is where we should build a rotating cube
    world[position.z*gridSize*gridSize+position.y*gridSize+position.x] = 0;
    emptyArrays();
    drawWorld();
    resendBuffers();
}

function Box(position){
    this.position = position;
}
function Position(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
}


//only buils in planes;
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
    drawWorld();
    resendBuffers();
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
                        console.log(p);
                    } else {
                        buildRegularCube(p);
                        //console.log(p);
                    }
                }
            }
        }
    }
}
//y=sin(5x)*cos(5z)/5
function buildMountains(){
    buildSun(sunInitPosition);
    for(var z = 0; z < gridSize; z++){
        for(var x = 0; x < gridSize;x++){
            var yl = (Math.sin(0.1*x)*Math.cos(0.1*z))*20+20;
            for(var y = 0; y < yl; y++){
                var pos = new Position(x,y,z);
                var box = new Box(pos);
                addBox(box);
            }
        }
    }
    drawWorld();
    resendBuffers();
}



function buildMountainsSmall(){
    for(var z = 0; z < gridSize; z++){
        for(var x = 0; x < gridSize;x++){
            var yl = (Math.sin(0.8*x)*Math.cos(0.8*z))*5+5;
            for(var y = 0; y < yl; y++){
                var pos = new Position(x,y,z);
                var box = new Box(pos);
                addBox(box);
            }
        }
    }
    drawWorld();
    resendBuffers();
}
