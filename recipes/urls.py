from django.urls import path
from . import views

app_name = "recipes"

urlpatterns = [
    path("", views.recipe_list, name="list"),
    path("accounts/profile/", views.profile, name="profile"),
    path("recipe/add/", views.recipe_create, name="create"),
    path("recipe/<slug:slug>/edit/", views.recipe_edit, name="edit"),
    path("recipe/<slug:slug>/delete/", views.recipe_delete, name="delete"),
    path("recipe/<slug:slug>/", views.recipe_detail, name="detail"),
    path("", views.recipe_list, name="list"),
    path("accounts/profile/", views.profile, name="profile"),   # your existing personal profile
    path("profile/edit/", views.profile_edit, name="profile_edit"),
    path("users/<str:username>/", views.profile_view, name="profile_view"),
    # ... rest of urlpatterns ...
]
