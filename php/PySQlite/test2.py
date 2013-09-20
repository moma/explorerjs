# -*- coding: utf-8 -*-

from extractData import extract as SQLite

import sys
reload(sys)
sys.setdefaultencoding('utf-8')


def main():

	db=SQLite("")
	db.extract2("SELECT * FROM scholars where country = \"Chile\" ")

	#return queryFromFilter#json.dumps(graphArray)


    

if __name__ == "__main__":
	main()
	#app.run(port=8080)
