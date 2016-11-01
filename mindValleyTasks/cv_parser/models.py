from __future__ import unicode_literals

from django.db import models
import uuid

# Create your models here.
class CV(models.Model):

    guid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, db_index=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    dob = models.DateTimeField(null=True, blank=True)
    email = models.EmailField(max_length=200, null=True, blank=True)
    phone_number = models.CharField(max_length=25, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def get_json(self):
        data = {
            "guid": self.guid,
            "name": self.name,
            "dob": self.dob,
            "email": self.email,
            "phone_number": self.phone_number,            
        }

        return data


class Link(models.Model):

    guid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, db_index=True)
    name = models.CharField(max_length=200, null=True, blank=False)
    url = models.CharField(max_length=200, null=True, blank=False)
    cv = models.ForeignKey(CV)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name + "<---->" + self.url

    def get_json(self):
        data = {
            "guid": self.guid,
            "name": self.name,
            "url": self.url,            
        }
        return data


class Qualification(models.Model):

    guid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, db_index=True)
    title = models.CharField(max_length=100, null=True, blank=False)
    text = models.CharField(max_length=300, null=True, blank=False)
    summary = models.TextField(null=True, blank=True)
    cv = models.ForeignKey(CV)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_json(self):
        data = {
            "guid": self.guid,
            "title": self.title,
            "text": self.text,
            "summary": self.summary,            
        }
        return data

class WorkExperience(models.Model):

    guid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, db_index=True)
    title = models.CharField(max_length=100, null=True, blank=False)
    company = models.CharField(max_length=100, null=True, blank=False)
    role = models.CharField(max_length=100, null=True, blank=False)
    from_date = models.DateTimeField(null=True, blank=True)
    to_date = models.DateTimeField(null=True, blank=True)
    summary = models.TextField(null=True, blank=True)
    cv = models.ForeignKey(CV)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_json(self):
        data = {
            "guid": self.guid,
            "title": self.title,
            "company": self.company,
            "role": self.role,
            "from_date": self.from_date,
            "to_date": self.to_date,
            "summary": self.summary
        }
        return data

class Project(models.Model):

    guid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, db_index=True)
    title = models.CharField(max_length=100, null=True, blank=False)
    summary = models.TextField(null=True, blank=True)
    cv = models.ForeignKey(CV)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_json(self):
        data = {
            "guid": self.guid,
            "title": self.title,
            "summary": self.summary,
        }
        return data


class Interest(models.Model):

    guid = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, db_index=True)
    name = models.CharField(max_length=100, null=True, blank=False)
    summary = models.TextField()
    cv = models.ForeignKey(CV)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class CVJson():
    """ returns JSON object of a CV and all relating models """

    def __init__(self, cv):
        self.cv = cv

    def __fetch_links(self):
        links = Link.objects.filter(cv=self.cv)
        return links
    
    def __fetch_qualifications(self):
        qualifications = Qualification.objects.filter(cv=self.cv)
        return qualifications

    def __fetch_projects(self):
        projects = Project.objects.filter(cv=self.cv)
        return projects

    def __fetch_wes(self):
        wes = WorkExperience.objects.filter(cv=self.cv)
        return wes

    def get_json(self):
        data = self.cv.get_json()

        links = self.__fetch_links()
        qualifications = self.__fetch_qualifications()
        wes = self.__fetch_wes()
        projects = self.__fetch_projects()

        links_json = map(lambda x: x.get_json(), links)
        qualifications_json = map(lambda x: x.get_json(), qualifications)
        wes_json = map(lambda x: x.get_json(), wes)
        projects_json = map(lambda x: x.get_json(), projects)

        data.update({"links": links_json})
        data.update({"qualifications": qualifications_json})
        data.update({"work_experiences": wes_json})
        data.update({"projects": projects_json})

        return data

