# -*- coding: utf-8 -*-

from FA2 import ForceAtlas2
from extractData import extract as SQLite

import sys
reload(sys)
sys.setdefaultencoding('utf-8')

from flask import Flask
from flask import request
import simplejson as json
app = Flask(__name__)


@app.route("/getJSON")
def main():
	#query = request.args['query']
	#{"categorya"%3A"Keywords"%2C"categoryb"%3A"Scholars"%2C"keywords"%3A[]%2C"countries"%3A["Chile"]%2C"laboratories"%3A[]%2C"coloredby"%3A[]%2C"tags"%3A[]%2C"organizations"%3A[]}

#	i=int(sys.argv[2])
#	unique_id = sys.argv[1]
#	db=SQLite(unique_id)
#	db.extract()



	# < Data Extraction > #
	i = int(request.args['it'])

	if request.args.has_key("query"):
		db=SQLite("")
		print request.args['query']
		print i
		db.extract2(request.args['query'])
	else:
		unique_id = request.args['unique_id']
		db=SQLite(unique_id)
		db.extract()
	# < / Data Extraction > #


	tempGraph = db.buildSimpleJSONFinal(db.Graph)
	spatialized = ForceAtlas2(tempGraph)
	spatialized.init()

	spatialized.getGraph()

	for i in range(0,i):
		spatialized.atomicGo()
	

	graphArray = db.buildJSON_sansfa2(db.Graph,spatialized.getGraph())

	return json.dumps(graphArray)


    

if __name__ == "__main__":
#	main()
	app.run(port=8080)
