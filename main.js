import * as THREE from 'three'
import * as dat from 'dat.gui' ; 
// create the scene 
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 8000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const balloon = new THREE.Group() ;

// create the balloon
var balloon_raduis = 4 ; 
const balloonGeometry = new THREE.SphereGeometry(3 , 32, 32);
const balloonMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const balloonSphere = new THREE.Mesh(balloonGeometry, balloonMaterial);
balloon.add(balloonSphere);

// create the basket 
const basketGeometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
const basketMaterial = new THREE.MeshBasicMaterial({ color: 0x8b4513 });
const basket = new THREE.Mesh(basketGeometry, basketMaterial);
basket.position.y = -4.5; 

balloon.add(basket);
balloon.scale.set(4,4,4)
// Create lines between balloon sphere and basket
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

const lineGeometryTop = new THREE.BufferGeometry();
const lineVerticesTop = new Float32Array([
  -1.5, -1, 0,
  -0.5, -4, 0
]);
lineGeometryTop.setAttribute('position', new THREE.BufferAttribute(lineVerticesTop, 3));
const lineTop = new THREE.Line(lineGeometryTop, lineMaterial);
balloon.add(lineTop);

const lineGeometryBottom = new THREE.BufferGeometry();
const lineVerticesBottom = new Float32Array([
  1.5, -1, 0,
  0.5, -4, 0
]);
lineGeometryBottom.setAttribute('position', new THREE.BufferAttribute(lineVerticesBottom, 3));
const lineBottom = new THREE.Line(lineGeometryBottom, lineMaterial);
balloon.add(lineBottom);

//Create the human 
const human = new THREE.Group() ; 
// create the head
var headGeometry = new THREE.SphereGeometry(1, 32, 32);
var headMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
var head = new THREE.Mesh(headGeometry, headMaterial);
head.position.set(0, 2, 0);
human.add(head);

// create the torso
var torsoGeometry = new THREE.BoxGeometry(1, 2, 0.5);
var torsoMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var torso = new THREE.Mesh(torsoGeometry, torsoMaterial);
torso.position.set(0, 0.5, 0);
human.add(torso);

// create the arms
var armGeometry = new THREE.BoxGeometry(0.5, 1, 0.5);
var armMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
var leftArm = new THREE.Mesh(armGeometry, armMaterial);
leftArm.position.set(1, 0, 0);
torso.add(leftArm);
var rightArm = new THREE.Mesh(armGeometry, armMaterial);
rightArm.position.set(-1, 0, 0);
human.add(rightArm);

// create the legs
var legGeometry = new THREE.BoxGeometry(0.5, 1.5, 0.5);
var legMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
var leftLeg = new THREE.Mesh(legGeometry, legMaterial);
leftLeg.position.set(0.5, -1, 0);
torso.add(leftLeg);
var rightLeg = new THREE.Mesh(legGeometry, legMaterial);
rightLeg.position.set(-0.5, -1, 0);
human.add(rightLeg);

// position the whole person
torso.position.set(0, 0, 0);


human.scale.set(0.2 , 0.3 ,0.1) ;
human.position.set(0 , -4 , 0)

balloon.add(human) ; 
scene.add(balloon) ; 



//SkyBox
let materialArray = [];
let texture_ft = new THREE.TextureLoader().load( 'meadow_ft.jpg');
let texture_bk = new THREE.TextureLoader().load( 'meadow_bk.jpg');
let texture_up = new THREE.TextureLoader().load( 'meadow_up.jpg');
let texture_dn = new THREE.TextureLoader().load( 'meadow_dn.jpg');
let texture_rt = new THREE.TextureLoader().load( 'meadow_rt.jpg');
let texture_lf = new THREE.TextureLoader().load( 'meadow_lf.jpg');
  
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));

for (let i = 0; i < 6; i++)
  materialArray[i].side = THREE.BackSide;
   
let skyboxGeo = new THREE.BoxGeometry( 9000,9000 , 9000);
let skybox = new THREE.Mesh( skyboxGeo, materialArray );
skybox.position.y =4475 
scene.add( skybox ); 

// Audio 

// Create a new audio context
const audioListener = new THREE.AudioListener();
camera.add(audioListener); 


const audioLoader1 = new THREE.AudioLoader();
const audioPath1 = 'wind_Balloon.mp3'; // Replace with the actual path
const audio1 = new THREE.Audio(audioListener);

audioLoader1.load(audioPath1, function(buffer) {
  audio1.setBuffer(buffer);
  audio1.setLoop(true);
});




//Axes Helper And Event 
//Add Axes Helper ... Red X axes , Green Y axes , Blue z axes  
const axeshelper = new THREE.AxesHelper(100) ;
scene.add(axeshelper) ;  



const cursor = {
  x : 0 , 
  y: 0
}
window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX / window.innerWidth - 0.5 ; 
    cursor.y = - (event.clientY / window.innerHeight - 0.5) ; 
}) ; 

window.addEventListener('resize' ,() =>
{
    renderer.setSize( window.innerWidth, window.innerHeight );
}) ; 


//Display the value in screen 
var div = document.createElement('div');

// Set the position and styling of the div element
div.style.position = 'absolute';
div.style.top = '10px';
div.style.left = '10px';
div.style.color = 'white';
div.style.fontFamily = 'Arial';
div.style.fontSize = '20px';

document.body.appendChild(div);


