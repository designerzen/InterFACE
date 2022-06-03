# InterFACE
## [A Smile Powered Synthesizer](https://interface.place)

TL;DR
A musical instrument completely controlled by your face.

Smile to begin - click your face to change to a different instrument.

Or...

An augmented reality, real-time motion-capture, machine-learning powered, holographic, accessible general MIDI controller and synthesizer (that comes without a manual). 


## Abstract - Just what is it?

An exended-reality accessible musical synthesizer - completely controlled by your face.

By piggybacking onto a person's own natural movements, we reduce the complexity required to learn a new instrument to mere moments whilst retaining full expression and precise control.

We can convert smiles into musical notes and winks into audio controls.

This virtual interface has no moving parts, requires no extra hardware, and can run on most modern computers and mobile phones.

We can use a person's own expressions and movements to control and manipulate hardware, software and data to create music.

## Purpose
I have been researching and creating accessible technology for over twenty years and for the past 10 have been helping run a monthly workshop alongside Drake Music Charity that brings together people who struggle to play traditional instruments, and technology focussed individuals who know how to build and make things. The charity work directly alongside schools and individuals offering real world use cases and genuine feedback - indispensable when simplicity is the aim. Together we have created a whole number of accessible musical instruments, some that are repurposing of existing instruments and some entirely new. My focus for the past few years has been to try and create musical instruments & music creation tools with the lowest barriers to entry - intuitive tools that everybody can play instinctively, that are easy to obtain and fun to play too! Currently the only requirement for this one to play is a mouth, but that could be swapped for eyes or eyebrows, the technology is quite broad!

Ultimately, this tool allows *all* sorts of people to create their own sounds and music but the technology can be expanded to control anything.

## Potential plans

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

- Install NodeJS 12.8.3+ and Yarn
- Download the source code and enter the directory
- open a terminal / cli / bash / command prompt
- enter ```yarn install```
- then ```yarn build```
- Your interFACE will be built into the dist folder

### Other commands

```freshstart: yarn reset && parcel serve source/*.pug -p 909```
```start: parcel serve source/*.pug -p 909```
```clean: node actions/clean.mjs```
```changes: node actions/changelog.mjs```
```doc: jsdoc -d dist/docs --configure .jsdoc.json source/index.js```

