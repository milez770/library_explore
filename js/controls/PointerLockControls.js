THREE.PointerLockControls = function ( camera ) {

	var scope = this;

	camera.rotation.set( 0, 0, 0 );

	var pitchObject = new THREE.Object3D();
	pitchObject.add( camera );

	var yawObject = new THREE.Object3D();
	yawObject.position.y = 10;
	yawObject.add( pitchObject );

	var moveForward = false;
	var moveBackward = false;
	var moveLeft = false;
	var moveRight = false;
	var run = false;

	var isOnObject = false;
	var canJump = false;

	var prevTime = performance.now();

	var velocity = new THREE.Vector3();
	this.vel = velocity;
	this.yo = yawObject
	var PI_2 = Math.PI / 2;

	var onMouseMove = function ( event ) {

		if ( scope.enabled === false ) return;

		var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
		var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

		yawObject.rotation.y -= movementX * 0.002;
		pitchObject.rotation.x -= movementY * 0.002;

		pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );

	};

	var onKeyDown = function ( event ) {
		
		switch ( event.keyCode ) {
			
			case 69:
				talk();
				break;
			
			case 38: // up
			case 87: // w
				moveForward = true;
				Wasd += 'w';
				

				break;

			case 37: // left
			case 65: // a
				moveLeft = true;
				Wasd += 'a';
			    break;

			case 40: // down
			case 83: // s
				moveBackward = true;
				Wasd += 's';
				break;

			case 39: // right
			case 68: // d
				moveRight = true;
				Wasd += 'd';
				break;

			case 32: // space
				if ( canJump === true ) velocity.y += 100;
				canJump = false;
				Wasd += '%20';
				break;
				 
			case 16:
				run = true;
				Wasd += '!';
				break;

		}

	};

	var onKeyUp = function ( event ) {

		switch( event.keyCode ) {
			
			case 38: // up
			case 87: // w
				moveForward = false;
				break;

			case 37: // left
			case 65: // a
				moveLeft = false;
				break;

			case 40: // down
			case 83: // s
				moveBackward = false;
				break;

			case 39: // right
			case 68: // d
				moveRight = false;
				break;
				
			case 16:
				run = false;
				break;

		}

	};

	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );

	this.enabled = false;

	this.getObject = function () {

		return yawObject;

	};

	this.isOnObject = function ( boolean ) {

		isOnObject = boolean;
		canJump = boolean;

	};

	this.getDirection = function() {

	// assumes the camera itself is not rotated

	var direction = new THREE.Vector3( 0, 0, -1 );
	var rotation = new THREE.Euler( 0, 0, 0, "YXZ" );


	return function(  ) {
		var v = yawObject.position.clone();
		rotation.set( pitchObject.rotation.x, yawObject.rotation.y, 0 );

		v.copy( direction ).applyEuler( rotation );

		return v;

	}

	}();
	this.initiateF = function(){
		yawObject.position.x = 0;
		yawObject.position.z = 112;
		yawObject.position.y = 27;
	}
	this.update = function () {

		if ( scope.enabled === false ) return;

		var time = performance.now();
		var delta = ( time - prevTime ) / 1000;

		velocity.x -= velocity.x * 10.0 * delta;
		velocity.z -= velocity.z * 10.0 * delta;

		velocity.y -= 9.8 * 60.0 * delta; // 100.0 = mass

		if ( moveForward ) velocity.z -= 200.0 * delta/5;
		if ( moveBackward ) velocity.z += 200.0 * delta/5;

		if ( moveLeft ) velocity.x -= 200.0 * delta/5;
		if ( moveRight ) velocity.x += 200.0 * delta/5;
		if ( isOnObject === true ) {

			velocity.y = Math.max( 0, velocity.y );
			
		}
		if(run){
			yawObject.translateY( velocity.y * delta );
			yawObject.translateX( velocity.x * delta*4 );
			yawObject.translateZ( velocity.z * delta*4 );
		}
		else if(!run){
			yawObject.translateY( velocity.y * delta );
			yawObject.translateX( velocity.x * delta );
			yawObject.translateZ( velocity.z * delta );
		}
		

		
		
		if ( yawObject.position.y < -500 ) {

			velocity.y = 0;
			yawObject.position.y = 17;
			yawObject.position.x = 0;
			yawObject.position.z = 112;
			canJump = true;

		}
		
		
		playerMesh.position = yawObject.position;
		prevTime = time;

	};

};
