#!/usr/bin/env python 

import fileinput

vocabulaire = {}

for ligne in fileinput.input():
    mot = ligne.strip("\n ")
    if mot[0:2] <> "//" :
        vocabulaire[mot] = len(mot)

for mot, longeur in vocabulaire.items():
    if longueur >= 4 :
        print ( "\"{0}\": {1},".format(mot, longueur) )
