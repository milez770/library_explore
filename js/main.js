var scene, camera, renderer, light, controls, ray, counter=0, blood;
var keys=[];
var truth = '';

var playerMesh;
var dummies = {};
var objects = [];

var fiveRoom = new THREE.BoxGeometry(25,25,25);


var pinkMat = new THREE.MeshLambertMaterial({color:0xfb86c7, side:THREE.DoubleSide});

//mapObjects
var mapobjects;

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

	
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth-2,window.innerHeight-2);
    document.body.appendChild(renderer.domElement);
   
    //player
    var playerG = new THREE.BoxGeometry(5,5,5);
    var playerM = new THREE.MeshNormalMaterial();
    playerMesh = new THREE.Mesh(playerG,playerM);

    controls.initiateF();
    mapMake();
    //bloodmar

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

init();


//requestAnim
function draw(){

  	requestAnimationFrame(draw);

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

   var MeshRoom8 = new THREE.Mesh(fiveRoom,pinkMat);
	   MeshRoom8.position.y = 21.7;
	   MeshRoom8.position.z = 120;
	 objects.push(MeshRoom8);
	 mapobjects.add(MeshRoom8);
	 scene.add(mapobjects)
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
			console.log(velocityP);
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
