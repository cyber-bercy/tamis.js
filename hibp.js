// hibp.js is a Javascript library, open sourced 
// under the CECILL B license http://www.cecill.info/licences.fr.html

"use strict";

const HTML_HIBP = "hibp";

async function sha1(s) {
    var buffer = new TextEncoder("utf-8").encode(s);
    return crypto.subtle.digest("SHA-1", buffer);
}

function arrayBufferToHex (arrayBuffer) {
    var view = new Uint8Array(arrayBuffer)
    var result = ''
    var value
  
    for (var i = 0; i < view.length; i++) {
      value = view[i].toString(16)
      result += (value.length === 1 ? '0' + value : value)
    }
  
    return result
  }

async function HaveIBeenPwned(s) {
    let hashbuffer = await sha1(s);
    let hash16 = arrayBufferToHex(hashbuffer).toUpperCase();
    DebugLog(hash16);

    let range = hash16.slice(0, 5)
    let response = await fetch(`https://ssi.economie.gouv.fr/hibp/${range}`)
    let body = await response.text()
    DebugLog(body);

    let suffix = hash16.slice(5)
    let regex = new RegExp(`^${suffix}:`, 'm')
    return regex.test(body)
}

function ScoreHIBP() {
    DebugLog("ScoreHIBP");
    var mdp = document.getElementById(HTML_PASSWORD).value;
    HaveIBeenPwned(mdp)
    .then(pwned => {
        if (pwned) {
            SetText("ALERTE : mot de passe déjà éventé !");
            SetScore("E");
            DebugLog("HIBP!");
        }
    });
}


async function StartHIBP () {
    var e = document.getElementById(HTML_HIBP)
    if (!e) {
        return;
    }
    let h = await sha1("test");
    if (h && (h.byteLength == 20) ) {
        e.addEventListener("click", ScoreHIBP, false);
        console.log("change visible")
        e.parentNode.style.visibility = "visible";
    }
}

window.addEventListener("load", StartHIBP, false);

