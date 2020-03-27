# tamis.js

modules Tamis en Javacript pour vérification solidité mdp dans navigateurs

## Origine

Au départ, la librairie tmdp.js s'est inspirée de loin de [PassChk, Tyler Akins](http://rumkin.com/tools/password/passchk.php)
pour la prise en compte des probabilités de caractères successifs dans un texte, facteur exploité par les crackeurs de mots de passe évolués.

Elle s'adapte à un contexte français plus récent :

- clavier latin avec jeu de caractères spécifiques : éçàù etc
- mots clés spécifiques à la population utilisants les mots de passe (Cyberwatch Richelieu https://github.com/tarraschk/richelieu et ajouts spécifiques MEF)
- moteurs Javascript plus modernes (compatibilité IE11 tout de même)
- recherche des caractères doublonnés, et de l'autosimilarité (réemploi d'un même motif à plusieurs reprises)

## Installation
1. Copier les fichiers .js (tmdp.js est le fichier principal qui calcule la solidité, hibp.js est un fichier secondaire qui teste si le mdp a déjà fuité). Il est recommendé d'héberger ces ressources statiques sur la même origine (au sens http). Sinon il faut introduire SRI et probablement la complexité de CORS.
2. Inclure les références dans le HTML/HEAD
3. Tester avec un panel de navigateurs (Chrome, Firefox, Safari, Edge, IE...)


## Interfaçage HTML
La page demo.html dans le répertoire est un exemple d'intégration.

Par défaut, tmdp.js 
- prend sa source dans un champ INPUT
- restitue son analyse sous plusieurs formes, une "case" remplie d'une lettre de A à E, une barre qui grandit proportionnellement à l'entropie estimée et un message littéral d'explication

tmdp.js utilise les variables d'environnement suivantes:

- HTML_PASSWORD ("password") : id du INPUT utilisé en entrée
- HTML_COMPLEXITE ("progress") : id du DIV dont la taille grandit de 1 à 100% (max) pour accompagner la frappe à chaque caractère
- HTML_MESSAGE  ("tmdp") : id du DIV utilisé pour insérer le message d'accompagnement.
- HTML_SCORE    ("strength") :  id du DIV utilisé pour l'évaluation A à E
- CSS_LABEL     ("c-label") : class CSS de base pour colorer les éléments ; les classes à définir sont (avec la valeur par défaut) sont "c-label" "c-label-A" etc.
- MSG_ENTROPIE  (false) : remplace le message d'accompagnement par une évaluation chiffrée de l'entropie si valeur positionnée à "true"

tmdp.js peut aussi vérifier côté client le respect d'une politique de mots de passe.
- MIN_LONGUEUR : longueur minimale
- MIN_CHARCLASS : nombre de classes dans le mots de passe parmi a-z / A-Z / 0-9 et autres (hors espace)
- MIN_ENTROPIE : imprévisibilité du mot de passe
Un critère positionné à 0 signifie qu'il n'est pas validé.

hibp.js n'est pas paramétrable et l'intégration passe par le respect de convention :
- "hibp" : id de la CHECKBOX (masquée initialement pour que la détection des fonctions navigateurs ne propose la fonction que si elle est possible ; on suppose que le navigateur est 'suffisament récent' pour qu'il comprenne le CSS visibility).

Pour changer les valeurs par défaut, par exemple HTML_PASSWORD, sans changer le fichier .js, il faut ajouter un attribut html-password au HTML/SCRIPT. Un exemple est donné dans demo.html pour les attributs msg-entropie et debug.

## CSP
Pour respecter une politique CSP réellement efficace (donc stricte et sans 'unsafe-inline' ou équivalent), l'inclusion de composants .js implique la référence au hash du fichier dans la directive correspondante.

` script-src: 'self' `
ou
` script-src: 'sha256-' `

Pour HIBP, il faut ajouter une référence au service qui fournit les hash de mots de passe fuités. Par défaut:
` connect-src: https://ssi.economie.gouv.fr `

Dans ce contexte, ssi.economie.gouv.fr ne sert que de proxy anonymisant vers le service haveibeenpown.com. Si vous ne souhaitez pas dépendre de ssi.economie.gouv.fr, il faut réaliser un proxy équivalent et modifier la référence dans le paramètre au début de hibp.js
