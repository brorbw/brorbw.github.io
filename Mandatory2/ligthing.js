var ap,dp,sp,lp,sh;
var ap1,dp1,sp1;

//point light
var lightDiffuse = vec4 ( 0.8 , 0.8 , 0.7 , 1.0 );
var lightAmbient = vec4 ( 0.5 , 0.4 , 0.3 , 1.0 );
var lightSpecular = vec4 ( 1.0 , 1.0 , 1.0 , 1.0 );
var lightPosition = vec4 ( gridSize/2, 50, gridSize/2 , 1.0 );

var lightDiffuse1 = vec4 ( 0.5 , 0 , 0 , 0.5 );
var lightAmbient1 = vec4 ( 0.6 , 0.3 , 0.2 , 1.0 );
var lightSpecular1 = vec4 ( 1.0 , 0 , 0 , 1.0 );

//materinal propeties
var materialAmbient = vec4 ( 0.7 , 0.7 , 0.7 , 1.0 );
var materialDiffuse = vec4 ( 0.5 , 0.5 , 0.5 , 1.0 );
var materialSpecular = vec4 ( 1.0 , 1.0 , 1.0 , 1.0 );
var materialShininess;

var ambientProduct;
var diffuseProduct;
var specularProduct;
var ambientProduct1;
var diffuseProduct1;
var specularProduct1;


function sendMaterial(){
  gl.uniform4fv(ap, flatten(ambientProduct));
  gl.uniform4fv(dp, flatten(diffuseProduct));
  gl.uniform4fv(sp, flatten(specularProduct));
  gl.uniform4fv(ap1, flatten(ambientProduct1));
  gl.uniform4fv(dp1, flatten(diffuseProduct1));
  gl.uniform4fv(sp1, flatten(specularProduct1));
  gl.uniform1f(sh, materialShininess);
}

function initMaterial() {
  ap = gl.getUniformLocation(program, "ambientProduct");
  dp = gl.getUniformLocation(program , "diffuseProduct" );
  sp = gl.getUniformLocation(program , "specularProduct" );
  lp = gl.getUniformLocation(program , "lightPosition" );
  sh = gl.getUniformLocation(program , "shininess" );
  gl.uniform4fv(gl.getUniformLocation(program , "lightPosition" ) , flatten ( lightPosition )) ;
  ap1 = gl.getUniformLocation(program, "ambientProduct1");
  dp1 = gl.getUniformLocation(program , "diffuseProduct1" );
  sp1 = gl.getUniformLocation(program , "specularProduct1" );
}
function calcProducts(){
  ambientProduct = mult ( lightAmbient , materialAmbient );
  diffuseProduct = mult ( lightDiffuse , materialDiffuse );
  specularProduct = mult ( lightSpecular , materialSpecular );
  ambientProduct1 = mult ( lightAmbient1 , materialAmbient );
  diffuseProduct1 = mult ( lightDiffuse1 , materialDiffuse );
  specularProduct1 = mult ( lightSpecular1 , materialSpecular );
}

function sunShader(){
  lightAmbient = vec4 ( 1 , 1 , 1 , 1.0 );
  //materinal propeties
  materialAmbient = vec4 ( 1.0 , 1.0 , 1.0 , 1.0 );
  materialDiffuse = vec4 ( 1.0 , 1.0 , 1.0 , 1.0 );
  materialSpecular = vec4 ( 1.0 , 1.0 , 1.0 , 1.0 );
  materialShininess = 100;
  calcProducts();
  sendMaterial();
}

function boxShader() {
  lightAmbient = vec4 ( 0.5 , 0.4 , 0.3 , 1.0 );
  //materinal propeties
  materialAmbient = vec4 ( 0.2 , 0.3 , 0.2 , 1.0 );
  materialDiffuse = vec4 ( 0.7 , 0.5 , 0.5 , 1.0 );
  materialSpecular = vec4 ( 1.0 , 0.5 , 1.0 , 1.0 );
  materialShininess = 60;
  calcProducts();
  sendMaterial();
}