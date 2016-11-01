from __future__ import unicode_literals

from django.db import models

# Create your models here.
class CV(models.Model):

    name = models.CharField(max_length=200, null=True, blank=True)
    dob = models.DateTimeField(null=True, blank=True)
    email = models.EmailField(max_length=200, null=True, blank=True)
    phone_number = models.CharField(max_length=25, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Link(models.Model):

    name = models.CharField(max_length=200, null=True, blank=False)
    url = models.CharField(max_length=200, null=True, blank=False)
    cv = models.ForeignKey(CV)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name + "<---->" + self.url


class Qualification(models.Model):

    title = models.CharField(max_length=100, null=True, blank=False)
    text = models.CharField(max_length=300, null=True, blank=False)
    summary = models.TextField()
    cv = models.ForeignKey(CV)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class WorkExperience(models.Model):

    title = models.CharField(max_length=100, null=True, blank=False)
    company = models.CharField(max_length=100, null=True, blank=False)
    role = models.CharField(max_length=100, null=True, blank=False)
    from_date = models.DateTimeField(null=True, blank=True)
    to_date = models.DateTimeField(null=True, blank=True)
    summary = models.TextField()
    cv = models.ForeignKey(CV)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Project(models.Model):

    title = models.CharField(max_length=100, null=True, blank=False)
    summary = models.TextField()
    cv = models.ForeignKey(CV)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Interest(models.Model):

    name = models.CharField(max_length=100, null=True, blank=False)
    summary = models.TextField()
    cv = models.ForeignKey(CV)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


