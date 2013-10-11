# Create your views here.

from django.http import HttpResponse
from django.template.loader import get_template
from django.template import Context

def hello(request):
	name = "Sam"
	html = "<html><body>Who am I: %s</body></html>" % name
	return HttpResponse(html)


def ejemplo_template(request):
	daname = "Sam"
	t = get_template('prueba.html')
	html = t.render(Context({'name':daname}))
	return HttpResponse(html)

