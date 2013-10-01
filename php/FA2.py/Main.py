
class ForceAtlas2:
	def __init__(self,graph):
		self.graph = graph
		self.p = {
		    "linLogMode": "false",
		    "outboundAttractionDistribution": "false",
		    "adjustSizes": "false",
		    "edgeWeightInfluence": 0,
		    "scalingRatio": 1,
		    "strongGravityMode": "false",
		    "gravity": 1,
		    "jitterTolerance": 1,
		    "barnesHutOptimize": "false",
		    "barnesHutTheta": 1.2,
		    "speed": 1,
		    "outboundAttCompensation": 1,
		    "totalSwinging": 0,
		    "swingVSnode1": 0,
		    "totalEffectiveTraction": 0,
		    "complexIntervals": 500,
		    "simpleIntervals": 1000
		}
		self.state = {"step": 0, "index": 0}
		self.rootRegion = 0

	def init(self):
		self.state = {"step": 0, "index": 0}
		for i in self.graph.nodes:
			self.graph.nodes[i]["fa2"] = {
				"mass": 1 + self.graph.nodes[i].degree,
				"old_dx": 0,
				"old_dy": 0,
				"dx": 0,
				"dy": 0
			}
		return self

	def go(self):
		while (self.atomicGo()):
			#something

	def atomicGo(self):
		graph = self.graph
		nodes = graph["nodes"]
		edges = graph["edges"]

		cInt = self.p["complexIntervals"]
		sInt = self.p["simpleIntervals"]
		
		case = self.state["step"]

		if   case==0:
							# Initialise layout data
			for i in nodes:
				if nodes[i]["fa2"]:
					nodes[i]["fa2"]["mass"] = 1 + nodes[i]["degree"]
					nodes[i]["fa2"]["old_dx"] = nodes[i]["fa2"]["dx"]
					nodes[i]["fa2"]["old_dy"] = nodes[i]["fa2"]["dy"]
					nodes[i]["fa2"]["dx"] = 0
					nodes[i]["fa2"]["dy"] = 0
				else:
					nodes[i]["fa2"] = {
						"mass": 1 + nodes[i]["degree"],
						"old_dx": 0,
						"old_dy": 0,
						"dx": 0,
						"dy": 0
					}
			
        		# If Barnes Hut active, initialize root region
        		if self.p["barnesHutOptimize"]:
          			#self.rootRegion = new sigma.forceatlas2.Region(nodes, 0);
          			#self.rootRegion.buildSubRegions();
       

        		# If outboundAttractionDistribution active, compensate.
        		if self.p["outboundAttractionDistribution"]:
				self.p["outboundAttCompensation"] = 0
				for i in nodes:
					self.p["outboundAttCompensation"] += nodes[i]["fa2"]["mass"]
				self.p["outboundAttCompensation"] /= len(nodes)
        
			self.state["step"] = 1
			self.state["index"] = 0


		elif case==1:
		    					# Repulsion
			Repulsion = ForceFactory.buildRepulsion(self.p["adjustSizes"],self.p["scalingRatio"])

		elif case==2:
		    					# Gravity

		elif case==3:
							# Attraction

		elif case==4:
		    					# Auto adjust speed

		elif case==5:
		    					# Apply forces

		else:
		    					# Do the default



inst = ForceAtlas2("thegraph")
print inst.p
