# InterFACE
## A Smile Powered Synthesizer

A face controlled musical instrument that uses a video camera.

Smile to begin - click your face to change to a different instrument.

Or, an augmented reality, real-time motion-capture, machine-learning powered, holographic, accessible general MIDI controller and synthesizer (that comes without a manual). 

## What is it?

By piggybacking onto a person's own natural movements, we reduce the complexity required to learn a new instrument and this allows for expressive yet intuitive control and hopefully fun musicality.

This software has been designed to be used with a holographic display which gives the visuals extra depth and believability.

By creating a virtual interface with no moving parts or extra hardware, we can use a person's own expressions and movements to control and manipulate hardware, software and data.

## Purpose *
I have been researching and creating accessible technology for twenty years and for the past 10 have been helping run a monthly workshop alongside Drake Music Charity that brings together people who struggle to play traditional instruments, and technology focussed individuals who know how to build and make things. The charity work directly alongside schools and individuals offering real world use cases and genuine feedback - indispensable when simplicity is the aim. Together we have created a whole number of accessible musical instruments, some that are repurposing of existing instruments and some entirely new. My focus for the past few years has been to try and create musical instruments & music creation tools with the lowest barriers to entry - intuitive tools that everybody can play instinctively, that are easy to obtain and fun to play too! Currently the only requirement for this one to play is a mouth, but that could be swapped for eyes or eyebrows, the technology is quite broad!

Ultimately, this tool allows *all* sorts of people to create their own sounds and music but the technology can be expanded to control anything.

## Potential plans for expansion and commercialisation?

Add more musicality, expression and to create an app version that would allow it to run smoother on mobile devices. I think this would be key to getting it onto everybody's devices and the app stores also offers retail opportunities. 

Already there are plans for a recording looper and effects but ideally the full magnitude of the project would be suggested by user cases in an attempt to streamline the simplicity and minimize development costs whilst still offering a viable product.
## MIDI connection to other devices or software

Can be used as a controller for other hardware MIDI devices and in duet-mode allows 2 people to independently control individual MIDI channels in realtime together. 

In single player mode, the MIDI events currently get broadcast to all channels.

The prototype has only basic note on / note off / pitch bend MIDI interaction but I would like to add after touch to the interface, perhaps eye brow control? Eye direction currently controls pitch bend on MIDI but stereo panning on the synth.

I would also like to develop certain different modes - as well as the expressive mode which works in direct relation with facial movements (as it currently works) would be a more fun but equally satisfying pop music factory mode where the mouth controls the playback and amplitude of the next phrase in a sequence (loaded from a MIDI file) whilst a backing track supports you. I think that would be a lot of fun and smooths over the latency issues. 

Given enough time it would be possible to save MIDI files directly from the app too, turning it into a rudimentary face controlled DAW.

## Troubleshooting

- If your MIDI device is not found, try connecting it directly to a USB port, rather than through a hub or USB-C convertor
- If your face is not found, try and improve the brightness in the room by turning on some lights
- If the website does not load and shows "loading" forever, hard refresh your browser

## Build from source
- Install NodeJS and Yarn
- Download the source code and enter the directory
- open a terminal / cli / bash / command prompt
- enter ```yarn install```
- then ```yarn build```
- Your interface will be built into the dist folder

## Future plans
- Better musicality and expression
- Upgraded synth engine
- Refactor Instruments to Instrument Interface for future IO
- MIDI phrase support
- Percussion that sounds good!
- Hand remote Controls
- Full Body version for beats
- Saving "Persons" and using face ID loading them back in
- Vocoder mode using microphone
- Improved timing
- MIDI 2.0 (MPE) Support
- Collab with Beardyman?

## Requirements
- Face
- Video camera or web cam
- A screen with dimensions greater than 320 x 320 pixels
- A relatively modern computer (GPU preffered)
- Speakers or headphones
- Mouse / Keyboard / finger to change optional settings 

## Credits
- [Drake Music](https://drakemusic.org) for inspiration and support
- Font is Oxanium by [Severin Meyer](https://sev.dev/fonts/oxanium/)
- [TensorFlowJS](https://www.tensorflow.org/js) is maintained by Alphabet

## Check it out over at

- [InterFACE](https://interface.place)
- [InterFACE:SOLO (dev)](https://designerzen.github.io/InterFACE)
- [InterFACE:DUET (dev)](https://designerzen.github.io/InterFACE/?duet=true)

- [Brief Introduction on youtube](https://youtu.be/gvYxZJRhgRc)
- [Audience of the Future](https://audienceofthefuture.live/interface/)