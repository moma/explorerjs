from abc import ABCMeta, abstractmethod

class AttractionForce:
	__metaclass__ = ABCMeta

	@abstractmethod
	def apply(self,n1, n2, e): pass

class RepulsionForce:
	__metaclass__ = ABCMeta

	@abstractmethod
	def apply_nn(self): pass
	def apply_nr(self): pass
	def apply_ng(self): pass


class buildRepulsion(self,adjustBySize, coefficient):
		if adjustBySize:
			return self.linRepulsion_antiCollision(coefficient)
		else:
			return self.linRepulsion(coefficient)
	
	def buildAttraction(self, logAttraction, distributedAttraction, adjustBySize, coefficient):


	def getStrongGravity(self,coefficient)
		return self.strongGravity(coefficient);

class linRepulsion(RepulsionForce):

class linRepulsion_antiCollision(RepulsionForce):

class strongGravity(RepulsionForce):
	
	
