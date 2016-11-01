from django.shortcuts import render

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from request_utils import parse_request, get_request_content

from cv_parser.models import CV, Link, Qualification, WorkExperience, Project, Interest

import logging
import re

logger = logging.getLogger(__name__)


"""
{
	"name": "",
	"email": "",
	"dob": "",
	"phone_number": "",
	"stackOverFlowLink": "",
	"linkedinLink": "",
	"githubLink": "",
	"qualifications": [],
	"work_experiences": [],
	"projects": [],
	"interests": [],

}
"""

@api_view(["POST"])
def post_cv(request):
	""" accepts JSON for a CV and saves in db """

	data = parse_request(request)

	# initialise data validator
	dv = DataValidator(data)	

	# create cv object
	try:
		if dv.validate_basic_data():		
			cv = CV.objects.create(
				name=data.get("name", None),
				dob=data.get("dob", None),
				email=data.get("email", None),
				phone_number=data.get("phone_number", None),
			)
		else:
			return Response(status=status.HTTP_400_BAD_REQUEST)
	except Exception as e:
		logger.exception(e)
		return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data="Something went wrong: %s" %e)
	else:
		logger.debug(cv)

	return Response(status=status.HTTP_200_OK)




class DataValidator():
	""" validates data and specific keys in a CV JSON dict  """
	def __init__(self, data):
		self.data = data
		self.__mandatory_basic_data = [
			{"key": "name", "type": "string"}, 
			{"key": "email", "type": "email"}
		]
		logger.debug("Initialised data validator for data: %s" %data)

	def validate_basic_data(self):
		""" returns bool based on valid data for basic cv """
		flag = True
		#print("in validate_basic_data", self.__mandatory_basic_data)
		for d in self.__mandatory_basic_data:
			#print("calling validate functions: ", self.data[d["key"]], d["type"])
			flag = flag and self.__validate_data(self.data[d["key"]], d["type"])
		return flag

	def __validate_data(self, data, data_type):
		#print(data, data_type, type(data))

		if not data_type:
			return False
		elif data_type == "string":
			return self.__validate_string(data)
		elif data_type == "email":
			return self.__validate_email(data)

	def __validate_string(self, data):
		return (data and type(data)==type(u""))

	def __validate_email(self, data):
		if re.match(r"[^@]+@[^@]+\.[^@]+", data):
			return True
		else: return False






