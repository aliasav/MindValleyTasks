# -*- coding: utf-8 -*-
# Generated by Django 1.9 on 2016-11-07 08:25
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('urlShortner', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='url',
            name='shortened_url',
            field=models.CharField(blank=True, max_length=50, null=True, unique=True),
        ),
    ]