build: parcel build --no-source-maps --no-scope-hoist --no-content-hash --public-url ./ source/*.pug,
build:debug: parcel build --no-minify --no-scope-hoist --public-url ./ source/*.pug,
build:index: parcel build --no-scope-hoist --no-content-hash --public-url ./ source/index.pug,
electron: electron-builder --dir,
run:electron: electron-builder,
build:electron: parcel build --public-url ./ --dist-dir ./dist --no-source-maps --no-content-hash source/app.pug,
open:electron: npx cap open @capacitor-community/electron,
build:android: parcel build --public-url ./ --dist-dir ./dist --no-source-maps source/app.pug,
open:android: npx cap open android,
run:android: npx cap run android,
android: yarn clean && yarn build:android && node actions/app.mjs && yarn open:android,

app:build: parcel build --public-url ./ --dist-dir ./app --no-source-maps source/app.pug,


// Documentation generation
help: parcel build --public-url ./ source/help.pug,
roadmap: parcel build --public-url ./ source/roadmap.pug,
app: parcel build --public-url ./ --dist-dir ./app --no-source-maps source/app.pug,
copyrights:list: NODE_ENV=production yarn licenses list && node license.mjs,
license: yarn licenses generate-disclaimer > LICENSES.md && yarn licenses generate-disclaimer > source/licenses.md,
license:build: parcel build --public-url ./ source/licenses.pug,


// Revisions and versioning
revision: yarn version --patch --no-git-tag-version,
revise: yarn revision && node actions/revision.mjs,
patch: changelog -p && yarn version --patch && node actions/revision.mjs,
minor: changelog -m && yarn version --minor && node actions/revision.mjs,
major: changelog -M && yarn version --major && node actions/revision.mjs,

package: yarn revise && yarn clean && yarn build,

analyse: parcel build source/index.pug --profile --detailed-report,

// Deployment & Distribution
push: git push origin && git push origin --tags,
deploy: node actions/deploy.mjs,
hotfix: yarn patch && yarn clean && yarn build && yarn deploy,
release: yarn minor && yarn clean && yarn build && yarn deploy,
bump: yarn major && yarn clean && yarn build && yarn deploy

// troubleshooting and library upgrades
```killport: npx kill-port 909```
```hardreset: node actions/reset.mjs --total && yarn install```
```reset: node actions/reset.mjs```
```upgrader: yarn upgrade-interactive```


## Future plans
- Better musicality and expression
- Upgraded synth engine
- Refactor Instruments to Instrument Interface for future IO
- MIDI phrase support
- Percussion that sounds good!
- Hand remote Controls
- Full Body version for beats
- Saving "Personas" and using face ID loading them back in
- Vocoder mode using microphone
- Improved timing
- MIDI 2.0 (MPE) Support

## Requirements
- Face
- Video camera or web cam
- A screen with dimensions greater than 320 x 280 pixels
- A relatively modern computer (GPU prefered)
- Speakers or headphones or MIDI equipment

- Optional: Mouse / Keyboard / finger to change settings 

## Credits
- [Drake Music](https://drakemusic.org) for inspiration and support
- Font is Oxanium by [Severin Meyer](https://sev.dev/fonts/oxanium/)
- [TensorFlowJS](https://www.tensorflow.org/js) is maintained by [Alphabet](https://google.com)

## Thanks
- Tim Yates
- Thomas Bonte
- Darren Southea

## Check it out over at
- [InterFACE](https://interface.place)
- [InterFACE:BETA](https://interface.dance)
- [InterFACE:SOLO (dev)](https://designerzen.github.io/InterFACE)
- [InterFACE:DUET (dev)](https://designerzen.github.io/InterFACE/?duet=true)


- [90 Second Intro on youtube](https://www.youtube.com/watch?v=-DSDIET5MJo)
- [5 Minute Introduction on youtube](https://youtu.be/gvYxZJRhgRc)


## Other links & Supporters
- [GIVE A MAN A RECORD AND THEY DANCE FOR THE DAY, GIVE THAT MAN A SYNTH AND THEY DANCE FOR A LIFETIME - Talk given @ SXSW21](https://youtu.be/3SmpSvRB4XA)
- [Audience of the Future](https://audienceofthefuture.live/interface/)
- [MIDI Innnovation Finalists 2022](https://www.midi.org/component/zoo/item/photosynth-interface)
- [Music Maker Festival](https://www.makermusicfestival.com/)
- [MIDI Innovation Awards 2022 Stream](https://www.youtube.com/watch?v=1HzlwlekZQk)



1. What was the motivation for your product/installation?

I wanted to expand the ways we interact with our machines beyond just sitting and clicking, something that didn't require touch but that was still simple and expressive. 

I work with a lot of musicians with different abilities and disabilities and this software gives them a new way to express themselves and to empower them to expand their range of skills.

Ive been involved with making accessible techology for over twenty years but the technology to make this kind of software has only recently ev

A touch free interface that requires no training in the day of the super virus could prove useful beyond playing music.

Ultimately this project is dedicated to my grandma who lived with blindness most of her adult life and who passed away a few months ago,

2. Describe how it is innovative

As far as I can tell it's the first one of it's kind and it does have many applications outside of making music.   

It hopes to improve computer - human relations

Ultimately I hope that it can inspire people to try things beyond their regular capabilities and provide people with new skills and opportunities. 

It aims to bring more equality to skills and leverages technology to empower and include the most diverse and varied audience - giving confidence to the most underrepresented and unprivileged.







### Keywords
- augmented reality
- extended reality
- pose piggybacking
- natural interface
- musical instrument
- synthesizer
- MIDI hardware controller