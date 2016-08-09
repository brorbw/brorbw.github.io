var ap,dp,sp,lp,sh;
var ap2,dp2,sp2;

//point light
var lightDiffuse = vec4 ( 1.0 , 1.0 , 1.0 , 1.0 );
var lightAmbient = vec4 ( 0.7 , 0.6 , 0.4 , 1.0 );
var lightSpecular = vec4 ( 1 , 1.0 , 1.0 , 1.0 );
var lightPosition = vec4 ( gridSize/2, 50, gridSize/2 , 1.0 );

var lightDiffuse2 = vec4 ( 1.0 , 0.0 , 0.0 , 0.2 );
var lightAmbient2 = vec4 ( 0.7 , 0.0 , 0.0 , 0.2 );
var lightSpecular2 = vec4 ( 1 , 0.0 , 0.0 , 0.2 );
var lightPosition2 = vec4 (eye, 1.0 );

//materinal propeties
var materialAmbient = vec4 ( 0.7 , 0.7 , 0.7 , 1.0 );
var materialDiffuse = vec4 ( 0.5 , 0.5 , 0.5 , 1.0 );
var materialSpecular = vec4 ( 1.0 , 1.0 , 1.0 , 1.0 );
var materialShininess;

var ambientProduct;
var diffuseProduct;
var specularProduct;

var ambientProduct2;
var diffuseProduct2;
var specularProduct2;


function sendMaterial(){
  gl.uniform4fv(ap, flatten(ambientProduct));
  gl.uniform4fv(dp, flatten(diffuseProduct));
  gl.uniform4fv(sp, flatten(specularProduct));
  gl.uniform1f(sh, materialShininess);

  gl.uniform4fv(ap2, flatten(ambientProduct2));
  gl.uniform4fv(dp2, flatten(diffuseProduct2));
  gl.uniform4fv(sp2, flatten(specularProduct2));
}

function initMaterial() {
  ap = gl.getUniformLocation(program, "ambientProduct");
  dp = gl.getUniformLocation(program , "diffuseProduct" );
  sp = gl.getUniformLocation(program , "specularProduct" );
  lp = gl.getUniformLocation(program , "lightPosition" );
  sh = gl.getUniformLocation(program , "shininess" );
  gl.uniform4fv(gl.getUniformLocation(program , "lightPosition" ) , flatten ( lightPosition )) ;
  ap2 = gl.getUniformLocation(program, "ambientProduct2");
  dp2 = gl.getUniformLocation(program , "diffuseProduct2" );
  sp2 = gl.getUniformLocation(program , "specularProduct2" );
}
function calcProducts(){
  ambientProduct = mult ( lightAmbient , materialAmbient );
  diffuseProduct = mult ( lightDiffuse , materialDiffuse );
  specularProduct = mult ( lightSpecular , materialSpecular );

  ambientProduct2 = mult(lightAmbient2 , materialAmbient );
  diffuseProduct2 = mult(lightDiffuse2 , materialDiffuse );
  specularProduct2 = mult(lightSpecular2 , materialSpecular );
}

function sunShader(sunAngle){
  lightAmbient = vec4 ( 1 , 1 , 0.8 , 1.0 );
  if(sunAngle<-40){
    lightSpecular = vec4 ( 0.0 , 1 , 0 , 1.0 );
  }else if(sunAngle>40){
    lightSpecular = vec4 ( 1 , 0 , 0 , 1.0 );
  }else{
    lightSpecular =vec4(1.0,1.0,1.0,1.0);
  }
  //materinal propeties
  materialAmbient = vec4 ( 1.0 , 1.0 , 1.0 , 1.0 );
  materialDiffuse = vec4 ( 1.0 , 1.0 , 1.0 , 1.0 );
  materialSpecular = vec4 ( 1.0 , 1.0 , 1.0 , 1.0 );
  materialShininess = 30;
  calcProducts();
  sendMaterial();
}

function boxShader() {
  lightAmbient = vec4 ( 0.7 , 0.7 , 0.7 , 1.0 );
  //materinal propeties
  materialAmbient = vec4 ( 0.7 , 0.7 , 0.7 , 1.0 );
  materialDiffuse = vec4 ( 0.7 , 0.5 , 0.5 , 1.0 );
  materialSpecular = vec4 ( 1.0 , 0.5 , 1.0 , 1.0 );
  materialShininess = 60;
  calcProducts();
  sendMaterial();
}
