// tmdp.js is a Javascript library, open sourced 
// under the CECILL B license http://www.cecill.info/licences.fr.html

'use strict;'

// dictionnaire de composants courants de mots de passe

const CommonWords ={
    // top100   
    "azerty": 6,
    "zxcvbn": 6,
    "12345678": 8,
    "123456": 6,
    "0000": 4,
    "5555": 4,
    "1234": 4,
    "poiuy": 5,
    // prénoms
    "anne": 4,
    "jean": 4,
    "john": 4,
    "philippe": 8,
    "pierre": 6,
    "stephane": 8,
    // villes
    "france": 6,
    "paris": 5,
    "lyon": 4,
    "marseille": 8,
    // logins/password par défaut
    "root" : 4,
    "admin" : 5,
    "administrateur": 14,
    "administrator": 13,
    "tomcat": 6,
    // mois
    "janvier": 7,
    "fevrier": 7,
    "mars": 4,
    "avril": 5,
    "mai": 3,
    "juin": 4,
    "juillet": 7,
    "aout": 4,
    "septembre": 9,
    "octobre": 7,
    "novembre": 8,
    "decembre": 8,
    // jours
    "lundi": 5,
    "mardi": 5,
    "mercredi": 8,
    "jeudi": 5,
    "vendredi": 8,
    "samedi": 6,
    "dimanche": 8,
    // saisons
    "hiver": 5,
    "printemps": 9,
    "ete" : 3,
    "automne": 7,
    // années courantes
    "1998": 4,
    "2000": 4,
    "2018": 4,
    "2019": 4,
    "2020": 4,
    "2024": 4,
    // noms de services
    "tresor": 6,
    "insee": 5,
    "hfds": 4,

    // personnages, planètes ? utilité pas garentie par rapport à matrice co-occurence
    // dates, codes postaux, numéro de tél ? utilité pas garantie par rapport à matrice co-occurence
}
const MinLengthCommonWords = 3
const BitsCommonWords = Math.log2(Object.keys(CommonWords).length);
const BitsChar = Math.log2(26);
const BitsNum = Math.log2(10);
const BitsAlt = Math.log2(38);


function FrenchLowerCase(s) {
    var r = s.toLowerCase();
    r = r.replace(/é/g, "e").replace(/è/g, "e").replace(/ê/g, "e").replace(/ë/g, "e");
    r = r.replace(/à/g, "a").replace(/â/g, "a").replace(/â/g, "a");
    r = r.replace(/ô/g, "o").replace(/ö/g, "o");
    r = r.replace(/ù/g, "u").replace(/û/g, "u").replace(/ü/g, "u");
    r = r.replace(/î/g, "i").replace(/ï/g, "i");
    r = r.replace(/ç/g, "c");
    return r;
}

function Toogle(s) {
    var r = s.replace(/4/g, "a").replace(/@/g, "a").replace(/6/g, "b").replace(/</g, "c").replace(/{/g, "c");
    r = r.replace(/3/g, "e").replace(/9/g, "g").replace(/1/g, "i").replace(/\!/g, "i");
    r = r.replace(/0/g, "o").replace(/9/g, "q").replace(/5/g, "s").replace(/\$/g, "s");
    r = r.replace(/7/g, "t").replace(/\+/g, "t").replace(/\%/g, "x");
    return r;
}

function CheckCommonWords(s) {
    if (CommonWords[s]) {
        console.log("ALERTE : ", s, " présent dans le dictionnaire.");
        return true;
    }
    return false;
}


// EvalMdp essaie de trouver la transformation qui minimise l'entropie.
function EvalTmdp(mdp) {
    var s = FrenchLowerCase(mdp);
    var r = RawEvalMdp(s); 

    var toogled = Toogle(s);
    if ( toogled != s ) {
        var v = EvalTmdp(toogled);
        if ( v < r ) {
            r = v;
            console.log("better toogled: ", toogled);
        }
    }

    var l = s.length
    for (var m=MinLengthCommonWords; m <= l; m++){
        for (var i=0; i+m <= l; i++) {
            var sub = s.slice(i, i+m)
            if (CheckCommonWords(sub)) {
                var prefix = s.slice(0,i);
                var suffix = s.slice(i+m, l);
                var v = EvalTmdp(prefix) + BitsCommonWords + EvalTmdp(suffix);
                if ( v < r ) {
                    r = v;
                    console.log("better: ", prefix, sub, suffix);
                }
            }
        }
    }
    return r;
}

// RawEvalMdp est une évaluation brute et moyenne de l'entropie
function RawEvalMdp (mdp) {
    console.log("RawEvalMdp: ", mdp);
    return mdp.length * 4; // valeur moyenne à ce stade
}

function Set_Text(s) {
    var e;
    if (!document.getElementById) { return; }
  
    e = document.getElementById('tmdp');
    if (!e || e.innerHTML == s) { return; }
   
    e.innerHTML = s;
}

function ShowTmdp() {
    var mdp = document.tmdp_form.passchk.value;
    var s = "", bits = 0, score = "";


 //   console.log("ShowTmdp : ", mdp);

    bits = EvalTmdp(mdp);

    s = bits + " bits <br />";
    if (bits < 24) {
        s += "ALERTE : tellement faible qu'il peut être trouvé par une attaque en ligne <br />";
        score = "E";
    } else if (bits < 48) {
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
    Set_Text("Prêt.");
}

window.setTimeout('CheckIfLoaded()', 100);

