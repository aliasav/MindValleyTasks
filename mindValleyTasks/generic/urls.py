"""Deals urls."""
from rest_framework.urlpatterns import format_suffix_patterns
from django.conf.urls import url
from generic import views as generic_views

urlpatterns = [            
	url(r'^$', generic_views.render_landing_page),
    url(r'^home', generic_views.render_landing_page),
    url(r'^home/$', generic_views.render_landing_page),
]

urlpatterns = format_suffix_patterns(urlpatterns)
