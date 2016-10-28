from django.shortcuts import render

import logging

logger = logging.getLogger(__name__)


def render_404(request, template="templates/404.html"):    
    """ renders 404 page """
    return render(request, template, status=404)


def render_landing_page(request, template="templates/dashboard/home.html"):
    """
    Renders landing page
    """
    context = {}
    return render(request, template, context)