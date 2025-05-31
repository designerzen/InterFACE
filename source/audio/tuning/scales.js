/**
 * 
C Ionian (major) — CDEFGABC
(intervals: Whole - Whole - Half - Whole - Whole - Whole - Half)

D Dorian — DEFGABCD
(intervals: Whole - Half - Whole - Whole - Whole - Half - Whole)

E Phrygian — EFGABCDE
(intervals: Half - Whole - Whole - Whole - Half - Whole - Whole)

F Lydian — FGABCDEF
(intervals: Whole - Whole - Whole - Half - Whole - Whole - Half)

G Mixolydian — GABCDEFG
(intervals: Whole - Whole - Half - Whole - Whole - Half - Whole)

A Aeolian (minor) — ABCDEFGA
(intervals: Whole - Half - Whole - Whole - Half - Whole - Whole)

B Locrian — BCDEFGAB
(intervals: Half - Whole - Whole - Half - Whole - Whole - Whole)
 */

// Heavily inspired by Apotome

// "African","Arabic","Chinese","Columbian","Greek","Indian","Indonesian","Japanese","Mexican","Persian","Peruvian","Singaporean","Spanish","Thai","Turkish","User","Western Experimental","Western Historical"
// ["tonic","primary","secondary"]

// ["C","C#","Db","D","D#","Eb","E","F","F#","Gb","G","G#","Ab","A","A#","Bb","B"]
export const SCALE_NAMES = {
	solfege:["Do","Do #","Re","Re #","Mi","Fa","Fa #","Sol","Sol #","La","La #","Si"], 
	// solfege:["Do","Do #","Re b","Re","Re #","Mi b","Mi","Fa","Fa #","Sol b","Sol","Sol #","La b","La","La #","Si b","Si"],
	northIndian:["Sa","Re -","Re -","Re","G\u0101 -","G\u0101 -","G\u0101","M\u0101","M\u0101 +","M\u0101 +","P\u0101","Dh\u0101 -","Dh\u0101 -","Dh\u0101","N\u012b -","N\u012b -","N\u012b"],
	southIndian:["Sa","Ri -","Ri -","Ri","Ri +","G\u0101 -","G\u0101","M\u0101","M\u0101 +","M\u0101 +","Pa","Dh\u0101 -","Dh\u0101 -","Dha","Dha +","Ni -","Ni"],
	german:["C","Cis","Des","D","Dis","Es","E","F","Fis","Ges","G","Gis","As","A","Ais","B","H"],
	dutch:["C","Cis","Des","D","Dis","Es","E","F","Fis","Ges","G","Gis","As","A","Ais","Bes","B"],
	japanese:["Ha","Ei-ha","Hen-ni","Ni","Ei-ni","Hen-ho","Ho","He","Ei-he","Hen-to","To","Ei-to","Hen-i","I","Ei-i","Hen-ro","Ro"],
	javanese:["Ji","Ji +","Ji + ","Ro","Ro +","Ro +","Lu","Pat","Pat +","Pat +","Ma","Ma +","Ma +","Nem","Nem +","Nem +","Pi"],
	byzantine:["Ni","Ni #","Pa b","Pa","Pa #","Vu b","Vu","Ga","Ga #","Di b","Di","Di #","Ke b","Ke","Ke #","Zo b","Zo"]
}

// renamed white notes
export const SOLFEGE_SCALE = ['Doe', 'Ray', 'Me', 'Far', 'Sew', 'La', 'Tea' ]

// major: [2, 2, 3, 2, 3],
// minor: [3, 2, 2, 3, 2],
// blues: [3, 2, 1, 3, 2],
// dorian: [2, 3, 2, 2, 3],
// mixolydian: [2, 2, 3, 2, 3],
// phrygian: [1, 3, 2, 3, 2],
// ["harmonic-minor"]: [2, 1, 3, 2, 3],
// ["melodic-minor"]: [2, 3, 2, 2, 3],


// =============================================================================

// there are different scales with custom tunings
// there are more out there but these are the classics
export const TUNING_MODE_IONIAN = 'ionian'
export const TUNING_MODE_DORIAN = 'dorian'
export const TUNING_MODE_PHRYGIAN = 'phrygian'
export const TUNING_MODE_LYDIAN = 'lydian'
export const TUNING_MODE_MIXOLYDIAN = 'mixolydian'
export const TUNING_MODE_AEOLIAN = 'aeolian'
export const TUNING_MODE_LOCRIAN = 'locrian'

