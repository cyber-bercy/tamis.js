// hibp.js is a Javascript library, open sourced 
// under the CECILL B license http://www.cecill.info/licences.fr.html

'use strict;'


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
    //console.log(hash16);

    let range = hash16.slice(0, 5)
    let response = await fetch(`https://api.pwnedpasswords.com/range/${range}`)
    let body = await response.text()
    //console.log(body);

    let suffix = hash16.slice(5)
    let regex = new RegExp(`^${suffix}:`, 'm')
    return regex.test(body)
}

function ScoreHIBP() {
    //console.log("ScoreHIBP");
    var mdp = document.getElementById(HTML_PASSWORD).value;
    HaveIBeenPwned(mdp)
    .then(pwned => {
        if (pwned) {
            SetText("ALERTE : mot de passe éventé !");
            SetScore("E");
            console.log("HIBP!");
        }
    });
}


