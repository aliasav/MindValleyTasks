from django.shortcuts import render

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from request_utils import parse_request, get_request_content

from urlShortner.models import URL
from django.core.validators import URLValidator
from django.http.response import HttpResponse

import logging
logger = logging.getLogger(__name__)

@api_view(["POST"])
def shorten(request):
	""" accepts url in POST request, shortens and saves in DB """

	data = parse_request(request)

	url = data.get("url", None)

	if not url:
		return Response(status=status.HTTP_400_BAD_REQUEST, data="No url in request!")
	else:

		validate = URLValidator()
		try:
			validate(url)
		except Exception as e:
			logger.exception(e)
			return Response(status=status.HTTP_400_BAD_REQUEST, data=e)
		
		try:
			url_object= URL.objects.create(original_url=url)
			short_url = url_object.url_shortner()

			logger.debug("Generated short url %s for: %s" %(short_url, url))

			url_object.shortened_url = short_url
			url_object.save()

		except Exception as e:
			logger.exception(e)
			return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data=e)

	
	return Response(status=status.HTTP_200_OK, data=short_url)


def redirect(request, short_url):
    
    try:
        url = URL.objects.get(shortened_url=short_url)
    except Exception as e:
        return render(request, 'templates/404.html')
    
    res = HttpResponse(url.original_url, status=302)
    res['Location'] = url.original_url
    return res