export const TUNING_MODE_NAMES = [
	TUNING_MODE_IONIAN,			// Same as major
	TUNING_MODE_DORIAN,			// Start from second degree of major
	TUNING_MODE_PHRYGIAN,		// Start from third degree of major
	TUNING_MODE_LYDIAN,			// Start from fourth degree of major
	TUNING_MODE_MIXOLYDIAN,		// Start from fifth degree of major
	TUNING_MODE_AEOLIAN,		// Start from sixth degree (same as natural minor)
	TUNING_MODE_LOCRIAN			// Start from seventh degree
]

export const getModeAsIntegerOffset = (mode) => isNaN(parseInt(mode)) ? TUNING_MODE_NAMES.indexOf(mode) : mode
  
export const C_SCALE =  ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
export const C_MAJOR = ["C","D","E","F","G","A","B"]

export const MAJOR_SCALE = [0,2,4,5,7,9,11]
export const NATURAL_MINOR_SCALE = [0,2,3,5,7,8,10]
export const HARMONIC_MINOR_SCALE = [0,2,3,5,7,8,11]
export const MELODIC_MINOR_SCALE = [0,2,3,5,7,9,11]

export const SCALES_NAMES = [
	"MAJOR_SCALE",
	"NATURAL_MINOR_SCALE",
	"HARMONIC_MINOR_SCALE",
	"MELODIC_MINOR_SCALE"
]

export const SCALES = [
	MAJOR_SCALE,
	NATURAL_MINOR_SCALE,
	HARMONIC_MINOR_SCALE,
	MELODIC_MINOR_SCALE
]

// inspired by https://www.guitarland.com/MusicTheoryWithToneJS/PlayModes.html
export const makeScaleMode = (notesInScale, tuningModeIndex) => {

	const notes = []

	for(let i=0; i<notesInScale.length; i++) 
	{
		const scaleIndex = (i+tuningModeIndex) % notesInScale.length
		notes.push(notesInScale[scaleIndex])
	}
	console.info("makeScaleMode="+TUNING_MODE_NAMES[tuningModeIndex]+" notes="+notes.toString())
	return notes
}

/**
 * 
 * @param {Array<Number>} parentScaleFormula 
 * @param {Number|String} mode 
 * @returns {Array} of intervals
 */
export const createScaleModeIntervalsFormula = (parentScaleFormula, mode) => {
  
  const modeFormula = []
  const modeAsIndex = getModeAsIntegerOffset(mode)
  let scaleIndex = 0
  let modeInterval

  if (modeAsIndex < 0)
  {
	throw Error("Invalid tuning mode "+modeAsIndex)
  }

  for(let i=0; i<parentScaleFormula.length; i++) 
  {
	scaleIndex = (i+modeAsIndex) % parentScaleFormula.length
	modeInterval = (parentScaleFormula[scaleIndex] - parentScaleFormula[modeAsIndex] +12) % 12
	modeFormula.push(modeInterval)
  }

  console.log("makeScaleModeFormula="+TUNING_MODE_NAMES[modeAsIndex]+" formula="+modeFormula.toString())
  return modeFormula
}


const addOctave = (note, howManyOctaves) => {
    const octaveChange = Number(howManyOctaves)
    const noteName = note.substring(0 , note.length-1)
    const startingOctave = note.substring(note.length-1, note.length)
    const correctNameAndOctave = noteName.concat((Number(startingOctave)+octaveChange).toString()) 
    return correctNameAndOctave
}

// var octaveNote = addOctave(myMode[0], 1)

const convertFormulaToNotes = (formula, scale=C_SCALE) => formula.map( note => scale[note%scale.length] )
// const mode = makeScaleMode(Cmajor, 4) // mode=mixolydian notes=G,A,B,C,D,E,F

const modeFormula = createScaleModeIntervalsFormula(MAJOR_SCALE, TUNING_MODE_IONIAN )
// const modeFormula = createScaleModeIntervalsFormula(MAJOR_SCALE, TUNING_MODE_NAMES[0] )
console.error("modeFormula", TUNING_MODE_NAMES[0], modeFormula)
// outputs to console: 'mode=mixolydian formula=0,2,4,5,7,9,10'

