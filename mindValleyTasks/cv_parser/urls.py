"""Deals urls."""
from rest_framework.urlpatterns import format_suffix_patterns
from django.conf.urls import url
from cv_parser import views as cv_parser_views

urlpatterns = [            
	url(r'^api/cv_parser/post/$', cv_parser_views.post_cv),
    
]

urlpatterns = format_suffix_patterns(urlpatterns)
