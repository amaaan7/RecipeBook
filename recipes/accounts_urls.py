from django.urls import path
from . import accounts_views

urlpatterns = [
    path("register/", accounts_views.register, name="register"),
]