SCALES.map( scale => console.error(`(${scale}, TUNING_MODE_MAJOR )`, convertFormulaToNotes( createScaleModeIntervalsFormula(scale, TUNING_MODE_IONIAN ) ) ) )
SCALES.map( scale => console.error(`(${scale}, TUNING_MODE_DORIAN )`, convertFormulaToNotes( createScaleModeIntervalsFormula(scale, TUNING_MODE_DORIAN ) ) ) )
SCALES.map( scale => console.error(`(${scale}, TUNING_MODE_PHRYGIAN )`, convertFormulaToNotes( createScaleModeIntervalsFormula(scale, TUNING_MODE_PHRYGIAN ) ) ) )
SCALES.map( scale => console.error(`(${scale}, TUNING_MODE_LYDIAN )`, convertFormulaToNotes( createScaleModeIntervalsFormula(scale, TUNING_MODE_LYDIAN ) ) ) )
SCALES.map( scale => console.error(`(${scale}, TUNING_MODE_MIXOLYDIAN )`, convertFormulaToNotes( createScaleModeIntervalsFormula(scale, TUNING_MODE_MIXOLYDIAN ) ) ) )
SCALES.map( scale => console.error(`(${scale}, TUNING_MODE_AEOLIAN )`, convertFormulaToNotes( createScaleModeIntervalsFormula(scale, TUNING_MODE_AEOLIAN ) ) ) )
SCALES.map( scale => console.error(`(${scale}, TUNING_MODE_LOCRIAN )`, convertFormulaToNotes( createScaleModeIntervalsFormula(scale, TUNING_MODE_LOCRIAN ) ) ) )

// console.error("(MAJOR_SCALE, TUNING_MODE_DORIAN )", convertFormulaToNotes( createScaleModeIntervalsFormula(MAJOR_SCALE, TUNING_MODE_DORIAN ) ) )
// console.error("(MAJOR_SCALE, TUNING_MODE_PHRYGIAN )", convertFormulaToNotes( createScaleModeIntervalsFormula(MAJOR_SCALE, TUNING_MODE_PHRYGIAN ) ) )
// console.error("(MAJOR_SCALE, TUNING_MODE_LYDIAN )", convertFormulaToNotes( createScaleModeIntervalsFormula(MAJOR_SCALE, TUNING_MODE_LYDIAN ) ) )
// console.error("(MAJOR_SCALE, TUNING_MODE_MIXOLYDIAN )", convertFormulaToNotes( createScaleModeIntervalsFormula(MAJOR_SCALE, TUNING_MODE_MIXOLYDIAN ) ) )
// console.error("(MAJOR_SCALE, TUNING_MODE_AEOLIAN )", convertFormulaToNotes( createScaleModeIntervalsFormula(MAJOR_SCALE, TUNING_MODE_AEOLIAN ) ) )
// console.error("(MAJOR_SCALE, TUNING_MODE_LOCRIAN )", convertFormulaToNotes( createScaleModeIntervalsFormula(MAJOR_SCALE, TUNING_MODE_LOCRIAN ) ) )


// TESTS
// C D E F G A B (C) - Major (Ionian)
// D E F G A B C (D) - Dorian
// E F G A B C D (E) - Phrygian
// F G A B C D E (F) - Lydian
// G A B C D E F (G) - Mixolydian
// A B C D E F G (A) - Aeolian
// B C D E F G A (B) - Locrian

// =============================================================================






