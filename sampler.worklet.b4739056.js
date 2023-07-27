// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"lmGwW":[function(require,module,exports) {
const WORKLET_SAMPLER = "sampler-processor";
class SampleAudioWorkletNode extends AudioWorkletProcessor {
    // Static getter to define AudioParam objects in this custom processor.
    static get parameterDescriptors() {
        return [
            {
                name: "myParam",
                defaultValue: 0.707
            }
        ];
    }
    constructor(context){
        super(context, WORKLET_SAMPLER);
        this.port.onmessage = (event)=>{
            // Handling data from the node.
            console.log("SampleAudioWorkletNode:", event.data);
        // loadSample(event.data)
        };
        this.port.postMessage("Hi!");
    }
    async loadSample(path) {
        const response = await fetch(path);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
        return audioBuffer;
    }
    async createBuffer(audioBuffer) {
        const trackSource = this.context.createBufferSource();
        trackSource.buffer = audioBuffer;
        return trackSource;
    }
    async play(audioBuffer, offset = 0, velocity = 128, options = {
        loop: false
    }) {
        let trackSource = this.createBuffer(audioBuffer);
        trackSource.loop = options.loop || false;
        if (this.context.state === "suspended") await this.context.resume();
        if (offset == 0) trackSource.start(0);
        else trackSource.start(0, this.context.currentTime - offset);
    }
    // Float32Array(128)
    process(inputs, outputs, parameters) {
        // The processor may have multiple inputs and outputs. Get the first input and
        // output.
        const input = inputs[0];
        const output = outputs[0];
        console.error("process", {
            inputs,
            outputs,
            parameters
        });
        // Each input or output may have multiple channels. Get the first channel.
        const inputChannel0 = input[0];
        const outputChannel0 = output[0];
        // Get the parameter value array.
        // |myParamValues| is a Float32Array of either 1 or 128 audio samples
        // calculated by WebAudio engine from regular AudioParam operations.
        // (automation methods, setter) Without any AudioParam change, this array
        // would be a single value of 0.707.
        const myParamValues = parameters.myParam || [];
        // if |myParam| has been a constant value during this render quantum, the
        // length of the array would be 1.
        if (myParamValues.length === 1) // |myParam| has been a constant value for the current render quantum,
        // which can be accessed by |myParamValues[0]|.
        // Simple gain (multiplication) processing over a render quantum
        // (128 samples). This processor only supports the mono channel.
        for(let i = 0; i < inputChannel0.length; ++i)outputChannel0[i] = inputChannel0[i] * myParamValues[0];
        else // |myParam| has been changed and |myParamValues| has 128 values.
        for(let i = 0; i < inputChannel0.length; ++i)outputChannel0[i] = inputChannel0[i] * myParamValues[i];
        // To keep this processor alive.
        return true;
    }
}
registerProcessor(WORKLET_SAMPLER, SampleAudioWorkletNode);

},{}]},["lmGwW"], "lmGwW", "parcelRequireaaed")

//# sourceMappingURL=sampler.worklet.b4739056.js.map
