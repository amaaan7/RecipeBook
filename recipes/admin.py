from django.contrib import admin
from .models import Recipe, Tag
from .models import Profile
from .models import Comment

@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ("title", "author", "published", "created_at")
    list_filter = ("published", "tags")
    search_fields = ("title", "description", "ingredients")
    prepopulated_fields = {"slug": ("title",)}

@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("user",)

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("recipe", "author", "created_at")
    search_fields = ("body", "author__username", "recipe__title")