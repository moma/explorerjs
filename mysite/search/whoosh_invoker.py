from whoosh.fields import Schema, SchemaClass ,  ID, KEYWORD, TEXT, NUMERIC
from whoosh.index import create_in, open_dir
from whoosh.query import Term
from whoosh.qparser import QueryParser
import os
import sqlite3
import time
import pprint

class The_Schema(SchemaClass):
	ID = ID(stored=True,unique=True)
	WOS_ID = NUMERIC(stored=True)
	CONTENT = TEXT(stored=True)

class Whooshify:
	def __init__(self,db):	
		self.db = db
		self.conn = sqlite3.connect(db+'.db')
		self.conn.row_factory = sqlite3.Row# Magic line!
		self.curs = self.conn.cursor()

	def close(self):
		self.conn.close()

	def generate(self,table,columns):
		schema = The_Schema()
		main="whoosh/"
		if not os.path.exists(main+table):
		    os.mkdir(main+table)
		index = create_in(main+table, schema)

		try:
			self.curs.execute("SELECT "+','.join(columns)+" FROM "+table)
			data=self.curs.fetchall()
			writer = index.writer()
			start = time.time()
			for row in data:
				#print str(row['id'])+" : "+str(row['wos_id'])+" <- "+row['terms_id']
				writer.update_document(
					ID=unicode(row['rowid']),
					WOS_ID=unicode(row['id']),
					CONTENT=row['data'])

			writer.commit()
			end = time.time()
			print "\t\t\t\t\t"+str(end-start)+" [s]"


		except Exception as error:
			print "error"
			print error


	def generateOneIndex(self,tables,columns):
		schema = The_Schema()
		maintable="whoosh"
		if not os.path.exists(maintable):
		    os.mkdir(maintable)
		index = create_in(maintable, schema)


		for table in tables:
			try:
				self.curs.execute("SELECT "+','.join(columns)+" FROM "+table)
				data=self.curs.fetchall()
				writer = index.writer()
				start = time.time()
				for row in data:
					#print str(row['id'])+" : "+str(row['wos_id'])+" <- "+row['terms_id']
					writer.update_document(
						ID=unicode(row['rowid']),
						WOS_ID=unicode(row['id']),
						CONTENT=row['data'])

				writer.commit()
				end = time.time()
				print "\t\t\t\t\t"+str(end-start)+" [s]"


			except Exception as error:
				print "error"
				print error


class Search:
	def __init__(self,table):	
		self.table = table
	

	def search(self,q):

		ix = open_dir(self.table)
		sc = ix.searcher()

		query = QueryParser("CONTENT", ix.schema).parse(u""+q)
		#print "query:",query
		r = sc.search(query,limit=None)
		#print len(r)
		return r

	
	def getTitle(self,wos_id):
		ix = open_dir("ISITITLE")
		sc = ix.searcher()
		query = QueryParser("WOS_ID", ix.schema).parse(u""+wos_id)
		r = sc.search(query,limit=None)
		return r[0]['CONTENT']

	def getCountry(self,wos_id):
		ix = open_dir("ISIC1Country")
		sc = ix.searcher()
		query = QueryParser("WOS_ID", ix.schema).parse(u""+wos_id)
		r = sc.search(query,limit=None)
		return r[0]['CONTENT']


	def getAbstract(self,wos_id):
		ix = open_dir("ISIABSTRACT")
		sc = ix.searcher()
		query = QueryParser("WOS_ID", ix.schema).parse(u""+wos_id)
		r = sc.search(query,limit=None)
		return r[0]['CONTENT']


	
	

'''
if __name__ == "__main__":
	tablename = "ISIterms"
	
	# rowid	: autoincremental id
	# id	: wos_id
	# data	: data to index
	columns = ["rowid","id","data"]
	tables = ["ISIterms","ISITITLE","ISIAUTHOR"]

	idx = Whooshify("homework-20750-1-homework-db")#open db

	#idx.generateOneIndex(tables,columns)

	#idx.generate("ISIterms",columns)#create index for x table
	#idx.generate("ISITITLE",columns)#create index for x table
	#idx.generate("ISIAUTHOR",columns)#create index for x table
	#idx.generate("ISIABSTRACT",columns)#create index for x table
	#idx.generate("ISIC1Country",columns)#create index for x table

	#s = Search("ISIterms")
	#results = s.search("zinc OR anthropogenic") #da query |m|
	#print results
	##str(list(results))
	#print
	#for r in results:
	#	print "cont:"+r['CONTENT']+" , wos:"+r['WOS_ID']+" , rowid:"+r['ID']
	#	print "\t"+s.getTitle(r['WOS_ID'])
	#	print "\t"+s.getCountry(r['WOS_ID'])
	#	print "\t"+s.getAbstract(r['WOS_ID'])
	#	print
	#	print 

	idx.close()#close db

	#s = Search("oneindex")
	#results = s.search(os.sys.argv[1])
	#print str(list(results))
'''








