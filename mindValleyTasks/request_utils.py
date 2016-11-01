"""
generic utilties to be used
"""

import json
import string
import logging
from rest_framework.parsers import JSONParser

logger = logging.getLogger(__name__)

# check if an entity exists, return if False
def check_dict(d, val):

    if (val in d):
    
        return d[val]
    
    else:
    
        return None

# returns a dictionary of content from a request
def parse_request(request):

    content = {}

    # POST request from mobile client
    try:
        # fetch data from request object
        #logger.debug("Trying to fetch data from request using JSONParser method")
        content = JSONParser().parse(request)

    except:

        # DRF panel
        try:
            # fetch data from _content parameter in drf request object
            #logger.debug("Trying to fetch data from request.POST['_content']")
            content = json.loads(request.POST["_content"])

        except:
            # POST request through web-site ajax request
            #logger.debug("Trying to fetch from request.POST")
            content = request.POST
            if request.FILES:
                content.update(request.FILES)

            # fetch data from request.data
            try:
                #logger.debug("Trying to fetch data from request.data")
                content = request.data
            
            except:
                logger.exception("Unable to fetch data from request.")

    logger.debug("content in parse_request: %s\ttype: %s" %(content, type(content)))
    return content


"""
Accepts API name, request object, serializer, list of required_fields(optional), request_type(optional) 
Returns boolean valid_data flag and dictionary of required_fields/value pairs

Accepts a request object and a list of required fields,
checks for values of required fields list in the request content
and returns a dict of available fields & valid_data boolean flag
if all required_fields data is present in request 

*request type: 
By default is 1 -> serves POST data from clients
Type 2 -> serves data sent through DRF panel

* De-serialisation available in 2 types:
1. Using serializer to be provided as parameter ('serializer')
2. Custom serializer: for debugging purposes, points out particular field with missing data
"""

# fetch content in dict -> de-serialise data if valid -> return is_valid flag and data
def get_request_content(api_name, request, serializer=None, required_fields=None, request_type=None):

    data = {}
    valid_data_flag = True

    # parse request
    # fetch request data content in a dictionary
    content = parse_request(request)

    # proceed to de-serialisation of content

    # check for required_fields
    # if present, use custom de-serialisiation
    if (required_fields != None):

        # custom de-serialisation
        # Points on particular field that is missing in request data
        # fill data with required fields
        # immediately exit & return false & empty dict if a particular field is not found
        #logger.debug("Custom serializer being used for %s" %api_name)
        
        for field in required_fields:

            # find value of field in request obj
            value = check_dict(content, field)
            data[field] = value

            # if not value:

            #     valid_data_flag = False
            #     logger.error("Field not present in request object.\nAPI:%s\nField: %s\nRequest: %s\n" %(api_name, field, content))
            #     return (valid_data_flag, {})

            # else:

            #     data[field] = value

        logger.info("Valid Content in request object:\nAPI: %s\nContent: %s\n" %(api_name, data))
        return (valid_data_flag, data)

    # serializer de-serialisation
    # serializer sent to function as parameter 'serializer'
    elif (serializer != None):


        # de-serialize content using serializer
        logger.debug("Serializer for %s: %s" %(api_name, serializer))
        s = serializer(data=content)
        valid_data_flag = s.is_valid()
        data = s.data
        
        if (valid_data_flag):

            logger.info("Valid Content in request object:\nAPI: %s\nContent: %s\n" %(api_name, data))
            return (valid_data_flag, data)

        else:

            logger.info("In-valid Content in request object:\nAPI: %s\nContent: %s\n" %(api_name, content))
            return (valid_data_flag, data)

    else:

        logger.error("Missing serializer in get_request_content")
        return (False, None)