// Set up keyboard listener
document.addEventListener("keydown", onKeyDown, false);

//physics 

function calculateDensityH(height) 
{
  return 0.1786 + 0.00008 * height;
}

//constant 
var densityC = 1.225 ; 

// معامل الجودة
const balloon_constant = 0.004 ; 

//Balloon Volume 
const balloon_Volume = (4/3)* Math.PI* (balloon_raduis ** 3)   ;


//payload Mass 
const payload_mass = 150 ; 


//Balloon Skin Mass
const skin_mass = 45 ;  


//Payload Mass that can the balloon fly with it
const carrying_capacity = balloon_Volume*(1.225-0.179)-skin_mass ; 

// Set the initial position, velocity, and acceleration Vectors of the balloon 
let position = new THREE.Vector3(0, 0 , 0); // Start at a height of 50 units
let velocity = new THREE.Vector3(0, 1 , 0); // Start with zero initial velocity
let acceleration = new THREE.Vector3(0, 0, 0);

// calculate the force 
function buoyancy_Force()
{
    const buoyancyForce = new THREE.Vector3(0 , densityC *  balloon_Volume * 9.8 , 0)  ;
    return buoyancyForce ; 
}

function gravity_Force(density)
{
    //Gravity Force 
    const gravityForce = new THREE.Vector3(0, (skin_mass + (density * balloon_Volume) + payload_mass) * -1 *9.8 , 0); // Accelerate downwards at a rate of 9.81 m/s^2 per kg of mass
    return gravityForce ; 
}
const gui = new dat.GUI();
const controls = {
     Vx : 0 , 
     Vz : 0 
}
gui.add(controls, 'Vx', -5, 5).name('Wind Speed X'); 
gui.add(controls, 'Vz', -5, 5).name('Wind Speed Z'); 

function literial_Force()
{
    let literialX  = 0.5*1.225*Math.PI * balloon_raduis**(2) *controls.Vx * balloon_constant ; 
  
    let literialZ =  0.5*1.225*Math.PI * balloon_raduis**(2)*controls.Vz * balloon_constant; 
    
    return new THREE.Vector3(literialX , 0 ,literialZ ) ; 
}

function Drag_Force(Velocity)
{
  if (velocity.y>= 0 )
  {
    var Drag_F  = new THREE.Vector3( 0, -1 * 0.5 * densityC * (Math.PI * balloon_raduis**2) * (Velocity.length() **2)* balloon_constant,0 )
  }else
  {
    var Drag_F  = new THREE.Vector3( 0, 0.5 * densityC * (Math.PI * balloon_raduis**2) * (Velocity.length() **2)* balloon_constant,0 )
  }
  return Drag_F ; 
}
//controll in gaz inside the balloon 
var helium_out = 0 ;
var helium_in = 0  
function onKeyDown(event) 
{
  // Get the key code
  var key = event.key;

  if ((key === 'd' || key === 'D') && ( calculateDensityH(position.y  ) - helium_in + helium_out >0.178 ) ){
      helium_in += 0.05 ; 
  }
  if ((key === 'a' || key === 'A') )
  {
      helium_out +=0.05
  }
  if(key === 'p' || key ==='P' )
  {
    audio1.play()
  }
}

//TO MAKE THE SIMULATION MORE REAL 
const deltatime = 0.01 ; 

function animate() {
    requestAnimationFrame(animate);
    //when we increace the helium so we decreace the density so the balloon will increace its height  
    //when we decrace the helium so we incrace the density so the gravity force will increace then  balloon will increace its height  
    let densityHe = calculateDensityH(position.y  ) - helium_in + helium_out ; 
    densityC = 1.225 - position.y * 0.00000004 ; 
    //Acceleration  
    acceleration.addVectors(buoyancy_Force() ,  gravity_Force(densityHe))
    acceleration.addVectors(acceleration , literial_Force())
    acceleration.addVectors(acceleration , Drag_Force(velocity)).multiplyScalar(1/(skin_mass + (densityHe * balloon_Volume) + payload_mass))  ; ; 
    
    //Velocity
    velocity.addVectors(velocity , acceleration.multiplyScalar(deltatime)) ;
    
    acceleration.multiplyScalar(1/deltatime) ;
        
    position.addVectors(position , velocity.multiplyScalar(deltatime)) ; 
    velocity.multiplyScalar(1/deltatime) ; 
    
    if(position.y < 0)
    {
      position.set(0, 0, 0) 
      acceleration.set(0,0,0) 
      velocity.set(0,0,0)
    }
    balloon.position.copy(position) ; 
    
    // to move the camera around the center of the scene 
    camera.position.x = Math.sin(cursor.x * Math.PI * 2) *60 ; 
    camera.position.z=Math.cos(cursor.x * Math.PI * 2) *60 ; 
    camera.position.y = balloon.position.y ; 
    camera.lookAt(balloon.position) ; 

    
    //Print the values in the screen 
    div.innerHTML =
     'Height ' +  position.y  
     + '<br>' + 'Velocity : ' + parseInt( velocity.length()) 
     + '<br>'+  'Gravity Force : ' +gravity_Force(densityHe).length()  
     + '<br>' +'Buoyancy Force : ' +  buoyancy_Force().length()
     + '<br>' + 'Acceleration : ' + acceleration.y 
     + '<br>' +'density Inside the balloon : ' + densityHe  ;
     
    renderer.render(scene, camera);
}
animate();