var MIDI_SHARP_NAMES = ['B#_0',  'C#_1', 'Cx_1', 'D#_1',   'E_1',  'E#_1',  'F#_1', 'Fx_1',  'G#_1', 'Gx_1', 'A#_1', 'B_1',
                    'B#_1', 'C#0', 'Cx0', 'D#0', 'E0', 'E#0', 'F#0', 'Fx0', 'G#0', 'Gx0', 'A#0', 'B0',
                    'B#0', 'C#1', 'Cx1', 'D#1', 'E1', 'E#1', 'F#1', 'Fx1', 'G#1', 'Gx1', 'A#1', 'B1',
                    'B#1', 'C#2', 'Cx2', 'D#2', 'E2', 'E#2', 'F#2', 'Fx2', 'G#2', 'Gx2', 'A#2', 'B2',
                    'B#2', 'C#3', 'Cx3', 'D#3', 'E3', 'E#3', 'F#3', 'Fx3', 'G#3', 'Gx3', 'A#3', 'B3',
                    'B#3', 'C#4', 'Cx4', 'D#4', 'E4', 'E#4', 'F#4', 'Fx4', 'G#4', 'Gx4', 'A#4', 'B4',
                    'B#4', 'C#5', 'Cx5', 'D#5', 'E5', 'E#5', 'F#5', 'Fx5', 'G#5', 'Gx5', 'A#5', 'B5',
                    'B#5', 'C#6', 'Cx6', 'D#6', 'E6', 'E#6', 'F#6', 'Fx6', 'G#6', 'Gx6', 'A#6', 'B6',
                    'B#6', 'C#7', 'Cx7', 'D#7', 'E7', 'E#7', 'F#7', 'Fx7', 'G#7', 'Gx7', 'A#7', 'B7',
                    'B#7', 'C#8', 'Cx8', 'D#8', 'E8', 'E#8', 'F#8', 'Fx8', 'G#8', 'Gx8', 'A#8', 'B8',
                    'B#8', 'C#9', 'Cx9', 'D#9', 'E9', 'E#9', 'F#9', 'Fx9'];
                          

var MIDI_FLAT_NAMES = ['C_1', 'Db_1', 'D_1', 'Eb_1', 'Fb_1', 'F_1', 'Gb_1', 'G_1', 'Ab_1', 'A_1', 'Bb_1', 'Cb0',
                    'C0', 'Db0', 'D0', 'Eb0', 'Fb0', 'F0', 'Gb0', 'G0', 'Ab0', 'A0', 'Bb0', 'Cb1',
                    'C1', 'Db1', 'D1', 'Eb1', 'Fb1', 'F1', 'Gb1', 'G1', 'Ab1', 'A1', 'Bb1', 'Cb2',
                    'C2', 'Db2', 'D2', 'Eb2', 'Fb2', 'F2', 'Gb2', 'G2', 'Ab2', 'A2', 'Bb2', 'Cb3',
                    'C3', 'Db3', 'D3', 'Eb3', 'Fb3', 'F3', 'Gb3', 'G3', 'Ab3', 'A3', 'Bb3', 'Cb4',
                    'C4', 'Db4', 'D4', 'Eb4', 'Fb4', 'F4', 'Gb4', 'G4', 'Ab4', 'A4', 'Bb4', 'Cb5',
                    'C5', 'Db5', 'D5', 'Eb5', 'Fb5', 'F5', 'Gb5', 'G5', 'Ab5', 'A5', 'Bb5', 'Cb6',
                    'C6', 'Db6', 'D6', 'Eb6', 'Fb6', 'F6', 'Gb6', 'G6', 'Ab6', 'A6', 'Bb6', 'Cb7',
                    'C7', 'Db7', 'D7', 'Eb7', 'Fb7', 'F7', 'Gb7', 'G7', 'Ab7', 'A7', 'Bb7', 'Cb8',
                    'C8', 'Db8', 'D8', 'Eb8', 'Fb8', 'F8', 'Gb8', 'G8', 'Ab8', 'A8', 'Bb8', 'Cb9',
                    'C9', 'Db9', 'D9', 'Eb9', 'Fb9', 'F9', 'Gb9', 'G9'];

function noteNameToMIDI(noteName)  {
    var i;
    var MIDInumber = -1; // default if not found
    // check all three arrays for the nameName
    for(i=0; i < MIDI_SHARP_NAMES.length; i++) {
        if( noteName == MIDI_SHARP_NAMES[i] ||
                noteName == MIDI_FLAT_NAMES[i] ) {
            MIDInumber = i;  // found it
        }
    }
    return Number(MIDInumber); // it should be a number already, but...
}


var rootNameForMinorScale = {
    "E#": "F",
    "B#": "C",
    "Fx": "G",
    "Cb": "B",
    "Cx": "D",
    "Gx": "A",
    "Db": "C#",
    "Gb": "F#",
    "Ab": "G#"
};

