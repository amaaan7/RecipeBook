from django import forms
from .models import Recipe, Profile, Comment

class RecipeForm(forms.ModelForm):
    class Meta:
        model = Recipe
        fields = [
            "title",
            "slug",
            "description",
            "ingredients",
            "steps",
            "notes",
            "image",
            "tags",
            "published",
        ]
        widgets = {
            "title": forms.TextInput(attrs={"class": "form-control"}),
            "slug": forms.TextInput(attrs={"class": "form-control"}),
            "description": forms.Textarea(attrs={"class": "form-control", "rows": 3}),
            "ingredients": forms.Textarea(attrs={"class": "form-control", "rows": 6}),
            "steps": forms.Textarea(attrs={"class": "form-control", "rows": 6}),
            "notes": forms.Textarea(attrs={"class": "form-control", "rows": 3}),
            "image": forms.ClearableFileInput(attrs={"class": "form-control"}),
            "tags": forms.SelectMultiple(attrs={"class": "form-select"}),
            "published": forms.CheckboxInput(attrs={"class": "form-check-input"}),
        }


class ProfileForm(forms.ModelForm):
    class Meta:
        model = Profile
        fields = ["avatar", "bio"]
        widgets = {
            "avatar": forms.ClearableFileInput(attrs={"class": "form-control"}),
            "bio": forms.Textarea(attrs={"class": "form-control", "rows": 4}),
        }


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ["body"]
        widgets = {
            "body": forms.Textarea(attrs={"class": "form-control", "rows": 3, "placeholder": "Write a comment..."}),
        }
