var scene, camera, renderer, light, controls, ray, counter=0, blood;
var keys=[];
var truth = '';

var playerMesh;
var dummies = {};
var objects = [];

var fiveRoom = new THREE.BoxGeometry(25,25,25);
var hRoom = new THREE.BoxGeometry(100,100,100);
var tenRoom = new THREE.BoxGeometry(50,50,50);
var hallway = new THREE.BoxGeometry(10,50,100);
var bathRoom = new THREE.BoxGeometry(15,25,25);
var flatGeo = new THREE.PlaneGeometry(20,20);

var redMat = new THREE.MeshLambertMaterial({color:0xff0000, side:THREE.DoubleSide});
var grayMat = new THREE.MeshLambertMaterial({color:0xffffff, side:THREE.DoubleSide});
var greenMat = new THREE.MeshLambertMaterial({color:0x03e3e0, side:THREE.DoubleSide});
var yellowMat = new THREE.MeshLambertMaterial({color:0xaaf100 , side:THREE.DoubleSide});
var blueMat = new THREE.MeshLambertMaterial({color:0x00a1f3, side:THREE.DoubleSide});
var oMat = new THREE.MeshLambertMaterial({color:0xe2d302, side:THREE.DoubleSide});
var purMat = new THREE.MeshLambertMaterial({color:0x4e0663, side:THREE.DoubleSide});
var pinkMat = new THREE.MeshLambertMaterial({color:0xfb86c7, side:THREE.DoubleSide});
var pDouble = new THREE.MeshLambertMaterial({side:THREE.DoubleSide});

//mapObjects
var mapobjects, garObjects ;


var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );

var loopState;
var enterances = [];
var colP = false;
var velocityP = 0; //past velocity

//init
function init(){

   
    camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,1,1000);
    
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0xffffff, 0, 750 );
    
    light = new THREE.PointLight(0xffffff);
    scene.add(light);
    
    controls = new THREE.PointerLockControls( camera );
    scene.add( controls.getObject() );
    
    ray = new THREE.Raycaster();
    ray.ray.direction.set( 0, -1,0);
    
    blood = new THREE.Object3D();
	mapobjects = new THREE.Object3D();
	garObjects = new THREE.Object3D();
	
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth-2,window.innerHeight-2);
    document.body.appendChild(renderer.domElement);
   
    //player
    var playerG = new THREE.BoxGeometry(5,5,5);
    var playerM = new THREE.MeshNormalMaterial();
    playerMesh = new THREE.Mesh(playerG,playerM);

    controls.initiateF();
    mapMake();
	garObjects.position.z -= 270;
	garObjects.position.x -= 78;

    loopState = true;

    //bloodmar

    scene.add(playerMesh);


	  
    counter++;
        
}


//PointerLock
var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if ( havePointerLock ) {

    var element = document.body;

    var pointerlockchange = function ( event ) {

        if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

            controls.enabled = true;

            blocker.style.display = 'none';

        } else {

            controls.enabled = false;

            blocker.style.display = '-webkit-box';
            blocker.style.display = '-moz-box';
            blocker.style.display = 'box';

            instructions.style.display = '';

        }

    }

    var pointerlockerror = function ( event ) {

        instructions.style.display = '';

    }

    // Hook pointer lock state change events
    document.addEventListener( 'pointerlockchange', pointerlockchange, false );
    document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
    document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

    document.addEventListener( 'pointerlockerror', pointerlockerror, false );
    document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
    document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

    instructions.addEventListener( 'click', function ( event ) {

        instructions.style.display = 'none';

        // Ask the browser to lock the pointer
        element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

        if ( /Firefox/i.test( navigator.userAgent ) ) {

            var fullscreenchange = function ( event ) {

                if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

                    document.removeEventListener( 'fullscreenchange', fullscreenchange );
                    document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

                    element.requestPointerLock();
                }

            }

            document.addEventListener( 'fullscreenchange', fullscreenchange, false );
            document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

            element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

            element.requestFullscreen();

        } else {

            element.requestPointerLock();

        }

    }, false );

} else {

    instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

}

init();


//requestAnim
function draw(){

  	requestAnimationFrame(draw);

    loopPlayer();
  	colCheck();
	
//     controls.isOnObject( false );

//     ray.ray.origin.copy( controls.getObject().position );

//     var intersections = ray.intersectObjects( objects );

//     if ( intersections.length > 0 ) {

//         var distance = intersections[ 0 ].distance;

//         if ( distance > 0 && distance < 10 ) {

//             controls.isOnObject( true );

//         }

//     }
   
   controls.update();
   
   
   light.position = controls.getObject().position;

   renderer.render(scene,camera);
   
};



draw();

