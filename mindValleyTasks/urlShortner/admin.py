from django.contrib import admin
from urlShortner.models import URL

class URLAdmin(admin.ModelAdmin):
    
    list_display = ('original_url', 'shortened_url', 'created_at', 'updated_at')

admin.site.register(URL, URLAdmin)