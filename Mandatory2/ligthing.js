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

var ambientProduct = mult ( lightAmbient , materialAmbient );
var diffuseProduct = mult ( lightDiffuse , materialDiffuse );
var specularProduct = mult ( lightSpecular , materialSpecular );

function initShader(program){
  gl.uniform4fv( gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
  gl. uniform4fv ( gl. getUniformLocation ( program , "diffuseProduct" ) , flatten ( diffuseProduct ) ) ;
  gl. uniform4fv ( gl. getUniformLocation ( program , "specularProduct" ) , flatten ( specularProduct ) ) ;
  gl. uniform4fv ( gl. getUniformLocation ( program , "lightPosition" ) , flatten ( lightPosition )) ;
  gl. uniform1f ( gl. getUniformLocation ( program , "shininess" ) , materialShininess ) ;
}

function sunShader(){
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
}

function boxShader() {
  //point light
  var lightDiffuse = vec4 ( 1.0 , 1.0 , 1.0 , 1.0 );
  var lightAmbient = vec4 ( 0.5 , 0.2 , 0.3 , 1.0 );
  var lightSpecular = vec4 ( 1.0 , 1.0 , 1.0 , 1.0 );
  var lightPosition = vec4 ( 20.0, 50.0 , 30.0 , 1.0 );

//materinal propeties
  var materialAmbient = vec4 ( 0.7 , 0.7 , 0.7 , 1.0 );
  var materialDiffuse = vec4 ( 1.0 , 1.0 , 1.0 , 1.0 );
  var materialSpecular = vec4 ( 1.0 , 1.0 , 1.0 , 1.0 );
  var materialShininess = 100.0;
}