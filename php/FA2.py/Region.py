import math

class Region:

	def __init__(self,nodes, depth):
		print "the atributes"		
		self.depthLimit = 20
		self.size = 0
		self.nodes = nodes
		self.subregions = []
		self.depth = depth
		self.p = { "mass": 0, "massCenterX": 0, "massCenterY": 0 }
		self.updateMassAndGeometry()

	def updateMassAndGeometry(self):
		print "updating mass and geometry"
		'''
		nds = self.nodes
		if nds.length > 1:
			mass=0
			massSumX=0
			massSumY=0
			for n in nds:
				mass += nds[n]['fa2']['mass']
				massSumX += nds[n]['x'] * nds[n]['fa2']['mass']
				massSumY += nds[n]['x'] * nds[n]['fa2']['mass']

			massCenterX = massSumX / mass
			massCenterY = massSumY / mass
			size=0
			for n in nds:
				distance = math.sqrt( (nds[n]['x'] - massCenterX) *(nds[n]['x'] - massCenterX) +(nds[n]['y'] - massCenterY) *(nds[n]['y'] - massCenterY) )
				size = max(size || (2 * distance), 2 * distance)
			
			self.p['mass'] = mass;
			self.p['massCenterX'] = massCenterX;
			self.p['massCenterY'] = massCenterY;
			self.size = size;
		'''


	def buildSubRegions(self):
		print "buildSubRegions"

		nds = self.nodes
		if nds.length > 1:
			leftNodes = []
			rightNodes = []
			subregions = []
			massCenterX = self.p['massCenterX']
			massCenterY = self.p['massCenterY']
			nextDepth = self.depth + 1
			for n in nds:
				#nodesColumn = (nds[n]['x'] < massCenterX) ? (leftNodes) : (rightNodes);
				if (nds[n]['x'] < massCenterX):	nodesColumn = leftNodes
				else:	nodesColumn = rightNodes
				nodesColumn.append(nds[n])
			tl = []
			bl = []
			br = []
			tr = []

			for n in leftNodes:
				#nodesLine = (leftNodes[n]['y'] < massCenterY) ? (tl) : (bl);
				if (leftNodes[n]['y'] < massCenterY): nodesLine = tl
				else: nodesLine = bl
				nodesLine.append(leftNodes[n])
			for n in rightNodes:
				#nodesLine = (leftNodes[n]['y'] < massCenterY) ? (tl) : (bl);
				if (rightNodes[n]['x'] < massCenterX: nodesLine = tr
				else: nodesLine = br
				nodesLine.append(leftNodes[n])
			listsum = tl+bl+br+tr
			filtList = [elem for elem in listsum if listsum[elem].length]
			for a in filtList:
				if (nextDepth <= self.depthLimit && filtList[a].length < self.nodes.length):
					subregion = Region(filtList[a],nextDepth)
					subregions.append(subregion)
				else:
					for n in filtList[a]:
						oneNodeList = filtList[a][n]
						subregion = Region(oneNodeList, nextDepth)
						subregions.append(subregion)

			self.subregions = subregions
			for i in subregions:
				subregions[i].buildSubRegions()



			

	def applyForce(self, n , Force , theta):
		print "applyForce"
		if self.nodes.length < 2:
			regionNode = self.nodes[0]


def test():
	inst = Region("nodes","depth")
	print inst.p['mass']


test()
