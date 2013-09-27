# Create your views here.

from django.http import HttpResponse
#from django.template.loader import get_template
from django.template import Context

from search.whoosh_invoker import Search, The_Schema

def basicSearch(request):
	
	query="zinc"
	s = Search("whoosh")
	results = s.search(query)
	html = "<html><body><table>"
	for r in results:	
		html += "<tr>"+"<td>"+r['CONTENT']+"</td>"+"<td>"+str(r['WOS_ID'])+"</td>"+"<td>"+str(r['ID'])+"</td>"+"</tr>"

	html += "</table></body></html>"

	return HttpResponse(html)
