# InterFACE
## [A Smile Powered Synthesizer](https://interface.place)

[![InterFACE Logo](https://interface.place/assets/icons/android-chrome-512x512.png)](https://interface.place)


_TL;DR_
*A face controlled musical instrument that uses only your web camera.*

Or...

_An augmented reality, real-time motion-capture, machine-learning powered, holographic, accessible general MIDI controller and synthesizer (that comes as a website and requires no manual)._

Once started, smile to start to make sound - click your face to change to a different instrument.

## What is it?

A musical instrument controlled simply by your face or a 'Smile Powered Synthesizer'.

By piggybacking onto a person's own natural movements, we reduce the complexity and time required to learn a new musical instrument whilst still retaining *fully immersive expression and control*. This allows practically everybody to create music in a purely fun way in only a matter of seconds.

Using motion capture in real-time allows us to track a person's own physical expressions and movements so as to control and manipulate hardware, software and data. 

In this first project, the intuitive controls manipulate sound and music whilst presenting compelling visuals on the augmented reality interface.

As this project is entirely distributed through a website, and requires no installation and no additional hardware - it has an international audience and works on most modern mobile devices as well as desktops.

It was developed during lockdown to enable anybody with a computer and a face to make music and to encourage them to create, participate and collaborate.

It was presented for review at #DMLab, a monthly meeting between technologists and disabled music makers who have invaluable in shaping the needs of the project.

As part of their 'Museum of Acessible Musical Instruments' where they will showcase technology that intersects acceasible technology with music and creativity.

the blurs the boundaries   crossroads 



Working with DMLab for a real installation at the AMIM

The exposure from various events such at SXSW21 and Music Maker Festival brought many new users and increased the audience but has not brought in any funding to help continue development. With such great reception and lovely feedback it is clear that the project is valuable and useful, so now finding a way to fund development is now the primary focus.

As a showcase for the potential of this technology, creating a musical instrument represents the perfect fit for a proof of concept as it needs to be combine many levels of control into one simple interface whilst maintaining a fine level of expression. If a musical instrument can be successfully made with no physical interface it will validate the concept for use controlling everything else!

NB : This software has been designed to be used with a holographic display which gives the visuals extra depth and believability but also works great on projectors.


## Requirements
- Face
- Video camera or web cam
- A screen with dimensions greater than 320 x 280 pixels
- A relatively modern computer (GPU prefered)
- Speakers or headphones or MIDI equipment
- Optional: Mouse / Keyboard / finger to change settings 


## Why
The goal of this project is to create new ways to control technology that requires no physical touch, or any specialised equipment, and is entirely inclusive, adaptable and accessible. 

In this first application, the technology is used to control an expressive musical instrument using only the movements of your face tracked by your device's camera. This is both a creative tool but also proof of the power of the concept, showing that an expressive and simple interface can control more than houshold appliances.

Using motion capture in real-time allows us to track a person's own physical expressions and movements so as to control and manipulate hardware, software and data. 

Using machine learning and expansive data training sets, this allows as many people to make music as possible from the youngest children to the oldest adults.

## Purpose
Having researched and created accessible technology for twenty years, the past ten of which I have been working alongside [Drake Music](https://drakemusic.org) - a charity that brings together people who struggle to play traditional instruments, and technology focussed individuals who know how to build and make things. 

The charity work directly alongside schools and individuals offering real world use cases and genuine feedback - indispensable when simplicity and useability is the aim. 

Together we have created a range of accessible musical instruments, some that are repurposing of existing instruments and some entirely new. 

My focus is currently to try to create musical instruments & music creation tools that have the lowest barriers to entry - intuitive tools that everybody can play instinctively, that are easy to obtain and fun to play too! 

Ultimately, this tool allows *all* sorts of people to create their own sounds and music but the technology can be expanded to control practically anything.

Currently the only requirement to play this one is a head with a mouth - but that could be swapped for eyes or eyebrows, the technology is remarkably broad - future versions will use be using other body parts too!


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
- After installing the app it doesn't load, uninstall and re-run it

## Build from source
- Install [NodeJS 12.8.3+](https://nodejs.org/en/) and [Yarn](https://yarnpkg.com/)
- [Download the source code](https://github.com/designerzen/InterFACE.git) and enter the directory
- open a terminal / cli / bash / command prompt
- enter ```yarn install```
- then ```yarn build```
- Your interFACE will be built into the *dist/* folder

## Future plans
- Better musicality and expression
- Upgraded synth engine
- Simplify onboarding / settings
- Scales that are changeable and cover interesting keys
- Refactor Instruments to Instrument Interface for future IO
- MIDI phrase support
- MIDI File saving of performance
- MIDI 2.0 (MPE) Support
- Percussion that sounds good & is configurable
- Hand remote Controls
- Full Body version for beats
- Saving "Persons" and using face ID loading them back in
- Vocoder mode using microphone
- Improved timing
- Collab with Beardyman?

## Installation
There are 2 planned physical installations that are currently in progress.
- Holographic Display for single face version
- Large Projector with camera for duet+ 
These will be available to play with at the [Accessible Musical Instrument Museum](https://www.drakemusic.org/technology/accessible-musical-instrument-collection/) in 2022


## Credits
- [Drake Music](https://drakemusic.org) for inspiration and support
- Font is Oxanium by [Severin Meyer](https://sev.dev/fonts/oxanium/)
- Reverb Impulses by Aleksey Vaneev [imodeler](http://www.voxengo.com/imodeler/)
- [TensorFlowJS](https://www.tensorflow.org/js) is maintained by [Alphabet](https://google.com)
- SoundFonts thanks to [Oramics](https://github.com/oramics/sampled)
- [Commit Conventions](https://www.conventionalcommits.org/en/v1.0.0/) 

## Thank You for your Inspiration
- Thomas Bonte
- Darren Southea

## Check it out over at

- [InterFACE](https://interface.place)
- [InterFACE:BETA](https://interface.dance)
- [InterFACE:SOLO (dev)](https://designerzen.github.io/InterFACE)
- [InterFACE:DUET (dev)](https://designerzen.github.io/InterFACE/?duet=true)

- [Brief Introduction on youtube](https://youtu.be/gvYxZJRhgRc)
- [GIVE A MAN A RECORD AND THEY DANCE FOR THE DAY, GIVE THAT MAN A SYNTH AND THEY DANCE FOR A LIFETIME - Talk given @ SXSW21](https://youtu.be/3SmpSvRB4XA)

## Other links
- [Audience of the Future](https://audienceofthefuture.live/interface/)
- [Music Maker Festival](https://www.makermusicfestival.com/)
- [SXSW2021](https://sxsw.com)

## See it live at
- [Accessible Musical Instrument Museum](https://www.drakemusic.org/technology/accessible-musical-instrument-collection/)