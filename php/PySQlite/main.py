# -*- coding: utf-8 -*-

from FA2 import FA2 as FA2
from extractData import extract as SQLite
import networkx as nx
import matplotlib.pyplot as plt

import sys
reload(sys)
sys.setdefaultencoding('utf-8')

def main():
    unique_id=sys.argv[1]
    i=int(sys.argv[2])
    print unique_id+"*"+str(i)

    db=SQLite(unique_id)
    db.extract()

    run = FA2()
    nx.draw(db.Graph,run.forceatlas2_layout(db.Graph,linlog=False,nohubs=False,iterations=i))
    plt.savefig(unique_id+"*"+str(i))

    

if __name__ == "__main__":
    main()
