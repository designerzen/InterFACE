// Try and work out the emotion of a face



const emotions = [ "angry", "disgust", "fear", "happy", "neutral", "sad", "surprise" ];
let emotionModel = null;

let output = null;
let model = null;

async function predictEmotion( points ) {
	let result = tf.tidy( () => {
		const xs = tf.stack( [ tf.tensor1d( points ) ] );
		return emotionModel.predict( xs );
	});
	let prediction = await result.data();
	result.dispose();
	// Get the index of the maximum value
	let id = prediction.indexOf( Math.max( ...prediction ) );
	return emotions[ id ];
}

async function trackFace() {
	const video = document.querySelector( "video" );
	const faces = await model.estimateFaces( {
		input: video,
		returnTensors: false,
		flipHorizontal: false,
	});
	output.drawImage(
		video,
		0, 0, video.width, video.height,
		0, 0, video.width, video.height
	);

	let points = null;
	faces.forEach( face => {
		// Draw the bounding box
		const x1 = face.boundingBox.topLeft[ 0 ];
		const y1 = face.boundingBox.topLeft[ 1 ];
		const x2 = face.boundingBox.bottomRight[ 0 ];
		const y2 = face.boundingBox.bottomRight[ 1 ];
		const bWidth = x2 - x1;
		const bHeight = y2 - y1;
		drawLine( output, x1, y1, x2, y1 );
		drawLine( output, x2, y1, x2, y2 );
		drawLine( output, x1, y2, x2, y2 );
		drawLine( output, x1, y1, x1, y2 );

		// Add just the nose, cheeks, eyes, eyebrows & mouth
		const features = [
			"noseTip",
			"leftCheek",
			"rightCheek",
			"leftEyeLower1", "leftEyeUpper1",
			"rightEyeLower1", "rightEyeUpper1",
			"leftEyebrowLower", //"leftEyebrowUpper",
			"rightEyebrowLower", //"rightEyebrowUpper",
			"lipsLowerInner", //"lipsLowerOuter",
			"lipsUpperInner", //"lipsUpperOuter",
		];
		points = [];
		features.forEach( feature => {
			face.annotations[ feature ].forEach( x => {
				points.push( ( x[ 0 ] - x1 ) / bWidth );
				points.push( ( x[ 1 ] - y1 ) / bHeight );
			});
		});
	});

	if( points ) {
		let emotion = await predictEmotion( points );
		setText( `Detected: ${emotion}` );
	}
	else {
		setText( "No Face" );
	}

	requestAnimationFrame( trackFace );
}

	// Load Emotion Detection
	emotionModel = await tf.loadLayersModel( 'web/model/facemo.json' );

	trackFace()