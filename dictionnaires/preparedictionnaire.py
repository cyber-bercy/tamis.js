#!/usr/bin/env python 

import fileinput

for line in fileinput.input():
    l = line.rstrip("\n")
    print ("\"{0}\": {1},".format(l,len(l)))
