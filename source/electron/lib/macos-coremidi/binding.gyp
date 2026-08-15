{
	"targets": [
		{
			"target_name": "photosynth_macos_coremidi",
			"sources": ["src/addon.mm"],
			"include_dirs": ["<!@(node -p \"require('node-addon-api').include\")"],
			"defines": ["NAPI_CPP_EXCEPTIONS"],
			"cflags_cc!": ["-fno-exceptions"],
			"xcode_settings": {
				"CLANG_CXX_LANGUAGE_STANDARD": "c++20",
				"GCC_ENABLE_CPP_EXCEPTIONS": "YES",
				"MACOSX_DEPLOYMENT_TARGET": "11.0",
				"OTHER_CPLUSPLUSFLAGS": ["-fblocks"]
			},
			"libraries": [
				"-framework CoreMIDI",
				"-framework CoreFoundation"
			]
		}
	]
}
