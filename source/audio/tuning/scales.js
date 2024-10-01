// Heavily inspired by Apotome

// "African","Arabic","Chinese","Columbian","Greek","Indian","Indonesian","Japanese","Mexican","Persian","Peruvian","Singaporean","Spanish","Thai","Turkish","User","Western Experimental","Western Historical"
// ["tonic","primary","secondary"]
export const NOTES_ALPHABETICAL = ["Ab","A","Bb","B","C","Db", "D","Eb", "E", "F", "Gb","G"]
// export const NOTES_ALPHABETICAL = ["A","Ab","B","Bb","C","D", "Db","E", "Eb", "F", "G","Gb"]
export const NOTES_ALPHABETICAL_FRIENDLY = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"]

export const NOTES_BLACK = ["Ab", "Bb", "Db", "Eb", "Gb"]
export const NOTES_WHITE = ["A", "B", "C", "D", "E", "F", "G" ]

// ["C","C#","Db","D","D#","Eb","E","F","F#","Gb","G","G#","Ab","A","A#","Bb","B"]
export const SCALE_NAMES = {
	solfege:["Do","Do #","Re b","Re","Re #","Mi b","Mi","Fa","Fa #","Sol b","Sol","Sol #","La b","La","La #","Si b","Si"],
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


// there are different scales with custom tunings
// there are more out there but these are the classics
export const TUNING_MODE_MAJOR = 'major'
export const TUNING_MODE_DORIAN = 'dorian'
export const TUNING_MODE_PHRYGIAN = 'phrygian'
export const TUNING_MODE_LYDIAN = 'lydian'
export const TUNING_MODE_MIXOLYDIAN = 'mixolydian'
export const TUNING_MODE_AEOLIAN = 'aeolian'
export const TUNING_MODE_LOCRIAN = 'locrian'

export const TUNING_MODE_NAMES = [
	TUNING_MODE_MAJOR,
	TUNING_MODE_DORIAN,
	TUNING_MODE_PHRYGIAN,
	TUNING_MODE_LYDIAN,
	TUNING_MODE_MIXOLYDIAN,
	TUNING_MODE_AEOLIAN,
	TUNING_MODE_LOCRIAN
]

export const C_MAJOR = ["C","D","E","F","G","A","B"]

export const MAJOR_SCALE = [0,2,4,5,7,9,11]
export const NAT_MINOR_SCALE = [0,2,3,5,7,8,10]
export const HARM_MINOR_SCALE = [0,2,3,5,7,8,11]
export const JAZZ_MEL_MINOR = [0,2,3,5,7,9,11]


export const makeScaleMode = (scaleNotes, modeNum) => {
  let scaleIndex = 0
  const modeNotes = []

  for(let i=0; i<scaleNotes.length; i++) 
  {
    scaleIndex = (i+modeNum) % scaleNotes.length
    modeNotes.push(scaleNotes[scaleIndex])
  }
  console.log("makeScaleMode="+TUNING_MODE_NAMES[modeNum]+" notes="+modeNotes.toString())
  return modeNotes
}

export const makeScaleModeFormula = (parentScaleFormula, modeNum) => {
  let scaleIndex = 0
  const modeFormula = []
  let modeInterval

  for(let i=0; i<parentScaleFormula.length; i++) 
  {
    scaleIndex = (i+modeNum) % parentScaleFormula.length
    modeInterval = (parentScaleFormula[scaleIndex] - parentScaleFormula[modeNum] +12) % 12
    modeFormula.push(modeInterval)
  }  
  console.log("makeScaleModeFormula="+TUNING_MODE_NAMES[modeNum]+" formula="+modeFormula.toString())
  return modeFormula;
}








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

function changeOctave(note, howManyOctaves) {
    var octaveChange = Number(howManyOctaves);
    var noteName = note.substring(0 , note.length-1)
    var startingOctave = note.substring(note.length-1, note.length)
    var correctNameAndOctave = noteName.concat((Number(startingOctave)+octaveChange).toString()) 
    return correctNameAndOctave;
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
    "natural_minor": NAT_MINOR_SCALE,
    "melodic_minor": JAZZ_MEL_MINOR,
    "harmonic_minor": HARM_MINOR_SCALE,
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