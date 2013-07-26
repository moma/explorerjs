# -*- coding: utf-8 -*-

from FA2 import FA2 as FA2
from extractData import extract as SQLite
import networkx as nx
import matplotlib.pyplot as plt
import time

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
    nx.draw(db.Graph,run.forceatlas2_layout(db.Graph,linlog=False,nohubs=False,iterations=i))     
    end = time.time()	  #====
    seconds2 = end-start

    info = unique_id+"*"+str(i)+"___V:"+str(db.Graph.number_of_nodes())+",E:"+str(db.Graph.number_of_edges())
    times = "___time:"+str(seconds1)+"[s]+"+str(seconds2)+"[s]="+str(seconds1+seconds2)+"[s]"
    plt.savefig(info+times+".png")


    

if __name__ == "__main__":
    main()
