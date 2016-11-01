from django.shortcuts import render

from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status

from request_utils import parse_request, get_request_content

from cv_parser.models import CV, Link, Qualification, WorkExperience, Project, Interest, CVJson

import logging
import re
import datetime

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
				dob=dv.get_date("dob"),
				email=data.get("email", None),
				phone_number=data.get("phone_number", None),
			)
		else:
			return Response(status=status.HTTP_400_BAD_REQUEST)
	except Exception as e:
		logger.exception(e)
		return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data="Something went wrong: %s" %e)
	
	# create links
	stackOverFlowLink = data.get("stackOverFlowLink", None)
	linkedinLink = data.get("linkedinLink", None)
	githubLink = data.get("githubLink", None)

	if stackOverFlowLink:
		Link.objects.create(
			name="stackoverflow",
			url=stackOverFlowLink,
			cv=cv)
	
	if linkedinLink:
		Link.objects.create(
			name="LinkedIn",
			url=linkedinLink,
			cv=cv)
	
	if githubLink:
		Link.objects.create(
			name="Github",
			url=githubLink,
			cv=cv)

	# add qualifications
	if dv.validate_qualifications():
		qualifications = data.get("qualifications")
		for q in qualifications:
			q_obj = Qualification.objects.create(
					title=q.get("title"),
					text=q.get("text"),
					summary=q.get("summary"),
					cv=cv,
				)
			logger.debug("Created qualification obj: %s" %q)

	# add work experiences
	if dv.validate_work_experiences():
		work_experiences = data.get("work_experiences")
		for w in work_experiences:
			w_obj = WorkExperience.objects.create(
					title=w.get("title"),
					company=w.get("company"),
					role=w.get("role"),
					from_date=dv.get_date_from_object(w, "from_date"),
					to_date=dv.get_date_from_object(w, "to_date"),
					summary=w.get("summary"),
					cv=cv,
				)
			logger.debug("Created WE object: %s" %w_obj)

	# add projects
	if dv.validate_projects():
		projects = data.get("projects")
		for p in projects:
			p_obj = Project.objects.create(
					title=p.get("title"),
					summary=p.get("summary"),
					cv=cv
				)
			logger.debug("Created project object: %s" %p_obj)

	json_data = CVJson(cv).get_json()

	return Response(status=status.HTTP_200_OK, data=json_data)




class DataValidator():
	""" validates data and specific keys in a CV JSON dict  """
	def __init__(self, data):
		self.data = data
		self.__mandatory_basic_data = [
			{"key": "name", "type": "string"}, 
			{"key": "email", "type": "email"},
		]
		self.__mandatory_qualifications_data = [
			{"key": "title", "type": "string"},
		]
		self.__mandatory_work_experiences_data = [
			{"key": "company", "type": "string"},
			{"key": "role", "type": "string"},
		]
		self.__mandatory_projects_data = [
			{"key": "title", "type": "string"},
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
		""" returns bool """
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

	def validate_qualifications(self):
		qualifications = self.data.get("qualifications")
		#print('qualifications', qualifications)
		if not qualifications:
			return False
		flag = True		
		for q in qualifications:
			for d in self.__mandatory_qualifications_data:
				flag = flag and self.__validate_data(q.get("title", None), d["type"])				
		return flag


	def get_date(self, key):
		""" returns a dob 
			accepts dob in dd-mm-yyyy format """
		data = self.data.get(key, None)
		if not data:
			return None
		else:
			try:
				date = datetime.datetime.strptime(data, "%d-%m-%Y")
			except Exception as e:
				logger.exception(e)
				print(e)
				return None
			print(key, date)
			return date

	def get_date_from_object(self, obj, key):
		""" returns a dob 
			accepts dob in dd-mm-yyyy format """
		data = obj.get(key, None)
		if not data:
			return None
		else:
			try:
				date = datetime.datetime.strptime(data, "%d-%m-%Y")
			except Exception as e:
				logger.exception(e)
				print(e)
				return None
			print(key, date)
			return date


	def validate_work_experiences(self):
		work_experiences = self.data.get("work_experiences")
		if not work_experiences:
			return False
		flag = True
		for w in work_experiences:			
			for d in self.__mandatory_work_experiences_data:
				flag = flag and self.__validate_data(w.get("title", None), d["type"])
		return flag

	def validate_projects(self):
		projects = self.data.get("projects")
		if not projects:
			return False
		flag = True
		for p in projects:			
			for d in self.__mandatory_projects_data:
				flag = flag and self.__validate_data(p.get("title", None), d["type"])
		return flag





