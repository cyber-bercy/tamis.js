# tamis.js

modules Tamis en Javacript pour vérification solidité mdp dans navigateurs

## Origine

Au départ, la librairie tmdp s'insipre de loin de [PassChk, Tyler Akins](http://rumkin.com/tools/password/passchk.php),
Elle s'adapte à un contexte français plus récent :

- clavier latin avec jeu de caractères spécifiques : éçàù etc
- mots clés spécifiques à la population utilisants les mots de passe (Cyberwatch Richelieu https://github.com/tarraschk/richelieu et ajouts spécifiques MEF)
- moteurs Javascript plus modernes (compatibilité IE11 tout de même)
- recherche des caractères doublonnés, et de l'autosimilarité (réemploi d'un même motif à plusieurs reprises)

## Installation
1. Copier les fichiers .js (tmdp.js est le fichier principal qui calcule la solidité, hibp.js est un fichier secondaire qui teste si le mdp a déjà fuité).
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
- MSG_ENTROPIE  (false) : remplace le message d'accompagnement par une évaluation chiffrée de l'entropie.

hibp.js n'est pas paramétrable et l'intégration passe par le respect de convention :
- "hibp" : id de la CHECKBOX (masquée initialement pour que la détection des fonctions navigateurs ne propose la fonction que si elle est possible)

Pour changer les valeurs par défaut, par exemple HTML_PASSWORD, sans changer le fichier .js, il faut ajouter un attribut html-password au HTML/SCRIPT. Un exemple est donné dans demo.html pour les attributs msg-entropie et debug.

## SRI et CSP
Conformément au standard ministériel, l'inclusion de composants .js implique la référence au hash du fichier


script-src: 'self' 'sha256-'

Pour HIBP, il faut ajouter 
connect-src: https://ssi.economie.gouv.fr

Dans ce contexte, ssi.economie.gouv.fr ne sert que de proxy anonymisant vers le service haveibeenpown.com. Si vous ne souhaitez pas dépendre de ssi.economie.gouv.fr, il faut réaliser un proxy équivalent et modifier la référence dans le code source.
