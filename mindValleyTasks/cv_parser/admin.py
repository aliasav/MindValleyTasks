from django.contrib import admin
from cv_parser.models import CV, Link, Qualification, WorkExperience, Project, Interest

class CVAdmin(admin.ModelAdmin):
    
    list_display = ('name', 'dob', 'email', 'phone_number', 'created_at', 'updated_at')

admin.site.register(CV, CVAdmin)


class LinkAdmin(admin.ModelAdmin):
    
    list_display = ('name', 'url', 'cv', 'created_at', 'updated_at')

admin.site.register(Link, LinkAdmin)


class QualificationAdmin(admin.ModelAdmin):
    
    list_display = ('title', 'text', 'summary', 'cv', 'created_at', 'updated_at')

admin.site.register(Qualification, QualificationAdmin)

class WorkExperienceAdmin(admin.ModelAdmin):
    
    list_display = ('title', 'company', 'role', 'from_date', 'to_date', 'cv', 'summary', 'created_at', 'updated_at')

admin.site.register(WorkExperience, WorkExperienceAdmin)


class ProjectAdmin(admin.ModelAdmin):
    
    list_display = ('title', 'summary', 'cv', 'created_at', 'updated_at')

admin.site.register(Project, ProjectAdmin)


class InterestAdmin(admin.ModelAdmin):
    
    list_display = ('name', 'summary', 'cv', 'created_at', 'updated_at')

admin.site.register(Interest, InterestAdmin)

