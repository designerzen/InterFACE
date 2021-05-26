// webgl for audio visualisuatiom
  
	// Make a buffer to receive the audio data
	const numPoints = analyser.frequencyBinCount
	const audioDataArray = new Uint8Array(numPoints)
	
	const vs = `
	attribute vec4 position;
	void main() {
	  gl_Position = position;
	}
	`
  
	const fs = `
	precision mediump float;
	uniform vec2 resolution;
	uniform sampler2D audioData;
	void main() {
	  vec2 uv = gl_FragCoord.xy / resolution;
	  float fft = texture2D(audioData, vec2(uv.x * 0.25, 0)).r;
	  gl_FragColor = vec4(uv * pow(fft, 5.0), 0, 1);
	}
	`
  
	// shift the canvas into GB context
	const gl = document.querySelector("canvas").getContext("webgl")
	// compiles shaders, link program, look up locations
	const programInfo = twgl.createProgramInfo(gl, [vs, fs]);
	
	const tex = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, tex);
	gl.texImage2D(
	   gl.TEXTURE_2D, 
	   0,            // level
	   gl.LUMINANCE, // internal format
	   numPoints,    // width
	   1,            // height
	   0,            // border
	   gl.LUMINANCE, // format
	   gl.UNSIGNED_BYTE,  // type
	   null);  
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  
	const arrays = {
	  position: {
		numComponents: 2,
		data: [
		  -1, -1,
		   1, -1,
		  -1,  1,
		  -1,  1,
		   1, -1,
		   1,  1,
		],
	  }
	};
	// calls gl.createBuffer, gl.bindBuffer, gl.bufferData
	const bufferInfo = twgl.createBufferInfoFromArrays(gl, arrays);
  
	function render() {
	  gl.useProgram(programInfo.program);
  
	  // get the current audio data
	  analyser.getByteFrequencyData(audioDataArray);
  
	  // upload the audio data to the texture
	  gl.bindTexture(gl.TEXTURE_2D, tex);
	  gl.texSubImage2D(
		 gl.TEXTURE_2D, 
		 0,            // level
		 0,            // x
		 0,            // y
		 numPoints,    // width
		 1,            // height
		 gl.LUMINANCE, // format
		 gl.UNSIGNED_BYTE,  // type
		 audioDataArray);       
  
	  // calls gl.enableVertexAttribArray, gl.bindBuffer, gl.vertexAttribPointer
	  twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
	  // calls gl.activeTexture, gl.bindTexture, gl.uniform
	  twgl.setUniforms(programInfo, {
		audioData: tex,
		resolution: [gl.canvas.width, gl.canvas.height],
	  });
	  // calls gl.drawArrays or gl.drawElements
	  twgl.drawBufferInfo(gl, bufferInfo);
  
	  requestAnimationFrame(render);
	}

	render()