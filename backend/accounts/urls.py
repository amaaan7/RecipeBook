from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    path('register/', views.register_view),
    path('login/',    views.login_view),
    path('refresh/',  TokenRefreshView.as_view()),  # built-in token refresh
    path('profile/',  views.profile_view),
]