

// https://github.com/bitwig/dawproject

// .dawproject can be raw XML or a zip file
import {
	gzip, zlib, AsyncGzip, zip, unzip, strFromU8,
	Zip, AsyncZipDeflate, Unzip, AsyncUnzipInflate
} from 'fflate'

// This can be an XML file or a ZIP file
export const loadDAWProject = async (file) => {
	const fileResponse = await fetch(file)
	// FIXME: Test to see what the type is, if zip unzip as arrayBuffer
	const arrayBuffer = await fileResponse.arrayBuffer()

	// To use fflate, you need a Uint8Array
	const compressed = new Uint8Array(arrayBuffer)
	const decompressed = fflate.decompressSync(compressed)

	return decompressed
}



/**
 * <Application name="Bitwig Studio" version="5.0"/>
 * @param {XMLDocument} projectElement 
 * @param {String} name 
 * @param {String} version 
 * @returns 
 */
export const createApplicationElement = (projectElement, name="PhotoSYNTH", version="1.0.0") => {
	const applicationElement = projectElement.createElement("Application")
	applicationElement.setAttribute("name", name ?? "Project Title" )
	applicationElement.setAttribute("version", version ?? 0)
	return applicationElement
}

/**
 *  <Transport>
 *      <Tempo max="666.000000" min="20.000000" unit="bpm" value="149.000000" id="id0" name="Tempo"/>
 *      <TimeSignature denominator="4" numerator="4" id="id1"/>
 *  </Transport>
 * @param {XMLDocument} projectElement 
 * @returns 
 */
export const createTransportElement = (projectElement) => {
	const transportElement = projectElement.createElement("Transport")
	return transportElement	
}

/**
 * <Tempo max="666.000000" min="20.000000" unit="bpm" value="149.000000" id="id0" name="Tempo"/>
 */
export const createTempoElement = (transportElement, tempo=90, unit="bpm", maxBPM=300, minBPM=10, id="id", name="Tempo" ) => {
	const tempoElement = transportElement.createElement("Tempo")
	tempoElement.setAttribute("max", maxBPM )
	tempoElement.setAttribute("min", minBPM )
	tempoElement.setAttribute("unit", unit)
	tempoElement.setAttribute("value", tempo)
	tempoElement.setAttribute("id", id)
	tempoElement.setAttribute("name", name )
	return tempoElement
}

/**
 *  <TimeSignature denominator="4" numerator="4" id="id1"/>
 * @param {XMLDocument} transportElement 
 * @param {String|Number} numerator 
 * @param {String|Number} denominator 
 * @returns 
 */
export const createTimeSignatureElement = (transportElement, numerator=4, denominator=4) => {
	const timeSignatureElement = transportElement.createElement("TimeSignature")
	timeSignatureElement.setAttribute("denominator", denominator)
	timeSignatureElement.setAttribute("numerator", numerator)
	timeSignatureElement.setAttribute("id", "id")
	return timeSignatureElement
}

const createStructureElement = (projectElement) => {
	const structureElement = projectElement.createElement("Structure")
	return structureElement
}

/**
 * All options are optional!
 * Title, Artist, Album, OriginalArtist, Composer, Songwriterz,  Producer, Arranger, Year, Genre, Copyright, Website, Comment
  <xs:element name="MetaData" type="metaData"/>
  <xs:complexType name="metaData">
    <xs:sequence>
      <xs:element name="Title" type="xs:string" minOccurs="0"/>
      <xs:element name="Artist" type="xs:string" minOccurs="0"/>
      <xs:element name="Album" type="xs:string" minOccurs="0"/>
      <xs:element name="OriginalArtist" type="xs:string" minOccurs="0"/>
      <xs:element name="Composer" type="xs:string" minOccurs="0"/>
      <xs:element name="Songwriter" type="xs:string" minOccurs="0"/>
      <xs:element name="Producer" type="xs:string" minOccurs="0"/>
      <xs:element name="Arranger" type="xs:string" minOccurs="0"/>
      <xs:element name="Year" type="xs:string" minOccurs="0"/>
      <xs:element name="Genre" type="xs:string" minOccurs="0"/>
      <xs:element name="Copyright" type="xs:string" minOccurs="0"/>
      <xs:element name="Website" type="xs:string" minOccurs="0"/>
      <xs:element name="Comment" type="xs:string" minOccurs="0"/>
    </xs:sequence>
  </xs:complexType>
 */
export const createMetaDataElement = (projectElement, metaData={}) => {
	const metaDataElement = projectElement.createElement("MetaData")
	for (let data in metaData)
	{
		switch(data)
		{
			case "Title":
			case "Artist":
			case "Album":
			case "OriginalArtist":
			case "Composer":
			case "Songwriterz":
			case "Producer":
			case "Arranger":
			case "Year":
			case "Genre":
			case "Copyright":
			case "Website":
			case "Comment":
				const element = metaDataElement.createElement(data)
				element.textContent = metaData[data]
				break
		}
	}

	return metaDataElement
}








