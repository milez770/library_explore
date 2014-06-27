var scene, camera, renderer, light, controls, ray, counterr=0, dummyposition = 0, dummyP, talking= false, roomChange, dummies, playerMesh, trueObj;
var keys=[];
var truth = '';
var theText='a';
var goThrough = false;
var objects = [];
var Croom = [];
var audioarr = [];
var Proom = '';
var Wasd = ''
var Textmesh;
var theTrueRoom;
var gameEnd= false;

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
    
	dummies = new THREE.Object3D();
	mapobjects = new THREE.Object3D();
	garObjects = new THREE.Object3D();
	trueObj = new THREE.Object3D();
	
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth-2,window.innerHeight-2);
    document.body.appendChild(renderer.domElement);
   
    //player
    var playerG = new THREE.BoxGeometry(5,5,5);
    var playerM = new THREE.MeshNormalMaterial();
    playerMesh = new THREE.Mesh(playerG,playerM);

	var dummyG = new THREE.BoxGeometry(5,5,5);
	var dummyM = new THREE.MeshNormalMaterial();
	dummyP = new THREE.Mesh(dummyG, dummyM);

    controls.initiateF();
    mapMake();
	garObjects.position.z =0;
	garObjects.position.x =0;

    loopState = true;
   var backMu = new Audio();
	backMu.addEventListener('ended',function(){
		 this.currentTime = 0;
  		 this.play();
		}, false);
		backMu.src='./source/metro-interior-2.mp3';
		backMu.play();
   var textmat = new THREE.MeshNormalMaterial();
	
	textG = new THREE.TextGeometry(theText,{
		font:'vcr osd mono',
		weight:'normal', 
		size:1,
		curveSegments:1
		
	});
	
	Textmesh = new THREE.Mesh(textG,textmat);
	
	
	
	
	
    scene.add(playerMesh);
	
	
    counterr++;
	
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
  //	colCheck();

	dummyP.rotation.y += 0.01;
	
    controls.isOnObject( false );

    ray.ray.origin.copy( controls.getObject().position );

    var intersections = ray.intersectObjects( objects );

    if ( intersections.length > 0 ) {

        var distance = intersections[ 0 ].distance;

        if ( distance > 0 && distance < 10 ) {
			
            controls.isOnObject( true );
			for(var i = 0; i<Croom.length; i++){
				Croom[i] = false;
			}
			Croom[intersections[0].object.id]=true;
			if(Proom !== intersections[0].object.id){
				roomCheck();
				Proom = intersections[0].object.id;
			}
		
        }
    }

   
   controls.update();
   
   checkDoor();
   
   checkTts();
	
	
	Textmesh.position.y = controls.yo.position.y + 10;
	Textmesh.position.z = controls.yo.position.clone().z+(controls.getDirection().z*20);
	if(controls.getDirection().z<=0){
		Textmesh.position.x = controls.yo.position.x - theText.length/5;
	}
	else if(controls.getDirection().z>0){
		Textmesh.position.x = controls.yo.position.x + theText.length/5;
	}
	
	Textmesh.lookAt(controls.yo.position);
	
	
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
	var gaGeo2 = new THREE.BoxGeometry(10,50,50);
	var gaGeo3 = new THREE.PlaneGeometry(50,10);
	var gaGeo4 = new THREE.PlaneGeometry(2,70);
	
	var gaar = [gaGeo1,gaGeo2,gaGeo3,gaGeo4];
	var gaMat1 =new THREE.MeshLambertMaterial({color:0xe2d302});
	var gaMat2 = new THREE.MeshLambertMaterial({color:0xaaf100});
	var gaMat3 = new THREE.MeshLambertMaterial({color:0xff0000});
	var gaMat4 =new THREE.MeshLambertMaterial({color:0x03e3e0});
	var gaMat5 =new THREE.MeshLambertMaterial({color:0xd2a4f1});
	
	
	var gamaa = [gaMat1, gaMat2, gaMat3, gaMat4, gaMat5];
	
		for(var i = 0; i<counterr*5; i++){
			var mesh = new THREE.Mesh(gaar[Math.floor(Math.random()*4)], gamaa[Math.floor(Math.random()*5)]);
			mesh.position.x = Math.random()*200*(Math.random-0.5);
			mesh.position.y = Math.random()*50+10;
			mesh.position.z = Math.random()*350*(Math.random-0.5);
			
			
			mesh.rotation.x = Math.random()*10;
			mesh.rotation.y = Math.random()*10;
			mesh.rotation.z = Math.random()*10;
			
			var randomLen = Math.random()*Wasd.length;
			
			audioarr[mesh.id] = new Audio();
			audioarr[mesh.id].src ='http://translate.google.com/translate_tts?ie=utf-8&tl=en&q='+Wasd.slice(randomLen,randomLen+100*Math.random());
			
			garObjects.add(mesh);
			
			scene.add(garObjects);
		}
	};