var scaleNameToFormula = {
    "major": MAJOR_SCALE,
    "natural_minor": NATURAL_MINOR_SCALE,
    "melodic_minor": MELODIC_MINOR_SCALE,
    "harmonic_minor": HARMONIC_MINOR_SCALE,
};

function makeScale(scaleFormula, keyNameAndOctave) {
	var ALPHA_NAMES = ['A','B','C','D','E','F','G'];
	var startingName = keyNameAndOctave;
	var offset;
	for(var i=0; i<ALPHA_NAMES.length; i++) {
		if(startingName.includes(ALPHA_NAMES[i])) {
			offset = i;
			break;
		}
	}
	var startingNote = noteNameToMIDI(keyNameAndOctave);
	var myScaleFormula = scaleFormula;
	var myScale = [];
	for(var i=0; i < myScaleFormula.length; i++) {
//	    console.log("MIDI_FLAT_NAMES[myScaleFormula["+i+"] + "+startingNote+"]="+MIDI_FLAT_NAMES[myScaleFormula[i] + startingNote]);
	    
		if(MIDI_SHARP_NAMES[myScaleFormula[i] + startingNote].includes(ALPHA_NAMES[(offset+i) % ALPHA_NAMES.length])) {
			myScale.push( MIDI_SHARP_NAMES[myScaleFormula[i] + startingNote] );
		} else if(MIDI_FLAT_NAMES[myScaleFormula[i] + startingNote].includes(ALPHA_NAMES[(offset+i) % ALPHA_NAMES.length])) {
			myScale.push( MIDI_FLAT_NAMES[myScaleFormula[i] + startingNote] );
		} else {
			myScale.push("C7"); // high note used to indicate error
		}
	}
	return myScale;
}

function makeModeFormula(parentScaleFormula, modeNum) {
    var scaleIndex = 0;
    var modeFormula = [];
    var modeInterval;
    for(var i=0; i<parentScaleFormula.length; i++) {
        scaleIndex = (i+modeNum) % parentScaleFormula.length;
        modeInterval = (parentScaleFormula[scaleIndex] - parentScaleFormula[modeNum] +12) % 12;
        modeFormula.push(modeInterval);
    }
//    console.log("parentScaleFormula="+parentScaleFormula+" modeFormula="+modeFormula);
    return modeFormula;
}


function setUpAndPlayMode(){
    var keyNameMenu = document.getElementById("key");
    var keyName = keyNameMenu.options[keyNameMenu.selectedIndex].value;

    var modeNumMenu = document.getElementById("mode");
    var modeNum = Number(modeNumMenu.options[modeNumMenu.selectedIndex].value);

    var scaleTypeMenu = document.getElementById("scaleType");
    var scaleType = scaleTypeMenu.options[scaleTypeMenu.selectedIndex].value;

    var patternMenu = document.getElementById("melodicPattern");
    var patternName = patternMenu.options[patternMenu.selectedIndex].value;

    var parentFormula = scaleNameToFormula[scaleType];
    if(scaleType != "major") {
        if(keyName.includes("Cb") || keyName.includes("Db") || 
          keyName.includes("Gb") )  {
           console.log("keyName before="+keyName);
            var octaveNumberString = keyName.substring(keyName.length-1,keyName.length);
            var newName = rootNameForMinorScale[keyName.substring(0 , keyName.length-1)];
            if(newName == "B") { // changed from Cb, reduce octave by 1
                var octaveNumber = Number(octaveNumberString)-1;
                octaveNumberString = octaveNumber.toString();
            }
            keyName = newName.concat(octaveNumberString);
            console.log("keyName after="+keyName);
        }
    }
    var myParentScale = makeScale(parentFormula, keyName);

    var myModeFormula = makeModeFormula(parentFormula, modeNum);
    var myMode = makeScale(myModeFormula, myParentScale[modeNum]);

    var octaveNote = changeOctave(myMode[0], 1);
    myMode.push(octaveNote);

    document.getElementById("dynamicDisplay").innerHTML = "<h2>Parent scale: "+keyName.substring(0,keyName.length-1)+" "+scaleType+" mode: "+(modeNum+1)+" <br />Mode notes: "+myMode+"</h2>"
}



/**
 * We want to preload all scales into memory
 */