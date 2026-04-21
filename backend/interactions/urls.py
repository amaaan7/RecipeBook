from django.urls import path
from . import views

urlpatterns = [
    path('recipes/<int:recipe_id>/like/', views.toggle_like, name='toggle-like'),
    path('recipes/<int:recipe_id>/save/', views.toggle_save, name='toggle-save'),
    path('recipes/<int:recipe_id>/comments/', views.comments, name='comments'),
    path('comments/<int:comment_id>/', views.delete_comment, name='delete-comment'),
    path('saved/', views.saved_recipes, name='saved-recipes'),
]
