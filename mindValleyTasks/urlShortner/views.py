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

        # check if url is already present
        try:
            url_object = URL.objects.filter(original_url=url)
        except Exception as e:
            logger.exception(e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data="Something went wrong! Please try again later!")
        else:

            if (len(url_object)>0):
                logger.debug("URL already present: %s --- %s" %(url_object[0].original_url, url_object[0].original_url))
                return Response(status=status.HTTP_200_OK, data=url_object[0].shortened_url)

        # create URL object
        try:
            url_object= URL.objects.create(original_url=url)
            short_url = url_object.url_shortner()

            logger.debug("Generated short url %s for: %s" %(short_url, url))

            url_object.shortened_url = short_url
            url_object.save()

        except Exception as e:
            logger.exception(e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data="Something went wrong! Please try again later!")

        else:
            logger.debug("URL shortened: %s --- %s" %(url_object.original_url, url_object.shortened_url))
            return Response(status=status.HTTP_200_OK, data=short_url)


def redirect(request, short_url):
    """ redirects a shortened url to the original url """
    
    try:
        url = URL.objects.get(shortened_url=short_url)
    except Exception as e:
        return render(request, 'templates/404.html')
    
    response = HttpResponse(url.original_url, status=302)
    response['Location'] = url.original_url
    return response

