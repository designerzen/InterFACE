$ErrorActionPreference = 'Stop'

$midiSdkVersion = '1.0.17-rc.4.25'
$cppWinRTVersion = '3.0.260715.1'
$midiSdkSha256 = 'D0A420E724154AAF707CBCEEFDE0E355B0B6D9DCD37160F767BFAC6A9C9A86E6'
$cppWinRTSha256 = '10AF2D065445107A4DF80834260B42989AEE213ED65206BE0B776B256517127F'

$repositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$includeDirectory = Join-Path $repositoryRoot 'source/electron/lib/windows-midi-services/sdk/include'
$temporaryRoot = Join-Path ([IO.Path]::GetTempPath()) 'photosynth-windows-midi-sdk'
$midiPackage = Join-Path $temporaryRoot 'midi-sdk.zip'
$cppWinRTPackage = Join-Path $temporaryRoot 'cppwinrt.zip'
$midiDirectory = Join-Path $temporaryRoot 'midi-sdk'
$cppWinRTDirectory = Join-Path $temporaryRoot 'cppwinrt'

New-Item -ItemType Directory -Force -Path $temporaryRoot | Out-Null
New-Item -ItemType Directory -Force -Path $includeDirectory | Out-Null

Invoke-WebRequest `
	-Uri "https://github.com/microsoft/MIDI/releases/download/rc-4/Microsoft.Windows.Devices.Midi2.$midiSdkVersion.nupkg" `
	-OutFile $midiPackage
Invoke-WebRequest `
	-Uri "https://api.nuget.org/v3-flatcontainer/microsoft.windows.cppwinrt/$cppWinRTVersion/microsoft.windows.cppwinrt.$cppWinRTVersion.nupkg" `
	-OutFile $cppWinRTPackage

if ((Get-FileHash $midiPackage -Algorithm SHA256).Hash -ne $midiSdkSha256) {
	throw 'Microsoft Windows MIDI Services SDK checksum mismatch'
}
if ((Get-FileHash $cppWinRTPackage -Algorithm SHA256).Hash -ne $cppWinRTSha256) {
	throw 'Microsoft C++/WinRT checksum mismatch'
}

Expand-Archive -LiteralPath $midiPackage -DestinationPath $midiDirectory -Force
Expand-Archive -LiteralPath $cppWinRTPackage -DestinationPath $cppWinRTDirectory -Force

$cppWinRT = Join-Path $cppWinRTDirectory 'bin/cppwinrt.exe'
$midiWinMD = Join-Path $midiDirectory 'ref/native/Microsoft.Windows.Devices.Midi2.winmd'
& $cppWinRT -input $midiWinMD sdk -output $includeDirectory
if ($LASTEXITCODE -ne 0) { throw "C++/WinRT projection generation failed with exit code $LASTEXITCODE" }

$initializationSource = Join-Path $midiDirectory 'build/native/include/winmidi/init/Microsoft.Windows.Devices.Midi2.Initialization.hpp'
$initializationDirectory = Join-Path $includeDirectory 'winmidi/init'
New-Item -ItemType Directory -Force -Path $initializationDirectory | Out-Null
Copy-Item -LiteralPath $initializationSource -Destination $initializationDirectory -Force

$requiredHeaders = @(
	'winrt/Microsoft.Windows.Devices.Midi2.h',
	'winmidi/init/Microsoft.Windows.Devices.Midi2.Initialization.hpp'
)
foreach ($header in $requiredHeaders) {
	if (!(Test-Path (Join-Path $includeDirectory $header))) { throw "SDK preparation did not create $header" }
}

Write-Host "Prepared Windows MIDI Services SDK $midiSdkVersion using C++/WinRT $cppWinRTVersion"
