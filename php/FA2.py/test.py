
from FA2 import ForceAtlas2
import random

def poblate():
	nodes=[]
	n1 = {
		"x":random.uniform(0,1),
		"y":random.uniform(0,1),
		"fixed":False,
		"degree":3,
		"size":3
	}
	n2 = {
		"x":random.uniform(0,1),
		"y":random.uniform(0,1),
		"fixed":False,
		"degree":1,
		"size":5
	}
	n3 = {
		"x":random.uniform(0,1),
		"y":random.uniform(0,1),
		"fixed":False,
		"degree":0,
		"size":2
	}
	n4 = {
		"x":random.uniform(0,1),
		"y":random.uniform(0,1),
		"fixed":False,
		"degree":0,
		"size":3
	}
	nodes.append(n1)
	nodes.append(n2)
	nodes.append(n3)
	nodes.append(n4)

	edges = []
	e1 = {
		"source":n3,
		"target":n1,
		"weight":1
	}
	e2 = {
		"source":n3,
		"target":n2,
		"weight":2
	}
	e3 = {
		"source":n2,
		"target":n1,
		"weight":1
	}
	e4 = {
		"source":n4,
		"target":n1,
		"weight":1
	}
	edges.append(e1)
	edges.append(e2)
	edges.append(e3)
	edges.append(e4)


	graph={"nodes":nodes,"edges":edges}
	return graph

a=ForceAtlas2(poblate())
a.init()
a.atomicGo()
a.atomicGo()
a.atomicGo()
a.atomicGo()
a.atomicGo()
a.atomicGo()
a.atomicGo()
a.atomicGo()
a.atomicGo()
a.atomicGo()
a.atomicGo()
a.atomicGo()
a.atomicGo()
a.atomicGo()
a.atomicGo()
a.atomicGo()
a.atomicGo()
a.atomicGo()
