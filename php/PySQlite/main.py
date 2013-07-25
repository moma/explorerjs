# -*- coding: utf-8 -*-

from FA2 import FA2 as FA2
from extractData import extract as SQLite
import networkx as nx
import matplotlib.pyplot as plt

def main():

    db=SQLite()
    db.extract()

    run = FA2()
    nx.draw(db.Graph,run.forceatlas2_layout(db.Graph,linlog=False,nohubs=False,iterations=300))
    plt.show()
    

if __name__ == "__main__":
    main()
