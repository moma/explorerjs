# -*- coding: utf-8 -*-

from FA2 import FA2 as FA2
from extractData import extract as SQLite

def main():
    #instancia = FA2()
    #print instancia.variable
    db=SQLite()
    db.extract()

if __name__ == "__main__":
    main()
