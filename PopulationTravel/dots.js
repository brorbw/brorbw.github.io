

//The prop that 2 dots will make a new dot
var prop = 100;
//The proximity to each other in order to make the new dot
var proximity = 1;

var maxNumberOfDots;
var currentNumberOfDots;

var dots = [];

// This is a dot
function Dot(position, color,thisIndex){
    this.position = position;
    this.color = color;
    this.isMoving = false;
    this.destination;
    this.source;
    this.isRelation = false;
    this.relationIndex;
    this.thisIndex =thisIndex;
}




function Position(x,y){
    this.x = x;
    this.y = y;
    //this.z = z;
}

function calculateNewColor(color1, color2) {
    return vec4(
        color1[0]*0.5+color2[0]*0.5,
        color1[1]*0.5+color2[1]*0.5,
        color1[2]*0.5+color2[2]*0.5,
        color1[3]*0.5+color2[3]*0.5
    );
}


function makeNew(position) {
    if(currentNumberOfDots >= maxNumberOfDots){
        if(Math.random()*100<=prop){
            return true;
        }
    }
    return false;
}

function neighbor(dot){
    var index = dot.thisIndex;
    if(!dot.isMoving){
        if(!dot.isRelation) {
            while (index < dots.length) {
                if (!dots[index].isRelation)
                    if (distance(dot.position, dots[index])) {
                        makeNew(dot.position);
                        dot.isRelation = true;
                        ots[index].isRelation = true;
                        dot.relationIndex = index;
                        dots[index].relationIndex = dot.thisIndex;
                    }
            }
        } else {
            //This is where the breake up code goes
            if (distance(dot.position, dots[dot.relationIndex])) {
                makeNew(dot.position);
            }
        }
        
    }
}

function distance(position1, position2) {
    return Math.sqrt(
        Math.pow(Math.abs((position1.x-position2.x)),2)+
        Math.pow(Math.abs((position1.y-position2.y)),2));
}

function makePoints(number, center){
    for(i = 0; i < number; i++){
        dots.push(vec2(
            center.x + (Math.random()* r * Math.cos(Math.random()*100 * 2 * Math.PI / 100)),
            center.y + (Math.random()* r * Math.sin(Math.random()*100 * 2 * Math.PI / 100))
        ));
    }
}