renderer = new THREE.WebGLRenderer({
	canvas: document.getElementById( "overlay" ),
	alpha: true
});

camera = new THREE.PerspectiveCamera( 45, 1, 0.1, 2000 );
camera.position.x = videoWidth / 2;
camera.position.y = -videoHeight / 2;
camera.position.z = -( videoHeight / 2 ) / Math.tan( 45 / 2 ); // distance to z should be tan( fov / 2 )

scene = new THREE.Scene();
scene.add( new THREE.AmbientLight( 0xcccccc, 0.4 ) );
camera.add( new THREE.PointLight( 0xffffff, 0.8 ) );
scene.add( camera );

camera.lookAt( { x: videoWidth / 2, y: -videoHeight / 2, z: 0, isVector3: true } );