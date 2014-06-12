var scene, camera, renderer, light, controls, ray;
var keys=[];


//mapObjects
var objects = [];

//player
var playerG = new THREE.BoxGeometry(5,5,5);
var playerM = new THREE.MeshNormalMaterial();
var playerMesh = new THREE.Mesh(playerG,playerM);

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
    
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth-2,window.innerHeight-2);
    document.body.appendChild(renderer.domElement);
   
    controls.initiateF();
    mapMake();
    loopState = true;
    scene.add(playerMesh);
	
        
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

//map loop
function loopP(){
	if( controls.getObjects().position.z <= -173 && controls.getObjects().position.x > 29){
			controls.getObjects().position.x = 0;
			controls.getObjects().position.z = 100;
		}
		
		if(loopState){
			if(controls.getObjects().position.z > 122){
				velocity.z =0;
				controls.getObjects().position.z = 122;
			}
		}
}

var fiveRoom = new THREE.BoxGeometry(25,25,25);
var tenRoom = new THREE.BoxGeometry(50,50,50);
var hallway = new THREE.BoxGeometry(10,50,100);
var bathRoom = new THREE.BoxGeometry(15,25,25);
var flatGeo = new THREE.PlaneGeometry(20,20);

var redMat = new THREE.MeshLambertMaterial({color:0xff0000, side:THREE.DoubleSide});
var grayMat = new THREE.MeshLambertMaterial({color:0xffffff, side:THREE.DoubleSide});
var greenMat = new THREE.MeshLambertMaterial({color:0x03e3e0, side:THREE.DoubleSide});
var yellowMat = new THREE.MeshLambertMaterial({color:0xaaf100 , side:THREE.DoubleSide});
var blueMat = new THREE.MeshLambertMaterial({color:0x00a1f3, side:THREE.DoubleSide});
var pDouble = new THREE.MeshLambertMaterial({side:THREE.DoubleSide});


init();


//requestAnim
function draw(){
   requestAnimationFrame(draw);
//    checkKey();
 	loopPlayer();
  	colCheck();
    controls.isOnObject( false );

    ray.ray.origin.copy( controls.getObject().position );

    var intersections = ray.intersectObjects( objects );

    if ( intersections.length > 0 ) {

        var distance = intersections[ 0 ].distance;

        if ( distance > 0 && distance < 10 ) {

            controls.isOnObject( true );

        }

    }
   
   if(ray.ray.origin.z == -171 && ray.ray.origin.x > 30){
       ray.ray.position.x = 0;
       ray.ray.position.z = 171;
   }
   
   controls.update();
   
   
   light.position = ray.ray.origin;
   renderer.render(scene,camera);
   
}



draw();

//map make
function mapMake(){
       var MeshRoom1 = new THREE.Mesh(tenRoom,redMat);     
       var MeshRoom2 = new THREE.Mesh(tenRoom,blueMat);
       var MeshRoom3 = new THREE.Mesh(fiveRoom,greenMat);
       var MeshRoom4 = new THREE.Mesh(tenRoom,yellowMat);
       var Meshbath = new THREE.Mesh(bathRoom,blueMat);
       var MeshHallway1 = new THREE.Mesh(hallway,grayMat);
       var MeshHallway2 = new THREE.Mesh(hallway,grayMat);
       
       scene.add(MeshRoom1);
       scene.add(MeshRoom2);
       scene.add(MeshRoom3);
       scene.add(MeshRoom4);
       scene.add(Meshbath);
       scene.add(MeshHallway1);
       scene.add(MeshHallway2);
       
       MeshRoom1.position.y = 31.7;
       
       MeshRoom2.position.x = 50;
       MeshRoom2.position.y = 31.7;
       
       MeshRoom3.position.x = 87.5;
       MeshRoom3.position.z = -57.5;
       MeshRoom3.position.y = 19;
       
       MeshRoom4.position.x = 50;
       MeshRoom4.position.z = -50;
       MeshRoom4.position.y = 31.7;
       
       MeshHallway1.position.y = 31.7;
       MeshHallway1.position.z = 75;
       
       MeshHallway2.position.y = 31.7;
       MeshHallway2.position.z = -125;
       MeshHallway2.position.x = 31;
       
       Meshbath.position.y = 18.7;
       Meshbath.position.z = -37.5;
       
       objects.push(MeshRoom1);
       objects.push(MeshRoom2);
       objects.push(MeshRoom3);
       objects.push(MeshRoom4);
       objects.push(Meshbath);
       objects.push(MeshHallway1);
       objects.push(MeshHallway1);


}



// window.addEventListener("keydown",function(e){
//     keys[e.keyCode]=true;
// });
// window.addEventListener("keyup",function(e){
//     keys[e.keyCode]=false;
// });

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
	if(loopState){
		if(playerMesh.position.z <= -170 && playerMesh.position.x > 25){
			controls.getObject().position.x=0;
			controls.getObject().position.z=120;
		}
	}
}