const createTrackElement = (structureElement) => {
	const trackElement = structureElement.createElement("Track")
	trackElement.setAttribute("contentType", "notes")
	trackElement.setAttribute("loaded", "true")
	trackElement.setAttribute("id", "id")
	trackElement.setAttribute("name", "Bass")
	trackElement.setAttribute("color", "#a2eabf")

	const channelElement = trackElement.createElement("Channel")
	channelElement.setAttribute("audioChannels", "2")
	channelElement.setAttribute("destination", "id")
	channelElement.setAttribute("role", "regular")
	channelElement.setAttribute("solo", "false")
	channelElement.setAttribute("id", "id")

	const instrumentElement = channelElement.createElement("Instrument")
	instrumentElement.setAttribute("id", "id")
	instrumentElement.setAttribute("name", "Piano")

	const audioElement = instrumentElement.createElement("Audio")
	audioElement.setAttribute("id", "id")
	audioElement.setAttribute("name", "Audio")

	const audioDestinationElement = audioElement.createElement("AudioDestination")		
	audioDestinationElement.setAttribute("id", "id")
	audioDestinationElement.setAttribute("name", "AudioDestination")
}							

const createArrangementElement = (projectElement) => {
	const arrangementElement = projectElement.createElement("Arrangement")
	return arrangementElement
}

const createLanesElement = (parentElement) => {
	const lanesElement = parentElement.createElement("Lanes")
	lanesElement.setAttribute("timeUnit", "beats")
	lanesElement.setAttribute("track", "beats")
	lanesElement.setAttribute("id", "id")

	const lanesTrackElement = lanesElement.createElement("Lanes")
	lanesTrackElement.setAttribute("track", "id")
	lanesTrackElement.setAttribute("id", "id")

	return lanesElement
}

const createScenesElement = (projectElement) => {
	const scenesElement = projectElement.createElement("Scenes")
	return scenesElement
}

/**
 * <Notes id="id23">
	<Note time="0.000000" duration="0.250000" channel="0" key="65" vel="0.787402" rel="0.787402"/>
	<Note time="1.000000" duration="0.250000" channel="0" key="65" vel="0.787402" rel="0.787402"/>
	<Note time="4.000000" duration="0.250000" channel="0" key="65" vel="0.787402" rel="0.787402"/>
	<Note time="5.000000" duration="0.250000" channel="0" key="65" vel="0.787402" rel="0.787402"/>
	<Note time="0.500000" duration="0.250000" channel="0" key="64" vel="0.787402" rel="0.787402"/>
	<Note time="4.500000" duration="0.250000" channel="0" key="64" vel="0.787402" rel="0.787402"/>
	<Note time="1.500000" duration="2.500000" channel="0" key="53" vel="0.787402" rel="0.787402"/>
	<Note time="5.500000" duration="0.250000" channel="0" key="53" vel="0.787402" rel="0.787402"/>
	<Note time="6.000000" duration="2.000000" channel="0" key="53" vel="0.787402" rel="0.787402"/>
</Notes>
*/

/**
 * 
 * @param {XML} notesElement 
 * @param {*} time 
 * @param {*} duration 
 * @param {*} velocity 
 * @param {*} key 
 * @param {*} rel 
 * @param {*} channel 
 */
export const createNoteElement = (notesElement, time, duration, velocity, key, rel, channel="0" ) => {
	const notesElement = notesElement.createElement("Note")
	notesElement.setAttribute( "time", time )
	notesElement.setAttribute( "duration", duration )
	notesElement.setAttribute( "channel", channel )
	notesElement.setAttribute( "key", key )
	notesElement.setAttribute( "vel", velocity )
	notesElement.setAttribute( "rel", rel )
	return notesElement
}

/**
 * 
 * @param {*} trackElement 
 * @param {String} id 
 */
const createNotesElement = (trackElement, id="id" ) => {
	const notesElement = trackElement.createElement("Notes")
	notesElement.setAttribute( "id", id )
	return notesElement
}

/** * Create a new DAW project XML document
 * @param {String} name - Name of the application (e.g., "PhotoSYNTH")
 * @param {String} version - Version of the application (e.g., "1.0.0")
 * @returns {XMLDocument} - A new XML document representing the DAW project
 * @example
 * const project = createDAWProject("PhotoSYNTH", "1.0.0")
 * const projectElement = project.querySelector("Project")
 * const applicationElement = project.querySelector("Application")
 * const transportElement = createTransportElement(projectElement)
 * const tempoElement = createTempoElement(transportElement)
 * const timeSignatureElement = createTimeSignatureElement(transportElement)
 * const notesElement = createNotesElement(projectElement)
 * const noteElement = createNoteElement(notesElement, 0, 1, 1
 */
export const createDAWProject = (name="PhotoSYNTH", version="1.0") => {
	const xml = document.implementation.createDocument(null, "standalone")
	const projectElement = xml.createElement("Project")
	projectElement.setAttribute( "version", version )
	return xml
}

