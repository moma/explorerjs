# -*- coding: utf-8 -*-
from extractData import extract as SQLite
import sys
reload(sys)
sys.setdefaultencoding('utf-8')

def main():
	db=SQLite("Arnaud__Banos")
	db.extract()   
	db.buildSimpleJSON(db.Graph)

if __name__ == "__main__":
	main()
