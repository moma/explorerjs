# -*- coding: utf-8 -*-

from FA2 import FA2 as FA2
from extractData import extract as SQLite
#import networkx as nx
#import matplotlib.pyplot as plt
#import time
#import pprint

import sys
reload(sys)
sys.setdefaultencoding('utf-8')

from flask import Flask
from flask import request
import simplejson as json
app = Flask(__name__)


@app.route("/getJSON")
def main():
	#I should be using the REST-format provided by Flask, 
	#but we've json transactions between differents ports (localhost vs localhost:8080 for ex.)
	#so I'm forced to use ajax-jsonp wich will add an unnecesary "?callback" parameter to my url
	#yes, the question mark ruins everything.
	#A GET example: localhost:8080/getJSON?unique_id=David__Chavalarias&it=2&callback=lalalala
	#The following two lines exclude that callback parameter. 

	unique_id = request.args['unique_id']
	i = int(request.args['it'])
	#callb = request.args['callback']
	#print request.args['unique_id']+" : "+request.args['it']
	#print unique_id+" + "+request.args['it']
	#unique_id=sys.argv[1]
	#i=int(sys.argv[2])
	#start = time.time() #====
	#unique_id = "David__Chavalarias"
	db=SQLite(unique_id)
	db.extract()       
    
	#end = time.time()	  #====
	#seconds1=end-start

	#start = time.time() #====
	#run = FA2()
	#for n in db.Graph.edges_iter():
	#	print n[0] + "," + n[1]
	#	pprint.pprint(  db.Graph[n[0]][n[1]] )
	#print
	#graphArray = db.buildJSON(run.forceatlas2_layout(db.Graph,linlog=False,nohubs=False,iterations=i))


	tempGraph = db.buildSimpleJSON(db.Graph)
	import urllib
	params = urllib.urlencode(tempGraph)
	#print params
	f = urllib.urlopen("http://localhost:9000/post", params)
	spatializedgraph = f.read() #<- FINALLY COORDINATES FROM FA2.java !!!
	#print spatializedgraph


	graphArray = db.buildJSON_sansfa2(db.Graph,spatializedgraph)
	#nx.draw(db.Graph, positions)     
	#end = time.time()	  #====
	#seconds2 = end-start

	#info = unique_id+"*"+str(i)+"___V:"+str(db.Graph.number_of_nodes())+",E:"+str(db.Graph.number_of_edges())
	#times = "___time:"+str(seconds1)+"[s]+"+str(seconds2)+"[s]="+str(seconds1+seconds2)+"[s]"
	#plt.savefig(info+times+".png")
	
	#Yes, we've to use that holly callback, else... it doesn't wooork :)
	#return callb+"("+json.dumps(graphArray)+")"
	return json.dumps(graphArray)


    

if __name__ == "__main__":
	#main()
	app.run(port=8080)
