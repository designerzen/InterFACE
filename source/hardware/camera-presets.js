// Camera presets live in their own file so hardware-specific capture modes
// stay separate from camera setup flow.

// The Kiyo X exposes 60 FPS in its standard 720p mode (1280x720).
export const CAMERA_PRESETS = [
	{
		name: "Razer Kiyo X 720p60",
		deviceIds: [
			"8e188e28b6a58e20cd2da3444996a643bb020e3b963fa283d33f502fedac3a27"
		],
		match: /(?:razer\s+kiyo|usb\s+video\s+device\s+\(1532:0e03\))/i,
		video: {
			width: { exact: 1280 },
			height: { exact: 720 },
			frameRate: { ideal: 60, max: 120 }
		}
	}
]
