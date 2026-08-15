{
	"targets": [
		{
			"target_name": "photosynth_windows_midi",
			"sources": ["src/addon.cpp"],
			"include_dirs": [
				"<!@(node -p \"require('node-addon-api').include\")",
				"<(windows_midi_sdk_include)"
			],
			"defines": ["NAPI_CPP_EXCEPTIONS"],
			"cflags_cc!": ["-fno-exceptions"],
			"msvs_settings": {
				"VCCLCompilerTool": {
					"AdditionalOptions": ["/std:c++20", "/EHsc"],
					"ExceptionHandling": 1
				}
			},
			"libraries": ["runtimeobject.lib"]
		}
	],
	"variables": {
		"windows_midi_sdk_include%": "<(module_root_dir)/sdk/include"
	}
}
