import os
import sys

# Add the backend root to Python's path so Django can find all apps
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'recipebook_project.settings')

from django.core.wsgi import get_wsgi_application
app = get_wsgi_application()