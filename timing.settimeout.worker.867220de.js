!function(e,t,n,r,o){var a="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},i="function"==typeof a.parcelRequireaaed&&a.parcelRequireaaed,u=i.cache||{},s="undefined"!=typeof module&&"function"==typeof module.require&&module.require.bind(module);function l(t,n){if(!u[t]){if(!e[t]){var r="function"==typeof a.parcelRequireaaed&&a.parcelRequireaaed;if(!n&&r)return r(t,!0);if(i)return i(t,!0);if(s&&"string"==typeof t)return s(t);var o=new Error("Cannot find module '"+t+"'");throw o.code="MODULE_NOT_FOUND",o}c.resolve=function(n){var r=e[t][1][n];return null!=r?r:n},c.cache={};var f=u[t]=new l.Module(t);e[t][0].call(f.exports,c,f,f.exports,this)}return u[t].exports;function c(e){var t=c.resolve(e);return!1===t?{}:l(t)}}l.isParcelRequire=!0,l.Module=function(e){this.id=e,this.bundle=l,this.exports={}},l.modules=e,l.cache=u,l.parent=i,l.register=function(t,n){e[t]=[function(e,t){t.exports=n},{}]},Object.defineProperty(l,"root",{get:function(){return a.parcelRequireaaed}}),a.parcelRequireaaed=l;for(var f=0;f<t.length;f++)l(t[f]);var c=l(n);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd&&define((function(){return c}))}({ay45m:[function(e,t,n){const r="tick";let o=null,a=!1,i=-1,u=-1,s=-1,l=0,f=!0;const c=()=>performance.now(),d=()=>.001*(c()-i),p=e=>{o=setTimeout((()=>{const t=l*s*.001,n=d(),o=t-n;u=c(),l++,postMessage({event:r,time:n,intervals:l});p(f?e+o:e)}),e)},m=(e=250)=>{a&&clearInterval(o),a||(i=c(),a=!0,postMessage({event:"starting",time:0})),s=e,p(s),postMessage({event:r,time:d(),intervals:l})};self.onmessage=e=>{const t=e.data;switch(t.command){case"start":f=t.accurateTiming||!1,m(t.interval);break;case"stop":clearInterval(o),o=null,a=!1,postMessage({event:"stopping",time:d(),intervals:l});break;case"update":m(t.interval)}}},{}]},["ay45m"],"ay45m");