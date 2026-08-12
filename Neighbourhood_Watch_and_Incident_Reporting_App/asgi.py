"""
ASGI config for Neighbourhood_Watch_and_Incident_Reporting_App project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.1/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Neighbourhood_Watch_and_Incident_Reporting_App.settings')

application = get_asgi_application()