//map make
function mapMake(){
     var MeshRoom1 = new THREE.Mesh(tenRoom,redMat);     
     var MeshRoom2 = new THREE.Mesh(tenRoom,blueMat);
     var MeshRoom3 = new THREE.Mesh(fiveRoom,greenMat);
     var MeshRoom4 = new THREE.Mesh(tenRoom,yellowMat);
     var MeshRoom5 = new THREE.Mesh(hRoom,blueMat);
   var MeshRoom6 = new THREE.Mesh(fiveRoom,purMat);
   var MeshRoom7 = new THREE.Mesh(tenRoom,yellowMat);
   var MeshRoom8 = new THREE.Mesh(tenRoom,pinkMat);
	   
	   
     var Meshbath = new THREE.Mesh(bathRoom,blueMat);
     var MeshHallway1 = new THREE.Mesh(hallway,grayMat);
     var MeshHallway2 = new THREE.Mesh(hallway,grayMat);
     
       
     MeshRoom1.position.y = 31.7;
     
     MeshRoom2.position.x = 50;
     MeshRoom2.position.y = 31.7;
     
     MeshRoom3.position.x = 62.5;
     MeshRoom3.position.z = -87.5;;
     MeshRoom3.position.y = 19;
     
     MeshRoom4.position.x = 50;
     MeshRoom4.position.z = -50;
     MeshRoom4.position.y = 31.7;
	   
	   MeshRoom5.position.y = 56.7;
	   MeshRoom5.position.z = -125;
	   
	   MeshRoom6.position.x = -62.5;
	   MeshRoom6.position.y = 19;
	   MeshRoom6.position.z = -87.5;

     MeshRoom7.position.x = -50;
	   MeshRoom7.position.y = 31.7;
	   MeshRoom7.position.z = -50;
	   
	   MeshRoom8.position.x = -50;
	   MeshRoom8.position.y = 31.7;
	   
	   MeshHallway1.position.y = 31.7;
     MeshHallway1.position.z = 75;
     
     MeshHallway2.position.y = 31.7;
     MeshHallway2.position.z = -225;
     
     Meshbath.position.y = 18.7;
     Meshbath.position.z = -37.5;
     
     objects.push(MeshRoom1);
     objects.push(MeshRoom2);
     objects.push(MeshRoom3);
     objects.push(MeshRoom4);
	 objects.push(MeshRoom5);
	 objects.push(MeshRoom6);
	 objects.push(MeshRoom7);
	 objects.push(MeshRoom8);
     objects.push(Meshbath);
     objects.push(MeshHallway1);
     objects.push(MeshHallway2);
	 
     mapobjects.add(MeshRoom1);
     mapobjects.add(MeshRoom2);
     mapobjects.add(MeshRoom3);
     mapobjects.add(MeshRoom4);
	 mapobjects.add(MeshRoom5);
	 mapobjects.add(MeshRoom6);
	 mapobjects.add(MeshRoom7);
	 mapobjects.add(MeshRoom8);
     mapobjects.add(Meshbath);
     mapobjects.add(MeshHallway1);
     mapobjects.add(MeshHallway2);
	 
	 scene.add(mapobjects)
};

function garbageMake(){
	var gaGeo1 = new THREE.BoxGeometry(2,6,10);
	var gaGeo2 = new THREE.BoxGeometry(10,3,50);
	var gaGeo3 = new THREE.PlaneGeometry(50,10);
	var gaGeo4 = new THREE.PlaneGeometry(2,70);
	
	var gaar = [gaGeo1,gaGeo2,gaGeo3,gaGeo4];
	console.log(gaar);
	var gaMat1 =new THREE.MeshLambertMaterial({color:0xe2d302});
	var gaMat2 = new THREE.MeshNormalMaterial({side:THREE.DoubleSide});
	var gaMat3 = new THREE.MeshNormalMaterial();
	var gaMat4 =new THREE.MeshLambertMaterial({color:0x03e3e0});
	var gaMat5 =new THREE.MeshLambertMaterial({color:0xd2a4f1});
	
	
	var gamaa = [gaMat1, gaMat2, gaMat3, gaMat4, gaMat5];
	
	for(var i = 0; i<counter*10; i++){
	
		var mesh = new THREE.Mesh(gaar[Math.floor(Math.random()*4)], gamaa[Math.floor(Math.random()*5)]);
		mesh.position.x = Math.random()*160;
		mesh.position.y = Math.random()*40+20;
		mesh.position.z = Math.random()*400;
		
		
		mesh.rotation.x = Math.random()*10;
		mesh.rotation.y = Math.random()*10;
		mesh.rotation.z = Math.random()*10;
		
		
		garObjects.add(mesh);
		
		
		scene.add(garObjects);
	}
};

//collision check
function colCheck(){
	var originPoint = playerMesh.position.clone();
	for (var vertexIndex = 0; vertexIndex < playerMesh.geometry.vertices.length; vertexIndex++)
	{		
		var localVertex = playerMesh.geometry.vertices[vertexIndex].clone();
		var globalVertex = localVertex.applyMatrix4( playerMesh.matrix );
		var directionVector = globalVertex.sub( playerMesh.position );

		var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
		var collisionResults = ray.intersectObjects( objects, true );
		
		if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ){ 
			pushOut();
		}
		else{
			colP = false;
		}
	}	
};

//collision
function pushOut(){
	
		
		if(!colP){
			velocityP = controls.velocity();
			colP = true;
		}
		else if(colP){

			if(velocityP.z < 0){
				controls.velocity().z = Math.max(0,controls.velocity().z);
			}
			if(velocityP.z > 0){
				controls.velocity().z = Math.min(0,controls.velocity().z);
			}
			if(velocityP.x > 0){
				controls.velocity().x = Math.min(0,controls.velocity().x);
			}
			if(velocityP.x < 0){
				controls.velocity().x = Math.max(0,controls.velocity().x);
			}
		}
};


function loopPlayer(){
	
	if(playerMesh.position.z <= -270  && playerMesh.position.x >=-2.5){
		controls.getObject().position.x=0;
		controls.getObject().position.z=120;
		loopState = false;
		garbageMake();
		
		var dummyG = new THREE.BoxGeometry(5,5,5);
		var dummyM = new THREE.MeshNormalMaterial();
		var dummyP = new THREE.Mesh(dummyG, dummyM);
		dummyP.position.y = 20;
		
		scene.add(dummyP);
		scene.add(blood);
		
		counter++;
		

	}

	if(playerMesh.position.z >123 && playerMesh.position.x<2.5){
		if(loopState){
			controls.getObject().position.z = 122.8;
		}
	}
};


//Neon Genesis Evangelion OST 3 - Do you Love Me?
