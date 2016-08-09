var ap,dp,sp,lp,sh;

//point light
var lightDiffuse = vec4 ( 1.0 , 1.0 , 1.0 , 1.0 );
var lightAmbient = vec4 ( 0.5 , 0.2 , 0.3 , 1.0 );
var lightSpecular = vec4 ( 1.0 , 1.0 , 1.0 , 1.0 );
var lightPosition = vec4 ( 20.0, 50.0 , 30.0 , 1.0 );

//materinal propeties
var materialAmbient = vec4 ( 0.7 , 0.7 , 0.7 , 1.0 );
var materialDiffuse = vec4 ( 0.5 , 0.5 , 0.5 , 1.0 );
var materialSpecular = vec4 ( 1.0 , 1.0 , 1.0 , 1.0 );
var materialShininess = 100.0;

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
  //point light
  lightDiffuse = vec4 ( 1.0 , 1.0 , 1.0 , 1.0 );
  lightAmbient = vec4 ( 0.5 , 0.2 , 0.3 , 1.0 );
  lightSpecular = vec4 ( 1.0 , 1.0 , 1.0 , 1.0 );
  lightPosition = vec4 ( 20.0, 50.0 , 30.0 , 1.0 );

//materinal propeties
  materialAmbient = vec4 ( 0.7 , 0.7 , 0.7 , 1.0 );
  materialDiffuse = vec4 ( 0.5 , 0.5 , 0.5 , 1.0 );
  materialSpecular = vec4 ( 1.0 , 1.0 , 1.0 , 1.0 );
  materialShininess = 100.0;
  calcProducts();
  sendMaterial();

}

function boxShader() {
  //point light
  lightDiffuse = vec4 ( 1.0 , 1.0 , 1.0 , 1.0 );
  lightAmbient = vec4 ( 0.5 , 0.2 , 0.3 , 1.0 );
  lightSpecular = vec4 ( 1.0 , 1.0 , 1.0 , 1.0 );
  lightPosition = vec4 ( 20.0, 50.0 , 30.0 , 1.0 );

//materinal propeties
  materialAmbient = vec4 ( 0.7 , 0.7 , 0.7 , 1.0 );
  materialDiffuse = vec4 ( 1.0 , 1.0 , 1.0 , 1.0 );
  materialSpecular = vec4 ( 1.0 , 1.0 , 1.0 , 1.0 );
  materialShininess = 100.0;
  calcProducts();
  sendMaterial();
}