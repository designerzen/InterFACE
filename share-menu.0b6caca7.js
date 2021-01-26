!function(t,e,i,o){var s="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},n="function"==typeof s.parcelRequire&&s.parcelRequire,a="undefined"!=typeof module&&"function"==typeof module.require&&module.require.bind(module);function l(i,o){if(!e[i]){if(!t[i]){var s="function"==typeof parcelRequire&&parcelRequire;if(!o&&s)return s(i,!0);if(n)return n(i,!0);if(a&&"string"==typeof i)return a(i);var h=new Error("Cannot find module '"+i+"'");throw h.code="MODULE_NOT_FOUND",h}r.resolve=function(e){return t[i][1][e]||e},r.cache={};var c=e[i]=new l.Module(i);t[i][0].call(c.exports,r,c,c.exports,this)}return e[i].exports;function r(t){return l(r.resolve(t))}}l.isParcelRequire=!0,l.Module=function(t){this.id=t,this.bundle=l,this.exports={}},l.modules=t,l.cache=e,l.parent=n,l.register=function(e,i){t[e]=[function(t,e){e.exports=i},{}]},s.parcelRequire=l;for(var h=0;h<i.length;h++)l(i[h]);if(i.length){var c=l(i[i.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=c:"function"==typeof define&&define.amd&&define((function(){return c}))}}({"99c69f85e2e0ab520ebcabc424fac7a2":[function(t,e,i){"use strict";Object.defineProperty(i,"__esModule",{value:!0}),i.ShareMenu=void 0;var o=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!=typeof t&&"function"!=typeof t)return{default:t};var e=s();if(e&&e.has(t))return e.get(t);var i={},o=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var n in t)if(Object.prototype.hasOwnProperty.call(t,n)){var a=o?Object.getOwnPropertyDescriptor(t,n):null;a&&(a.get||a.set)?Object.defineProperty(i,n,a):i[n]=t[n]}i.default=t,e&&e.set(t,i);return i}(t("./social-icons.js"));function s(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return s=function(){return t},t}class n extends HTMLElement{constructor(){super(),this._urlIsImage=!1,this._supportedSocials={clipboard:{color:"#777",title:"Copy to clipboard",action:()=>{const t={message:"Unable to copy to clipboard"};if(!navigator.clipboard)return this._emitEvent("error",t);navigator.clipboard.writeText(`${this.title}\n\n${this.text}\n\n${this.url}`).catch(()=>this._emitEvent("error",t))}},facebook:{color:"#3b5998",title:"Facebook",action:()=>{window.FB?window.FB.ui({href:this.url,method:"share",mobile_iframe:!0,quote:this.text}):this._openWindow(`https://www.facebook.com/sharer.php?u=${this._encode(this.url)}&description=${this._encode(this.title)}%0A%0A${this._encode(this.text)}`)}},twitter:{color:"#1da1f2",title:"Twitter",action:()=>{this._openWindow(`https://twitter.com/intent/tweet?text=${this._encode(this.title)}%0A${this._encode(this.text)}&url=${this._encode(this.url)}${this.via?"&via="+this._encode(this.via):""}`)}},whatsapp:{color:"#25d366",title:"WhatsApp",action:()=>{this._openWindow(`whatsapp://send?text=*${this._encode(this.title)}*%0A%0A${this._encode(this.text)}%0A%0A${this._encode(this.url)}`,!0)}},telegram:{color:"#0088cc",title:"Telegram",action:()=>{this._openWindow(`https://t.me/share/url?url=${this._encode(this.url)}&text=**${this._encode(this.title)}**%0A${this._encode(this.text)}`)}},linkedin:{color:"#0077b5",title:"LinkedIn",action:()=>{this._openWindow(`https://www.linkedin.com/shareArticle?mini=true&url=${this._encode(this.url)}&title=${this._encode(this.title)}&summary=${this._encode(this.text)}&source=${this._encode(this.via)}`)}},pinterest:{color:"#bd081c",title:"Pinterest",imageOnly:!0,action:()=>{const t=document.createElement("button");t.onclick=()=>{const t=document.createElement("script");t.src="https://assets.pinterest.com/js/pinmarklet.js?r="+99999999*Math.random(),document.body.appendChild(t)},t.style.display="none";const e=document.createElement("img");e.src=this.url,e.alt=this.text,e.title=this.title,e.style.width="400px",e.style.height="auto",t.appendChild(e),document.body.appendChild(t),t.click()}},tumblr:{color:"#35465c",title:"Tumblr",action:()=>{this._openWindow(`https://www.tumblr.com/widgets/share/tool?canonicalUrl=${this._encode(this.url)}&title=${this._encode(this.title)}&caption=${this._encode(this.text)}`)}},reddit:{color:"#ff4500",title:"Reddit",action:()=>{const t=this.text?`text=${this._encode(this.text)}%0A%0A${this._encode(this.url)}`:"url="+this._encode(this.url);this._openWindow(`https://reddit.com/submit?${t}&title=${this._encode(this.title)}`)}},vk:{color:"#45668e",title:"VK",action:()=>{this._openWindow("https://vk.com/share.php?url="+this._encode(this.url))}},skype:{color:"#00aff0",title:"Skype",action:()=>{this._openWindow("https://web.skype.com/share?url="+this._encode(this.url))}},viber:{color:"#665cac",title:"Viber",action:()=>{this._openWindow(`viber://forward?text=${this._encode(this.title)}%0A%0A${this._encode(this.text)}%0A%0A${this._encode(this.url)}`,!0)}},line:{color:"#00c300",title:"Line",action:()=>{this._openWindow("https://lineit.line.me/share/ui?url="+this._encode(this.url))}},qzone:{color:"#ffce00",title:"Qzone",action:()=>{this._openWindow("https://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url="+this._encode(this.url))}},wordpress:{color:"#0087be",title:"WordPress",action:()=>{const t=this._urlIsImage?"&i="+this._encode(this.url):"";this._openWindow(`https://wordpress.com/press-this.php?u=${this._encode(window.location.href)}&t=${this._encode(this.title)}&s=${this._encode(this.text)}${t}`)}},blogger:{color:"#f57d00",title:"Blogger",action:()=>{this._openWindow(`https://www.blogger.com/blog-this.g?u=${this._encode(this.url)}&n=${this._encode(this.title)}&t=${this._encode(this.text)}`)}},flipboard:{color:"#e12828",title:"Flipboard",action:()=>{this._openWindow(`https://share.flipboard.com/bookmarklet/popout?v=2&title=${this._encode(this.title)}&url=${this._encode(this.url)}`)}},evernote:{color:"#2dbe60",title:"Evernote",action:()=>{this._openWindow("https://www.evernote.com/clip.action?url="+this._encode(this.url))}},myspace:{color:"#000",title:"Myspace",action:()=>{this._openWindow(`https://myspace.com/post?u=${this._encode(this.url)}&t=${this._encode(this.title)}&c=${this._encode(this.text)}`)}},pocket:{color:"#ef4056",title:"Pocket",action:()=>{this._openWindow("https://getpocket.com/save?url="+this._encode(this.url))}},livejournal:{color:"#004359",title:"LiveJournal",action:()=>{this._openWindow(`http://www.livejournal.com/update.bml?subject=${this._encode(this.title)}&event=${this._encode(this.text)}%0A%0A${this._encode(this.url)}`)}},instapaper:{color:"#000",title:"Instapaper",action:()=>{this._openWindow(`https://www.instapaper.com/edit?url=${this._encode(this.url)}&title=${this._encode(this.title)}&description=${this._encode(this.text)}`)}},baidu:{color:"#2529d8",title:"Baidu",action:()=>{this._openWindow(`http://cang.baidu.com/do/add?it=${this._encode(this.title)}&iu=${this._encode(this.url)}`)}},okru:{color:"#ee8208",title:"OK.ru",action:()=>{this._openWindow(`https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl=${this._encode(this.url)}&title=${this._encode(this.title)}`)}},xing:{color:"#026466",title:"XING",action:()=>{this._openWindow("https://www.xing.com/app/user?op=share&url="+this._encode(this.url))}},buffer:{color:"#323b43",title:"Buffer",action:()=>{this._openWindow(`https://buffer.com/add?text=${this._encode(this.title)}&url=${this._encode(this.url)}`)}},digg:{color:"#005be2",title:"Digg",action:()=>{this._openWindow(`https://digg.com/submit?url=${this._encode(this.url)}&title=${this._encode(this.title)}`)}},douban:{color:"#007610",title:"Douban",action:()=>{this._openWindow(`https://www.douban.com/recommend/?url=${this._encode(this.url)}&title=${this._encode(this.title)}`)}},stumbleupon:{color:"#eb4924",title:"StumbleUpon",action:()=>{this._openWindow(`https://www.stumbleupon.com/submit?url=${this._encode(this.url)}&title=${this._encode(this.title)}`)}},weibo:{color:"#df2029",title:"Weibo",action:()=>{this._openWindow(`http://service.weibo.com/share/share.php?url=${this._encode(this.url)}&appkey=&title=${this._encode(this.title)}%0A%0A${this._encode(this.text)}&pic=&ralateUid=`)}},print:{color:"#425563",title:"Print",action:()=>{this._openWindow(this.url).print()}},translate:{color:"#4285f4",title:"Translate",action:()=>{const t=navigator.language.slice(0,2);this._openWindow(`https://translate.google.it/translate?hl=${t}&sl=auto&u=${this._encode(this.url)}`)}},email:{color:"#ffa930",title:"Email",action:()=>{this._openWindow(`mailto:?subject=${this._encode(this.title)}&body=${this._encode(this.text)}%0A%0A${this._encode(this.url)}`,!0)}},sms:{color:"#43695b",title:"SMS",action:()=>{let t="?";if(/iP(hone|od|ad)/.test(navigator.platform)){const[,e]=navigator.appVersion.match(/OS (\d+)/);t=parseInt(e,10)<8?";":"&"}this._openWindow(`sms:${t}body=${this._encode(this.title)}%0A%0A${this._encode(this.text)}%0A%0A${this._encode(this.url)}`,!0)}},yahoo:{color:"#410093",title:"Yahoo!",action:()=>{this._openWindow(`https://compose.mail.yahoo.com/?body=${this._encode(this.title)}%0A%0A${this._encode(this.text)}%0A%0A%${this._encode(this.url)}`)}}},this._socials=Object.keys(this._supportedSocials),this._styles="/* css */\n      :host {\n        font-family: 'Roboto', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol';\n        position: fixed;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        max-height: 100%;\n        z-index: -1;\n        will-change: z-index;\n        transition: .3s z-index step-end;\n        overflow-y: auto;\n        display: none;\n      }\n\n      :host([opened]) {\n        z-index: 9999;\n        transition: .3s z-index step-start;\n      }\n\n      * {\n        box-sizing: border-box;\n      }\n\n      #backdrop {\n        position: fixed;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        opacity: 0;\n        background: var(--backdrop-color, #000);\n        will-change: opacity;\n        transition: .3s opacity cubic-bezier(.4, 0, 1, 1);\n        cursor: pointer;\n        z-index: -1;\n      }\n\n      :host([opened]) #backdrop {\n        opacity: .6;\n        transition: .3s opacity cubic-bezier(0, 0, .2, 1);\n      }\n\n      :host([no-backdrop]) #backdrop {\n        display: none;\n      }\n\n      #dialog {\n        margin: 100vh auto 0 auto;\n        background: var(--background-color, #fff);\n        width: 100%;\n        max-width: 640px;\n        will-change: transform;\n        transform: translateY(100vh);\n        transition: .3s transform cubic-bezier(.4, 0, 1, 1);\n      }\n\n      :host([opened]) #dialog {\n        transform: translateY(0);\n        transition: .3s transform cubic-bezier(0, 0, .2, 1);\n      }\n\n      #title {\n        color: var(--title-color, rgba(0, 0, 0, .6));\n        font-weight: 400;\n        font-size: 14px;\n        margin: 0;\n        padding: 12px;\n      }\n\n      #socials-container {\n        display: flex;\n        flex-wrap: wrap;\n        justify-content: center;\n      }\n\n      .social {\n        width: 72px;\n        height: 100px;\n        padding: 12px;\n        display: flex;\n        flex-direction: column;\n        justify-content: flex-start;\n        align-items: center;\n        cursor: pointer;\n        border: none;\n        outline: none;\n        background: var(--background-color, #fff);\n        will-change: transform;\n        transition: .3s transform;\n      }\n\n      .social:hover {\n        transform: scale(1.05);\n      }\n\n      .social .icon {\n        position: relative;\n        width: 48px;\n        height: 48px;\n        padding: 8px;\n      }\n\n      .social .icon::before {\n        content: '';\n        z-index: -1;\n        position: absolute;\n        top: 0;\n        left: 0;\n        width: 100%;\n        height: 100%;\n        border-radius: 50%;\n        background: var(--ripple-color, #000);\n        opacity: .12;\n        will-change: transform;\n        transition: .3s transform;\n        transform: scale(0);\n      }\n\n      .social:active .icon::before, .social:focus .icon::before {\n        transform: scale(1);\n      }\n\n      .social .label {\n        color: var(--labels-color, rgba(0, 0, 0, .87));\n        font-weight: 400;\n        font-size: 12px;\n        text-align: center;\n      }\n    ",this._template=document.createElement("template"),this._template.innerHTML=`\x3c!-- html --\x3e\n      ${n._supportsAdoptingStyleSheets?"":`<style>${this._styles}</style>`}\n      <div id="backdrop" part="backdrop" tabindex="-1"></div>\n      <div id="dialog" part="dialog" role="dialog" aria-labelledby="title">\n        <h2 id="title" part="title"></h2>\n        <div id="socials-container"></div>\n      </div>\n    `,this.attachShadow({mode:"open"}),n._supportsAdoptingStyleSheets&&(n.stylesheet=new CSSStyleSheet,this.shadowRoot.adoptedStyleSheets=[n.stylesheet]),this.shadowRoot.appendChild(this._template.content.cloneNode(!0))}get opened(){return this.hasAttribute("opened")}set opened(t){t?this.setAttribute("opened",""):this.removeAttribute("opened")}get dialogTitle(){return this.getAttribute("dialog-title")}set dialogTitle(t){this.setAttribute("dialog-title",t)}get socials(){return this._socials}set socials(t){this._socials=t,this._renderSocials()}get text(){return this.getAttribute("text")}set text(t){this.setAttribute("text",t)}get title(){return this.getAttribute("title")}set title(t){this.setAttribute("title",t)}get url(){return this.getAttribute("url")}set url(t){this.setAttribute("url",t)}get via(){return this.getAttribute("via")}set via(t){this.setAttribute("via",t)}get isImage(){return this.getAttribute("is-image")}set isImage(t){this.setAttribute("is-image",t)}get noBackdrop(){return this.hasAttribute("no-backdrop")}set noBackdrop(t){t?this.setAttribute("no-backdrop",""):this.removeAttribute("no-backdrop")}share({text:t=this.text,title:e=this.title,url:i=this.url,via:o=this.via}={}){return this.text=t,this.title=e,this.url=i,this.via=o,navigator.share?navigator.share({text:this.text,title:this.title,url:this.url}).then(()=>{this.opened=!1,["share","close"].forEach(t=>this._emitEvent(t,{origin:"native"}))}).catch(({name:t})=>{if("AbortError"!==t)return this._showFallbackShare();this._emitEvent("close",{origin:"native"})}):this._showFallbackShare()}connectedCallback(){if(n._supportsAdoptingStyleSheets&&n.stylesheet&&0===n.stylesheet.cssRules.length&&n.stylesheet.replace(this._styles),null===this.text){const t=document.querySelector('meta[name="description"]');this.text=t&&t.content||""}if(null===this.title&&(this.title=document.title||""),null===this.url){const t=document.querySelector("link[rel=canonical]");this.url=t&&t.href||window.location.href}this.dialogTitle||(this.dialogTitle="Share with"),this._backdropRef=this.shadowRoot.querySelector("#backdrop"),this._dialogRef=this.shadowRoot.querySelector("#dialog"),this._dialogTitleRef=this.shadowRoot.querySelector("#title"),this._dialogTitleRef.textContent=this.dialogTitle,this._socialsContainerRef=this.shadowRoot.querySelector("#socials-container"),this.socials=Object.keys(this._supportedSocials)}attributeChangedCallback(t,e,i){if(e!==i)switch(t){case"dialog-title":this._dialogTitleRef&&(this._dialogTitleRef.textContent=i);break;case"opened":null===i?this._close():this.share();break;case"url":if("auto"!==this.isImage)return;let t=new Image;t.addEventListener("load",()=>{this._urlIsImage=!0,t=null,this._renderSocials()}),t.addEventListener("error",()=>{this._urlIsImage=!1,t=null,this._renderSocials()}),t.src=i;break;case"is-image":switch(i){case"yes":case"true":case"1":this._urlIsImage=!0,this._renderSocials();break;case"no":case"false":case"0":this._urlIsImage=!1,this._renderSocials();break;default:this.isImage="auto"}}}_renderSocials(){this._socialsContainerRef&&(this._socialsContainerRef.innerHTML="",this._socials.forEach((t,e)=>{const{color:i,title:s,action:n,imageOnly:a}=this._supportedSocials[t];if(a&&!this._urlIsImage)return;const l=document.createElement("button");l.className="social",l.id=t,l.title=s,l.setAttribute("part","social-button"),l.addEventListener("click",()=>{n(),this._emitEvent("share",{social:t,origin:"fallback"}),this._close()});const h=document.createElement("div");h.className="icon",h.innerHTML=`<svg viewBox="0 0 256 256"><path d="${o[t]}"/></svg>`,h.style.fill=i,h.setAttribute("part","social-icon"),l.appendChild(h);const c=document.createElement("div");c.className="label",c.textContent=s,c.setAttribute("part","social-label"),l.appendChild(c),this._socialsContainerRef.appendChild(l),0===e&&(this._firstFocusableElRef=l),e===this._socials.length-1&&(this._lastFocusableElRef=l)}))}_openWindow(t,e){return window.open(t,e?"_self":"_blank",`width=${screen.width/2},height=${screen.height/2},left=${screen.width/4},top=${screen.height/4},menubar=0,status=0,titlebar=0,toolbar=0`,!1)}_encode(t){return encodeURIComponent(t)}_emitEvent(t,e){return this.dispatchEvent(new CustomEvent(t,{bubbles:!0,composed:!0,detail:e}))}_showFallbackShare(){return new Promise(t=>{this._previousFocus=document.activeElement,this.style.display="block",this._firstFocusableElRef.focus(),this.scrollTop=Math.max(window.innerHeight/2,window.innerHeight-this._dialogRef.offsetHeight),this.opened=!0,this._backdropRef.addEventListener("click",this._close.bind(this)),this.addEventListener("scroll",this._handleScroll.bind(this)),this.addEventListener("keydown",this._handleKeyDown.bind(this)),this.addEventListener("share",function e(){this.removeEventListener("share",e),t()}.bind(this))})}_close(){this._backdropRef.removeEventListener("click",this._close),this.removeEventListener("scroll",this._handleScroll),this.opened=!1,this.scroll({behavior:"smooth",top:0}),this._previousFocus&&(this._previousFocus.focus(),this._previousFocus=null),setTimeout(()=>{this.style.display="none",this._emitEvent("close",{origin:"fallback"})},300)}_handleScroll(){this.scrollTop<80&&this._close()}_handleKeyDown(t){switch(t.key){case"Escape":this._close();break;case"Tab":if(this.socials.length<2){t.preventDefault();break}const e=this.shadowRoot.activeElement||document.activeElement;t.shiftKey&&e===this._firstFocusableElRef?(t.preventDefault(),this._lastFocusableElRef.focus()):t.shiftKey||e!==this._lastFocusableElRef||(t.preventDefault(),this._firstFocusableElRef.focus())}}}i.ShareMenu=n,n.observedAttributes=["dialog-title","opened","url","is-image","no-backdrop"],n._supportsAdoptingStyleSheets="adoptedStyleSheets"in Document.prototype,window.customElements.define("share-menu",n)},{"./social-icons.js":"6f075586a2d8c855dc39f8c6bf0bf84d"}],"6f075586a2d8c855dc39f8c6bf0bf84d":[function(t,e,i){"use strict";Object.defineProperty(i,"__esModule",{value:!0}),i.yahoo=i.xing=i.wordpress=i.whatsapp=i.weibo=i.vk=i.viber=i.twitter=i.tumblr=i.translate=i.telegram=i.stumbleupon=i.sms=i.skype=i.reddit=i.qzone=i.print=i.pocket=i.pinterest=i.okru=i.myspace=i.livejournal=i.linkedin=i.line=i.instapaper=i.flipboard=i.facebook=i.evernote=i.email=i.douban=i.digg=i.clipboard=i.buffer=i.blogger=i.baidu=void 0;i.clipboard="M180 0H41a23 23 0 0 0-24 23v163h24V23h139zm35 47H87a23 23 0 0 0-23 23v163a23 23 0 0 0 23 23h128a23 23 0 0 0 24-23V70a23 23 0 0 0-24-23zm0 186H87V70h128z";i.baidu="M69 96c2 21-10 40-26 41s-30-16-31-37 10-40 26-41 30 16 31 37zM178 7c-15-4-32 10-37 31s3 41 18 45 32-10 38-31c6-27-15-44-19-45zm36 70c-16 1-29 16-28 40s13 34 30 34 29-11 28-35c0-31-26-39-30-39zM97 2C82 2 69 19 69 40s13 39 28 39 28-17 28-39S112 2 97 2zm-3 120c-9 12-19 25-39 41s-28 28-28 44 10 45 37 45 40-6 61-6 36 8 63 8 38-25 38-42-5-26-26-45c-14-12-26-22-44-48-10-12-20-14-31-14s-23 4-31 17z";i.blogger="M174 256a81 81 0 0 0 81-81l1-65-1-4-2-4-4-3c-4-4-28 0-35-6-4-4-5-11-6-21-3-20-4-21-7-28a89 89 0 0 0-63-44H81C36 0 0 36 0 81v94c0 45 36 81 81 81h93zM82 66h45a15 15 0 1 1 0 31H82a15 15 0 1 1 0-31zM67 174a15 15 0 0 1 15-15h92a15 15 0 1 1 0 30H82a16 16 0 0 1-15-15z";i.buffer="M136 2l112 52c2 1 5 2 5 4s-3 4-5 5l-111 52a20 20 0 0 1-18 0L7 63c-2-1-4-2-4-5 0-2 2-3 4-4L120 1c4-1 12-1 16 1zm-8 254l-9-3L7 201c-2-1-4-1-4-4s2-4 4-5l19-8a21 21 0 0 1 19 0l74 35a21 21 0 0 0 18-1l75-34a20 20 0 0 1 17 0l20 9a13 13 0 0 1 3 1c2 2 2 4 0 5a18 18 0 0 1-4 2l-111 52-9 3zm0-69a34 34 0 0 1-9-3L8 132c-2-1-5-2-5-4 0-3 3-4 5-5l18-9a20 20 0 0 1 18 0l75 35a20 20 0 0 0 18 0l75-35a20 20 0 0 1 17 0l20 10a13 13 0 0 1 3 1c2 2 2 4 0 5a13 13 0 0 1-3 2l-113 52a33 33 0 0 1-8 3z";i.digg="M256 64h-33V14h-96v50H94v64H17V64H0v65h17v17h30v30H34v17h43v31H34v-31H17v49h77v-49H77v-17H64v-30h49v95h128v-99h15zm-51-33v64h-60V31zm-20 193v-48h-15v48h-40v-96h-18V82h15v30h96V82h15v47h-14v95zM77 64V47h17v17zm0-17H34V29h43zM34 64H17V47h17z";i.douban='M1 69h120v13H1zM99 145h11V95H10v50h11l9 29H0v11h120v-11H90zm-69-37h61v24H30zm43 66H47l-9-29h44zM165 139l-9 2v-14h12v-13h-5l2-27h2V77h-12V67h-10v10h-13v10h2l2 27h-6v13h13v15l-11 2v13l11-2c-1 12-8 29-8 29l11 5c1-1 10-22 10-37l9-1v-12zm-12-25h-7l-1-27h10z"/><path d="M213 144V78l3-1-8-10-39 9v75c0 10-7 27-10 33l10 5c0-1 11-24 11-38V84l5-1v90h-8v13l26-2v-11h-7V81l7-2v64c-1 3-1 28 9 45l12-3-2-2c-10-13-9-39-9-39z"/><path d="M256 127v-13h-6l2-26h3V77h-13V67h-11v10h-14v11h3l3 26h-7v13h14v15h-12v12h12v34h13v-34h11v-12h-11v-15zm-17-13h-6l-2-26h10z';i.email="M230 26H26A26 26 0 0 0 0 51v154a26 26 0 0 0 26 25h204a26 26 0 0 0 26-25V51a26 26 0 0 0-26-25zm0 51l-102 64L26 77V51l102 64 102-64z";i.evernote="M70 55H29L81 3v42zm147-21c-4-7-27-16-39-16h-31a39 39 0 0 0-33-18C90 0 92 10 92 19v36L81 66H32S18 76 18 95s7 89 48 95c48 8 57-15 57-18v-29s14 28 36 28 34 12 34 25v23s-1 15-14 15h-27s-9-7-9-16 5-13 10-13a73 73 0 0 1 9 1v-20s-41 0-41 31 21 39 39 39h27s51-6 51-106-16-108-21-116zm-49 89s2-16 11-16 23 22 23 22l-34-6z";i.facebook="M94 50v35H68v43h26v128h53V128h36l5-43h-41V55c0-4 6-10 12-10h29V0h-40C93 0 94 43 94 50z";i.flipboard="M0 0h83v256H0zm91 91h82v82H91zm0-91h165v83H91z";i.instapaper="M185 249q-24-2-31-7t-6-28V42q0-21 6-28t31-7V0H71v7q24 1 31 7t6 28v172q0 22-6 28t-31 7v7h114z";i.line="M256 110C256 53 199 6 128 6S0 53 0 110c0 51 46 94 107 102 4 1 10 3 11 7 2 3 1 8 1 11l-2 11c-1 3-3 13 11 7s74-43 101-74c18-21 27-41 27-64zM78 144H52a7 7 0 0 1-6-7V86a7 7 0 0 1 13 0v45h19a7 7 0 0 1 0 13zm26-7a7 7 0 0 1-13 0V86a7 7 0 1 1 13 0zm61 0a7 7 0 0 1-12 4l-26-35v31a7 7 0 0 1-13 0V86a7 7 0 0 1 4-6 7 7 0 0 1 3 0 7 7 0 0 1 5 2l26 36V86a7 7 0 0 1 13 0v51zm42-32a7 7 0 0 1 0 14h-19v12h19a7 7 0 0 1 0 13h-26a7 7 0 0 1-7-7V86a7 7 0 0 1 7-6h26a7 7 0 0 1 0 13h-19v12h19z";i.linkedin="M256 156v94h-55v-88c0-22-8-37-28-37-15 0-24 10-28 20l-2 13v92H88V85h55v24c8-12 21-28 50-28 36 0 63 24 63 75zM31 6C12 6 0 18 0 34s12 29 30 29h1c19 0 31-13 31-29C61 18 50 6 31 6zM3 250h55V85H3z";i.livejournal='M135 16a119 119 0 0 0-46 9L64 1a2 2 0 0 0-2-1A185 185 0 0 0 2 60a2 2 0 0 0 0 3l24 24a119 119 0 0 0-11 49A120 120 0 1 0 135 16zm47 109l9 35 8 37-38-8-35-8-95-95a116 116 0 0 1 57-56z"/><path d="M186 157l-6-27a99 99 0 0 0-49 49l28 6a62 62 0 0 1 27-28z';i.myspace="M186 85a43 43 0 1 1 43-42 43 43 0 0 1-43 42zm-35 41a43 43 0 0 0-85 0v77h85v-74-3zm-42-48a31 31 0 1 0-32-31 31 31 0 0 0 32 31zm136 73a58 58 0 0 0-117 0v105h117V155h-1l1-4zM46 79a35 35 0 0 0-35 35v63h70v-61-2a35 35 0 0 0-35-35zm0-5a26 26 0 1 0-25-25 26 26 0 0 0 25 25z";i.okru="M128 39a27 27 0 1 1-27 27 27 27 0 0 1 27-27zm0 93a66 66 0 1 0-66-66 66 66 0 0 0 66 66zm27 54a124 124 0 0 0 38-16 19 19 0 0 0-21-33 84 84 0 0 1-89 0 19 19 0 0 0-20 33 124 124 0 0 0 38 16l-37 37a19 19 0 0 0 28 27l36-36 36 36a19 19 0 0 0 28-27l-37-37z";i.pinterest="M30 92a85 85 0 0 1 5-31 80 80 0 0 1 16-26 109 109 0 0 1 52-31 122 122 0 0 1 31-4 102 102 0 0 1 45 10 85 85 0 0 1 34 30q14 20 14 44a142 142 0 0 1-3 29 117 117 0 0 1-10 27 95 95 0 0 1-15 23 67 67 0 0 1-22 16 70 70 0 0 1-29 6 48 48 0 0 1-21-5c-7-3-12-8-15-13l-4 17-4 15-3 11a73 73 0 0 1-4 10l-5 10a107 107 0 0 1-7 12l-10 13-2 1-1-2-2-28a172 172 0 0 1 3-32q3-18 10-44t8-32c-3-6-5-15-5-26a41 41 0 0 1 8-24q8-11 21-11 9 0 14 6c4 4 5 10 5 16q0 10-6 29t-7 29a21 21 0 0 0 7 16 24 24 0 0 0 17 7 33 33 0 0 0 15-4 35 35 0 0 0 12-11 88 88 0 0 0 9-14 84 84 0 0 0 6-17 172 172 0 0 0 3-17 122 122 0 0 0 1-16q0-26-17-41t-44-15q-31 0-51 20T58 96a49 49 0 0 0 6 23l4 7 2 4a37 37 0 0 1-2 12c-2 4-3 6-6 6h-2a32 32 0 0 1-14-9 45 45 0 0 1-10-14 95 95 0 0 1-5-17 71 71 0 0 1-1-16z";i.pocket="M256 46a38 38 0 0 0-38-38H38C17 8 0 26 0 46v103c0 54 58 99 128 99s128-45 128-99V46zm-49 66l-63 63a22 22 0 0 1-16 7h-1a22 22 0 0 1-16-7l-63-63c-9-9-9-22 0-31 8-8 22-8 31 0l48 49 48-49c8-8 22-8 31 0 10 9 10 23 1 31z";i.print="M217 77H39a38 38 0 0 0-38 38v77h51v50h152v-50h51v-77a38 38 0 0 0-38-38zm-38 140H77v-64h102zm38-89a13 13 0 1 1 13-13 13 13 0 0 1-13 13zM204 14H52v51h152z";i.qzone="M256 99a5 5 0 0 0-5-4l-82-7-36-79a5 5 0 0 0-10 0L87 86 5 95a5 5 0 0 0-5 4 5 5 0 0 0 2 6l60 55-15 84a5 5 0 0 0 2 5 5 5 0 0 0 6 0l74-42 72 43a7 7 0 0 0 6-1 5 5 0 0 0 2-5l-11-62c3-2 12-5 16-10a75 75 0 0 1-17 5c-49 9-124 1-126 1l82-60a941 941 0 0 0-96-7c3-1 87-15 136-1l-83 58s64 6 86 4l-1-12 60-55a6 6 0 0 0 1-6z";i.reddit="M256 121a32 32 0 0 0-57-20c-17-7-36-12-57-14l18-55 39 8a27 27 0 1 0 2-18l-45-10a9 9 0 0 0-11 6l-22 69c-24 1-46 6-66 14a32 32 0 0 0-57 20 32 32 0 0 0 9 23 56 56 0 0 0-5 24c0 22 13 42 37 58 23 15 54 23 87 23s64-8 87-23c24-16 37-36 37-58a56 56 0 0 0-5-24 32 32 0 0 0 9-23zM14 132a21 21 0 0 1-3-11 21 21 0 0 1 21-21 21 21 0 0 1 13 5c-13 8-23 17-31 27zm48 19a23 23 0 1 1 23 23 23 23 0 0 1-23-23zm113 52c-9 10-27 16-47 16s-38-6-47-16a9 9 0 1 1 14-12c5 6 19 10 33 10s28-4 33-10a9 9 0 1 1 14 12zm-4-29a23 23 0 1 1 23-23 23 23 0 0 1-23 23zm71-42c-8-10-18-19-31-27a21 21 0 0 1 13-5 21 21 0 0 1 21 21 21 21 0 0 1-3 11z";i.skype="M245 147A119 119 0 0 0 128 9a120 120 0 0 0-19 2 72 72 0 0 0-98 98 121 121 0 0 0-2 19 119 119 0 0 0 138 117 72 72 0 0 0 98-98zm-61 35c-5 7-12 13-22 17s-21 6-34 6q-24 0-39-8a51 51 0 0 1-18-16c-5-7-7-14-7-20a13 13 0 0 1 4-10 15 15 0 0 1 11-4 13 13 0 0 1 9 3 24 24 0 0 1 6 10 58 58 0 0 0 7 11 26 26 0 0 0 10 8q6 3 16 3c10 0 17-2 23-6s9-9 9-15a15 15 0 0 0-5-12 31 31 0 0 0-12-7l-20-5a160 160 0 0 1-29-9 47 47 0 0 1-19-13c-5-6-7-14-7-22a36 36 0 0 1 7-22q8-10 21-15t33-5q14 0 25 3a56 56 0 0 1 18 9 39 39 0 0 1 11 12 26 26 0 0 1 3 13 14 14 0 0 1-4 10 14 14 0 0 1-11 4c-4 0-7-1-9-3a35 35 0 0 1-6-8 38 38 0 0 0-10-13c-4-3-11-5-20-5-8 0-14 2-19 5s-8 8-8 12a11 11 0 0 0 3 7 21 21 0 0 0 7 6 49 49 0 0 0 9 3l15 4 25 7a77 77 0 0 1 18 8 36 36 0 0 1 13 13q4 8 4 20a42 42 0 0 1-8 24z";i.sms="M230 0H26A26 26 0 0 0 0 26v230l51-51h179a26 26 0 0 0 26-26V26a26 26 0 0 0-26-26zM51 90h154v25H51zm103 64H51v-26h103zm51-77H51V51h154z";i.stumbleupon='M119 31a58 58 0 0 0-34 19 58 58 0 0 0-11 20c-3 9-3 6-3 56v46l-1 2a14 14 0 0 1-7 6 11 11 0 0 1-6 1 10 10 0 0 1-5-1 13 13 0 0 1-7-7l-1-21v-19H0v21l1 25a58 58 0 0 0 45 45c5 1 18 2 22 0a56 56 0 0 0 30-15 54 54 0 0 0 13-23c3-8 3-5 3-56l1-46 1-2c4-9 15-11 22-4 3 4 3 5 4 16v9l8 4 9 4 13-4 13-3V92l-1-16a57 57 0 0 0-16-29 56 56 0 0 0-28-16h-21z"/><path d="M212 153v20l-1 2a15 15 0 0 1-7 7 15 15 0 0 1-11 0 13 13 0 0 1-6-6l-2-3v-19-20l-13 4-13 3-8-3-9-4v21l1 25a57 57 0 0 0 74 43 58 58 0 0 0 36-36c3-9 3-8 3-32v-22h-44z';i.telegram="M5 123l59 22 22 74a7 7 0 0 0 11 3l33-27a10 10 0 0 1 12 0l60 43a7 7 0 0 0 10-4l44-209a7 7 0 0 0-9-8L4 110a7 7 0 0 0 1 13zm78 11l115-71a2 2 0 0 1 2 3l-95 88a20 20 0 0 0-6 12l-3 24a3 3 0 0 1-6 1l-12-44a12 12 0 0 1 5-13z";i.translate="M230 38H114L102 0H26A26 26 0 0 0 0 26v166a26 26 0 0 0 26 26h89l13 38h102a26 26 0 0 0 26-26V64a26 26 0 0 0-26-26zM66 161a52 52 0 0 1 0-105 51 51 0 0 1 35 14l1 1-16 15v-1a28 28 0 0 0-20-7c-17 0-30 14-30 31s13 31 30 31c18 0 25-11 27-19H65v-20h51v1a40 40 0 0 1 0 8c0 30-20 51-50 51zm77-22a128 128 0 0 0 16 22l-7 7zm10-9h-12l-4-14h51s-5 17-20 35a118 118 0 0 1-15-21zm90 100a13 13 0 0 1-13 13h-89l25-25-10-36 12-12 34 35 9-10-34-34c11-13 20-29 24-45h17v-13h-47V90h-13v13h-25l-15-52h112a13 13 0 0 1 13 13z";i.tumblr="M150 209c-4-2-8-7-9-11l-2-27v-66h60V59h-60V0h-36q-3 20-9 33a70 70 0 0 1-18 22c-7 6-19 10-29 14v36h35v90q0 17 4 27t13 17a68 68 0 0 0 23 13 80 80 0 0 0 28 4 130 130 0 0 0 29-3 157 157 0 0 0 30-11v-40q-19 12-39 12a38 38 0 0 1-20-5z";i.twitter="M256 49a105 105 0 0 1-30 8 53 53 0 0 0 23-29 106 106 0 0 1-33 13 53 53 0 0 0-90 48A149 149 0 0 1 18 34a53 53 0 0 0 16 70 53 53 0 0 1-24-7v1a53 53 0 0 0 42 51 53 53 0 0 1-13 2 50 50 0 0 1-10-1 53 53 0 0 0 49 37 105 105 0 0 1-66 22 112 112 0 0 1-12-1 148 148 0 0 0 81 24c96 0 149-80 149-149v-7a105 105 0 0 0 26-27z";i.viber="M224 30c-10-11-33-30-99-30S34 30 34 30c-8 6-21 30-21 79s15 69 21 76 18 14 24 16a62 62 0 0110 5v50c2 0 7-5 7-5l33-36c4-3 10-3 10-3 35 2 83-3 102-23s24-52 24-88-10-60-20-71zm-29 137a49 49 0 01-11 14 20 20 0 01-12 5h-1a26 26 0 01-5-1 182 182 0 01-58-32l-12-11-1-1a155 155 0 01-10-12 276 276 0 01-18-26c-9-16-13-26-14-31l-1-1a26 26 0 010-5v-1c0-4 2-8 5-12a71 71 0 0114-11c5-3 10-2 13 2a215 215 0 0019 26 13 13 0 01-2 15l-7 5c-4 3-3 8-3 8s10 38 47 48c0 0 5 0 8-3l5-7c3-3 10-5 16-2l13 9 13 9c4 5 5 9 2 15zm-31-94c-7-8-18-13-31-14a4 4 0 010-8c16 2 28 7 37 17 9 9 13 21 13 36a3 3 0 01-3 3 3 3 0 01-1 0 3 3 0 01-3-3 3 3 0 010-1c-1-12-4-22-12-30zm-2 28a3 3 0 01-1 0h-1a3 3 0 01-3-3c-1-13-7-19-19-20a4 4 0 111-7c15 1 24 10 25 26a3 3 0 01-2 4zm36 14a4 4 0 01-4-4c0-22-7-39-19-52a67 67 0 00-49-19 3 3 0 01-3-3 3 3 0 010-1 3 3 0 013-3q32 1 54 21c15 14 22 34 22 57a4 4 0 01-4 4z";i.vk="M250 62c2-6 0-10-8-10h-28c-7 0-11 4-13 8 0 0-14 35-34 57-6 7-9 9-13 9-2 0-4-2-4-8V62c0-7-2-10-8-10H98a7 7 0 0 0-7 6c0 7 10 9 11 28v41c0 9-2 11-5 11-10 0-33-35-47-75-3-8-5-11-12-11H10c-8 0-10 4-10 8 0 7 10 44 44 93 23 33 56 51 86 51 17 0 20-4 20-11v-25c0-8 1-10 7-10 4 0 11 2 28 18 19 19 22 28 33 28h28c8 0 12-4 9-12s-11-19-23-33l-20-20c-4-5-3-8 0-12 0 0 35-48 38-65z";i.weibo="M190 125c-10-2-5-7-5-7s9-16-2-28c-15-14-50 2-50 2-14 4-10-2-8-12 0-12-4-33-40-21s-66 55-66 55c-22 29-19 51-19 51 5 49 57 62 97 65 42 3 99-14 117-51s-14-52-24-54zm-90 91c-42 2-76-19-76-47s34-50 76-52 76 15 76 43-34 54-76 56zm-8-81c-42 5-37 45-37 45s-1 12 11 19c25 13 50 5 63-12s5-57-37-52zm-11 56c-8 1-14-4-14-10s6-14 14-15c9-1 15 5 15 11s-7 13-15 14zm25-21c-2 2-6 1-7-1a6 6 0 0 1 2-8c3-2 6-2 7 1s1 6-2 8zm104-62a7 7 0 0 0 7-6c5-47-38-39-38-39a7 7 0 0 0 0 14c31-7 24 24 24 24a7 7 0 0 0 7 7zm-5-81c-15-3-30 0-34 0l-1 1h-1a10 10 0 0 0 3 20 48 48 0 0 0 9-2c4-2 35-1 50 24 8 19 4 32 3 34a29 29 0 0 0-2 10c0 5 5 9 10 9s9-1 10-9c16-55-20-81-47-87z";i.whatsapp="M256 125c0 69-56 124-126 124a126 126 0 0 1-60-15L0 256l23-67a123 123 0 0 1-18-64 125 125 0 0 1 251 0zM130 20C72 20 25 67 25 125a104 104 0 0 0 20 61l-13 39 40-13a106 106 0 0 0 58 18c59 0 106-47 106-105S189 20 130 20zm64 133l-6-3-21-10c-3-1-5-2-7 1l-10 12c-2 2-3 3-6 1s-13-5-25-15a92 92 0 0 1-17-21c-2-3-1-5 1-6l5-6a20 20 0 0 0 3-5 6 6 0 0 0-1-5l-9-23c-2-6-5-5-7-5h-6a11 11 0 0 0-8 4c-3 3-11 10-11 25s11 30 13 32 21 34 52 46 32 8 37 7 18-7 21-14 3-13 2-15z";i.wordpress="M128 0a128 128 0 1 0 128 128A128 128 0 0 0 128 0zM19 128a108 108 0 0 1 10-44l52 142a109 109 0 0 1-62-98zm109 109a108 108 0 0 1-31-5l33-94 33 91a11 11 0 0 0 1 2 109 109 0 0 1-36 6zm15-160l12-1c6-1 6-9 0-9l-29 1-29-1c-6 0-6 9-1 9l12 1 17 46-24 72L61 77l13-1c6-1 5-9-1-9l-29 1h-7a109 109 0 0 1 164-20h-1c-11 0-18 9-18 19 0 9 5 17 10 26 5 7 9 16 9 30 0 9-3 20-8 35l-11 36zm40 145l33-96c6-16 8-28 8-39a83 83 0 0 0-1-11 109 109 0 0 1-40 146z";i.xing="M157 256l-57-100L189 0h60l-89 156 57 100zm-94-77l45-74-33-58H18l34 58-45 74z";i.yahoo="M206 89c-6 2-63 46-67 57-1 4 0 40 1 46l36 1-1 11h-59l-52 1 2-11c5 0 28 1 32-4 3-3 2-38 1-43-2-7-52-70-65-80H0V51h114v16H80l46 63 46-42h-27l-4-16h100l-1 1h1l-7 11h-1l-2 4h-19l-6 1zm33 99h-9l-10-1v17h8l8 1zm17-80l-34-4 1 72 15 1z"},{}]},{},[]);
//# sourceMappingURL=share-menu.0b6caca7.js.map