$ErrorActionPreference = 'Stop'

$midiSdkVersion = '0.99.92-preview.11'
$cppWinRTVersion = '3.0.260715.1'
$midiSdkSha256 = '13AFC6E6DA2ADAC309AB8C174352F46F1C0EBE2D79E65475BD6274DEFB73DF74'
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
	-Uri "https://github.com/microsoft/MIDI/releases/download/inbox-preview-11/Windows.Devices.Midi2.$midiSdkVersion.nupkg" `
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
$midiWinMD = Join-Path $midiDirectory 'ref/native/Windows.Devices.Midi2.winmd'
& $cppWinRT -input $midiWinMD sdk -output $includeDirectory
if ($LASTEXITCODE -ne 0) { throw "C++/WinRT projection generation failed with exit code $LASTEXITCODE" }

$requiredHeaders = @(
	'winrt/Windows.Devices.Midi2.h',
	'winrt/Windows.Devices.Midi2.Enumeration.h'
)
foreach ($header in $requiredHeaders) {
	if (!(Test-Path (Join-Path $includeDirectory $header))) { throw "SDK preparation did not create $header" }
}

Write-Host "Prepared Windows MIDI Services SDK $midiSdkVersion using C++/WinRT $cppWinRTVersion"
Write-Host 'Targets the Windows-provided API; no preview runtime binaries are redistributed.'
