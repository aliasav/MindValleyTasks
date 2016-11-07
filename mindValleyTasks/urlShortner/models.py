from __future__ import unicode_literals

from django.db import models
from django.utils.baseconv import base64

class URL(models.Model):
    original_url = models.CharField(max_length=500, unique=True)
    shortened_url = models.CharField(max_length=50, unique=True, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def url_shortner(self):
    	""" public function that shortens the url """
        
        self.shortened_url = self.__hash(self.original_url)
        
        if(len(self.shortened_url) >= len(self.original_url)):
            self.shortened_url =  self.original_url
        
        return self.shortened_url        
        
        
    @staticmethod
    def __hash(key):
    	""" fnv hashing: using 32 bit hash parameters 
        and returns a 8 bit string """

        h = 2166136261 # 32 bit FNV offset basis hash
        fnv_prime = 16777619 # 32 bit FNV prime    

        for k in key:
            # multiply hash with FNV prime and 
            # XOR with the ordinal of byte
            h = (h*fnv_prime)^ord(k)
        
        # Return 8 bit URL
        return base64.encode(h%281474976710656)
    
    def __str__(self):
        return models.Model.__str__(self) 