/*
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Project version="1.0">
  <Application name="Bitwig Studio" version="5.0"/>
  
  <Transport>
    <Tempo max="666.000000" min="20.000000" unit="bpm" value="149.000000" id="id0" name="Tempo"/>
    <TimeSignature denominator="4" numerator="4" id="id1"/>
  </Transport>

  <Structure>
    <Track contentType="notes" loaded="true" id="id2" name="Bass" color="#a2eabf">
      <Channel audioChannels="2" destination="id15" role="regular" solo="false" id="id3">
        <Devices>
          <ClapPlugin deviceID="org.surge-synth-team.surge-xt" deviceName="Surge XT" deviceRole="instrument" loaded="true" id="id7" name="Surge XT">
            <Parameters/>
            <Enabled value="true" id="id8" name="On/Off"/>
            <State path="plugins/d19b1f6e-bbb6-42fe-a6c9-54b41d97a05d.clap-preset"/>
          </ClapPlugin>
        </Devices>
        <Mute value="false" id="id6" name="Mute"/>
        <Pan max="1.000000" min="0.000000" unit="normalized" value="0.500000" id="id5" name="Pan"/>
        <Volume max="2.000000" min="0.000000" unit="linear" value="0.659140" id="id4" name="Volume"/>
      </Channel>
    </Track>
    <Track contentType="audio" loaded="true" id="id9" name="Drumloop" color="#b53bba">
      <Channel audioChannels="2" destination="id15" role="regular" solo="false" id="id10">
        <Mute value="false" id="id13" name="Mute"/>
        <Pan max="1.000000" min="0.000000" unit="normalized" value="0.500000" id="id12" name="Pan"/>
        <Volume max="2.000000" min="0.000000" unit="linear" value="0.177125" id="id11" name="Volume"/>
      </Channel>
    </Track>
    <Track contentType="audio notes" loaded="true" id="id14" name="Master">
      <Channel audioChannels="2" role="master" solo="false" id="id15">
        <Mute value="false" id="id18" name="Mute"/>
        <Pan max="1.000000" min="0.000000" unit="normalized" value="0.500000" id="id17" name="Pan"/>
        <Volume max="2.000000" min="0.000000" unit="linear" value="1.000000" id="id16" name="Volume"/>
      </Channel>
    </Track>
  </Structure>

  <Arrangement id="id19">
    <Lanes timeUnit="beats" id="id20">
      <Lanes track="id2" id="id21">
        <Clips id="id22">
          <Clip time="0.0" duration="8.0" playStart="0.0">
            <Notes id="id23">
              <Note time="0.000000" duration="0.250000" channel="0" key="65" vel="0.787402" rel="0.787402"/>
              <Note time="1.000000" duration="0.250000" channel="0" key="65" vel="0.787402" rel="0.787402"/>
              <Note time="4.000000" duration="0.250000" channel="0" key="65" vel="0.787402" rel="0.787402"/>
              <Note time="5.000000" duration="0.250000" channel="0" key="65" vel="0.787402" rel="0.787402"/>
              <Note time="0.500000" duration="0.250000" channel="0" key="64" vel="0.787402" rel="0.787402"/>
              <Note time="4.500000" duration="0.250000" channel="0" key="64" vel="0.787402" rel="0.787402"/>
              <Note time="1.500000" duration="2.500000" channel="0" key="53" vel="0.787402" rel="0.787402"/>
              <Note time="5.500000" duration="0.250000" channel="0" key="53" vel="0.787402" rel="0.787402"/>
              <Note time="6.000000" duration="2.000000" channel="0" key="53" vel="0.787402" rel="0.787402"/>
            </Notes>
          </Clip>
        </Clips>
      </Lanes>
      <Lanes track="id9" id="id24">
        <Clips id="id25">
          <Clip time="0.0" duration="8.00003433227539" playStart="0.0" loopStart="0.0" loopEnd="8.00003433227539" fadeTimeUnit="beats" fadeInTime="0.0" fadeOutTime="0.0" name="Drumfunk3 170bpm">
            <Clips id="id26">
              <Clip time="0.0" duration="8.00003433227539" contentTimeUnit="beats" playStart="0.0" fadeTimeUnit="beats" fadeInTime="0.0" fadeOutTime="0.0">
                <Warps contentTimeUnit="seconds" timeUnit="beats" id="id28">
                  <Audio algorithm="stretch" channels="2" duration="2.823541666666667" sampleRate="48000" id="id27">
                    <File path="audio/Drumfunk3 170bpm.wav"/>
                  </Audio>
                  <Warp time="0.0" contentTime="0.0"/>
                  <Warp time="8.00003433227539" contentTime="2.823541666666667"/>
                </Warps>
              </Clip>
            </Clips>
          </Clip>
        </Clips>
      </Lanes>
      <Lanes track="id14" id="id29">
        <Clips id="id30"/>
      </Lanes>
    </Lanes>
  </Arrangement>

  <Scenes/>

</Project>

*/


// TEST!
const project = createDAWProject("PhotoSYNTH", "1.0.0")
const projectElement = project.querySelector("Project")
const applicationElement = project.querySelector("Application")

const transportElement = createTransportElement(projectElement)
const tempoElement = createTempoElement(transportElement)
const timeSignatureElement = createTimeSignatureElement(transportElement)

const structureElement = createStructureElement(projectElement)

const notesElement = createNotesElement(projectElement)
const noteElement = createNoteElement(notesElement, 0, 1, 1, 0)