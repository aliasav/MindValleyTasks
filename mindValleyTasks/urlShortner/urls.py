"""Deals urls."""
from rest_framework.urlpatterns import format_suffix_patterns
from django.conf.urls import url
from urlShortner import views as urlShortner_views

urlpatterns = [            
	url(r'^api/url_shortner/post/$', urlShortner_views.shorten),
	url(r'^redirect/(?P<short_url>.+)/$', urlShortner_views.redirect),
    
]

urlpatterns = format_suffix_patterns(urlpatterns)