function roomCheck(){
	scene.remove(Textmesh);
	
	var textmat = new THREE.MeshNormalMaterial();
	var intersections = ray.intersectObjects( objects );
	
	var newWasd = Wasd.slice(Math.random()*Wasd.length)
	
		if(Croom[21]==true){
			theText = counterr+'-1th Hallway';
			var audio = new Audio();
				audio.src = "./source/gong.wav";
				audio.play();
		}
		else if(Croom[12]==true){
			theText = 'room of '+counterr+1+newWasd;
		}
		else if(Croom[19]==true){
			theText = 'room of '+counterr+2+newWasd;
		}
		else if(Croom[18]==true){
			theText = 'room of '+counterr+3+newWasd;
		}
		else if(Croom[17]==true){
			theText = 'room of '+counterr+4+newWasd;
		}
		else if(Croom[16]==true){
			theText = 'room of '+counterr+5+newWasd;
		}
		else if(Croom[22]==true){
			theText = counterr+'-2th Hallway';
		}
		else if(Croom[13]==true){
			theText = 'room of '+counterr+6+newWasd;
		}
		else if(Croom[15]==true){
			theText = 'room of '+counterr+7+newWasd;
		}
		else if(Croom[14]==true){
			theText = 'room of '+counterr+8+newWasd;
		}
		else if(Croom[20]==true){
			theText = newWasd+'bathroom';
		}
		else{
			theText = "THE END";
		}
	theText = theText.toString();
	
	textG = new THREE.TextGeometry(theText,{
		font:'vcr osd mono',
		weight:'normal', 
		size:0.5,
		curveSegments:1
		
	});
	
	Textmesh = new THREE.Mesh(textG,textmat);
	textG.verticesNeedUpdate = true;
	textG.elementsNeedUpdate = true;
	textG.buffersNeedUpdate = true;
	textG.dynamic = true
	scene.add(Textmesh);
	Textmesh.scale.z = 0.05;

	
}

function checkDoor(){
	var Cposition = controls.yo.position;
	if((Cposition.x>-5 && Cposition.x<5) && (Cposition.z > 23 && Cposition.z < 26)){
		goThrough = true;
	}
	else if((Cposition.x>-26 && Cposition.x<-22) && (Cposition.z > -24 && Cposition.z < 20)){
		goThrough = true;
	}
	else if((Cposition.x>-74 && Cposition.x<-25) && (Cposition.z > -26 && Cposition.z < -22)){
		goThrough = true;
	}
	else if((Cposition.x>-72 && Cposition.x<-26) && (Cposition.z > -77 && Cposition.z < -73)){
		goThrough = true;
	}
	else if((Cposition.x>25 && Cposition.x<72) && (Cposition.z > -77 && Cposition.z < -73)){
		goThrough = true;
	}
	else if((Cposition.x>25 && Cposition.x<72) && (Cposition.z > -26 && Cposition.z < -22)){
		goThrough = true;
	}
	else if((Cposition.x>21 && Cposition.x<27) && (Cposition.z > -23 && Cposition.z < 23)){
		goThrough = true;
	}
	else if((Cposition.x>-6 && Cposition.x<6) && (Cposition.z > -27 && Cposition.z < -23)){
		goThrough = true;
	}
	else if((Cposition.x>48 && Cposition.x<52) && (Cposition.z > -98 && Cposition.z < -76)){
		goThrough = true;
	}
	else if((Cposition.x>-52 && Cposition.x<-48) && (Cposition.z > -98 && Cposition.z < -76)){
		goThrough = true;
	}
	else if((Cposition.x>-3 && Cposition.x<4) && (Cposition.z > -177 && Cposition.z < -173)){
		goThrough = true;
	}
	else if((Cposition.x>-4 && Cposition.x<4) && (Cposition.z > 123 && Cposition.z < 127)){
		goThrough = true;
	}
	else{
		goThrough = false;
	}
}


