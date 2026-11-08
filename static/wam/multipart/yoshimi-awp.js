// Yoshimi multipart build: petersalomonsen/yoshimi
// c96fb0324f0cd44f9b2dc5ba80caaeb247c2826a (GPL-2.0-or-later).
// Source: https://github.com/petersalomonsen/yoshimi/tree/c96fb0324f0cd44f9b2dc5ba80caaeb247c2826a/wam
class PhotoSYNTHYoshimi extends AudioWorkletGlobalScope.WAMProcessor {
  constructor(options) {
    const scope = AudioWorkletGlobalScope;
    scope.WAM = scope.WAM || {};
    scope.WAM.YOSHIMI = {ENVIRONMENT:'WEB', wasmBinary:new Uint8Array(options.processorOptions.wasm)};
    eval(options.processorOptions.js);
    options.mod = scope.WAM.YOSHIMI;
    super(options);
    this.running = true;
    this.events = [];
    this.port.onmessage = event => {
      if (event.data.type === 'dispose') { this.wam_terminate(this.inst); this.running = false; this.events.length = 0; return; }
      if (event.data.type === 'midi') {
        const [status, controller] = event.data.data;
        if ((status & 0xf0) === 0xb0 && (controller === 120 || controller === 123)) {
          this.events = this.events.filter(message => (message.data[0] & 15) !== (status & 15));
          super.onmessage(event);
        } else { this.events.push(event.data); this.events.sort((a,b) => a.time-b.time); }
      } else super.onmessage(event);
    };
  }
  process(inputs, outputs, parameters) {
    if (!this.running) return false;
    while (this.events.length && this.events[0].time <= currentTime + 128/sampleRate) super.onmessage({data:this.events.shift()});
    return super.process(inputs, outputs, parameters);
  }
}
registerProcessor('photosynth-yoshimi', PhotoSYNTHYoshimi);
