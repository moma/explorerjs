# Create your views here.

from django.http import HttpResponse
#from django.template.loader import get_template
from django.template import Context
import json
from search.whoosh_invoker import Search, The_Schema


query = "zinc"

def basicSearch(request):
	
	s = Search("whoosh")
	results = s.search(query)
	if results:
		html = "<html><body><table>"
		for r in results:	
			html += "<tr>"+"<td>"+r['CONTENT']+"</td>"+"<td>"+str(r['WOS_ID'])+"</td>"+"<td>"+str(r['ID'])+"</td>"+"</tr>"

		html += "</table></body></html>"
	else:
		html = "<html><body>nothing found</body></html>"

	return HttpResponse(html)


def search_titles(request):
	'''
	if request.method == "POST":
		search_text = request.POST["search_text"]
		s = Search("whoosh")
	else:
		search_text=""
	
	articles = s.search(query)
	
	return render_to_response('ajax_search.html', {'articles':articles})
	'''
	s = Search("whoosh")
	q = request.GET.get('term', '')
	if q:
		resultsRAW = s.search(q)
		print resultsRAW
		results = []
		for r in resultsRAW:
			dump = {}
			dump['id'] = r['ID']
			dump['value'] = r['CONTENT']
			dump['label'] = r['WOS_ID']
			results.append(dump)
		data = json.dumps(results)
	else:
		data = 'fail'
	mimetype = 'application/json'
	return HttpResponse(data, mimetype)