function checkTts(){
	for(var i in garObjects.children){
		if(controls.yo.position.distanceTo(garObjects.children[i].position)<150){
			audioarr[garObjects.children[i].id].volume = controls.yo.position.distanceTo(garObjects.children[i].position)/1500;
			audioarr[garObjects.children[i].id].play();
		}
	}	
}

//collision check
function colCheck(){
	var originPoint = playerMesh.position;
		for (var vertexIndex = 0; vertexIndex < playerMesh.geometry.vertices.length; vertexIndex++)
		{		
		var localVertex = playerMesh.geometry.vertices[vertexIndex];
		var globalVertex = localVertex.applyMatrix4( playerMesh.matrix );
		var directionVector = globalVertex.sub( playerMesh.position );

		var ray = new THREE.Raycaster( originPoint, directionVector.normalize() );
		var collisionResults = ray.intersectObjects( objects, true );
		
		if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ){ 
			if(!goThrough){
				  if(collisionResults[0].point.x>0)collisionResults[0].point.x = 1;
				 if(collisionResults[0].point.x<0)collisionResults[0].point.x = -1;
				 if(collisionResults[0].point.z<0)collisionResults[0].point.z = -1;
				 if(collisionResults[0].point.z>0)collisionResults[0].point.z = 1;
				 var x = collisionResults[0].point.x*collisionResults[0].distance;
				 var z = collisionResults[0].point.z*collisionResults[0].distance;
				 controls.yo.position = controls.yo.position.sub(new THREE.Vector3(x,0,z));
				 
			}
		}	
	}
	
};



function loopPlayer(){
	
	if(playerMesh.position.z <= -270  && playerMesh.position.x >=-2.5){
		controls.getObject().position.x=0;
		controls.getObject().position.z=120;
		
		garbageMake();
		
		
		goThrough = false;
		dummyP.position.y = 20;
		
		dummies.add(dummyP);
		scene.add(dummyP);
		
		if(!gameEnd && !loopState){
			noLoopEnd();
			gameEnd = true;
		}
		counterr++;
		
		
	}

	if(playerMesh.position.z >123 && playerMesh.position.x<2.5){
		if(loopState){
			
			controls.getObject().position.z = 122.8;
		}
	}
};

function noLoopEnd(){
	var noLoopG = new THREE.BoxGeometry(200,200,200);
		var noLoopM = new THREE.MeshLambertMaterial({color:0xff8f85, side:THREE.DoubleSide});
		var noLoopMesh = new THREE.Mesh(noLoopG,noLoopM);
		
		noLoopMesh.position.z = 225;
		scene.add(noLoopMesh);
		objects.push(noLoopMesh);
		
		for(var i =1; i<Wasd.length; i++){
			var trueText = new THREE.TextGeometry(Wasd.toString().slice(i-1,i),{
				font:'vcr osd mono',
				weight:'normal', 
				size:1,
				curveSegments:1

			});
			var trueM = new THREE.MeshNormalMaterial();
			var mesh = new THREE.Mesh(trueText,trueM);
			
			mesh.position.x = Math.random()*200*(Math.random()-0.5);
			mesh.position.y = Math.random()*200*(Math.random()-0.5);
			mesh.position.z = Math.random()*200*(Math.random()-0.5)+225;
			
			mesh.scale.z = 0.3;
			theTrueRoom = mesh.id;
			
			objects.push(mesh);
			trueObj.add(mesh);
			
		}
		
		scene.add(trueObj);
		
		
		

}

function talk(){
	if(controls.getObject().position.distanceTo(dummyP.position)<12 && talking == false){
		var audio = new Audio();
		audio.src = './source/computer_noise.mp3';
		audio.play();
		audio.volume = 0.2;
		
		loopState = false;
	}
}

//Neon Genesis Evangelion OST 3 - Do you Love Me?
