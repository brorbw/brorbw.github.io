var ap,dp,sp,lp,sh;

//point light
var lightDiffuse = vec4 ( 1.0 , 1.0 , 1.0 , 1.0 );
var lightAmbient = vec4 ( 0.7 , 0.6 , 0.4 , 1.0 );
var lightSpecular = vec4 ( 1 , 1.0 , 1.0 , 1.0 );
var lightPosition = vec4 ( gridSize/2, 3, gridSize/2 , 1.0 );

//materinal propeties
var materialAmbient = vec4 ( 0.7 , 0.7 , 0.7 , 1.0 );
var materialDiffuse = vec4 ( 0.5 , 0.5 , 0.5 , 1.0 );
var materialSpecular = vec4 ( 1.0 , 1.0 , 1.0 , 1.0 );
var materialShininess;

var ambientProduct;
var diffuseProduct;
var specularProduct;


function sendMaterial(){
  gl.uniform4fv(ap, flatten(ambientProduct));
  gl.uniform4fv(dp, flatten(diffuseProduct));
  gl.uniform4fv(sp, flatten(specularProduct));
  gl.uniform1f(sh, materialShininess);
}

function initMaterial() {
  ap = gl.getUniformLocation(program, "ambientProduct");
  dp = gl.getUniformLocation(program , "diffuseProduct" );
  sp = gl.getUniformLocation(program , "specularProduct" );
  lp = gl.getUniformLocation(program , "lightPosition" );
  sh = gl.getUniformLocation(program , "shininess" );
  gl.uniform4fv(gl.getUniformLocation(program , "lightPosition" ) , flatten ( lightPosition )) ;
}
function calcProducts(){
  ambientProduct = mult ( lightAmbient , materialAmbient );
  diffuseProduct = mult ( lightDiffuse , materialDiffuse );
  specularProduct = mult ( lightSpecular , materialSpecular );
}

function sunShader(){
  lightAmbient = vec4 ( 1 , 1 , 0.8 , 1.0 );
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