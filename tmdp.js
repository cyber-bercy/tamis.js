// tmdp.js is a Javascript library, open sourced 
// under the CECILL B license http://www.cecill.info/licences.fr.html


function Set_Text(s) {
    console.log(s);
    
    var e;
    if (!document.getElementById) { return; }
  
    e = document.getElementById('tmdp');
    if (!e || e.innerHTML == s) { return; }
   
    e.innerHTML = s;
}

function ShowTmdp() {
    var mdp = document.tmdp_form.passchk.value;
    var mdp_lower = mdp.toLowerCase();
    var s = "", bits = 0, score = "";

    bits = mdp.length * 4 ; // valeur moyenne à ce stade

    if (bits < 18) {
        s += "ALERTE : trop court, ce n'est plus un mot de passe !<br />";
        score = "E";
    } else if (bits < 36) {
        s += "FAIBLE : suffisant pour des mots de passe locaux, mais pas réseau. <br />";
        score = "D";
    } else if (bits < 72) {
        s += "MOYEN : cela suffit généralement à détourner des crackeurs de mots de passe amateurs. <br />";
        score = "C";
    } else if (bits < 96) {
        s += "SOLIDE : les attaques par dictionnaires ne réussiront pas ; attention seulement au réemploi. <br />";
        score = "B";
    } else if (bits < 256) {
        s += "FORT : sauvegarder bien votre mot de passe parce que vous ne pourrez pas le retrouver. <br />"
        score = "A";
    } else {
        s += "Il n'y a pas de prix à gagner au mot de passe le plus long.";
        score = "A+";
    }
    Set_Text(s);
}

function CheckIfLoaded() {
    Set_Text("Finished Loading.");
}

window.setTimeout('CheckIfLoaded()', 100);