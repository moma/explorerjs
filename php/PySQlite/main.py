# -*- coding: utf-8 -*-

from FA2 import FA2 as FA2
from extractData import extract as SQLite
import networkx as nx
import matplotlib.pyplot as plt
import time
import pprint

import sys
reload(sys)
sys.setdefaultencoding('utf-8')

def main():
	unique_id=sys.argv[1]
	i=int(sys.argv[2])

	start = time.time() #====
	db=SQLite(unique_id)
	db.extract()       
	end = time.time()	  #====
	seconds1=end-start

	start = time.time() #====
	run = FA2()
	'''
	for n in db.Graph.edges_iter():
		print n[0] + "," + n[1]
		pprint.pprint(  db.Graph[n[0]][n[1]] )
	print
	'''
	db.buildGEXF(run.forceatlas2_layout(db.Graph,linlog=False,nohubs=False,iterations=i))
	'''
	nx.draw(db.Graph, positions)     
	end = time.time()	  #====
	seconds2 = end-start

	info = unique_id+"*"+str(i)+"___V:"+str(db.Graph.number_of_nodes())+",E:"+str(db.Graph.number_of_edges())
	times = "___time:"+str(seconds1)+"[s]+"+str(seconds2)+"[s]="+str(seconds1+seconds2)+"[s]"
	plt.savefig(info+times+".png")
	'''


    

if __name__ == "__main__":
    main()
