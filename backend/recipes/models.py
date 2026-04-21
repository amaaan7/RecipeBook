from math import degrees
from unittest.util import _MAX_LENGTH
from django.core.management import color
from enum import unique
from django.db import models
from django.conf import settings

class Category(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(unique=True)
    color = models.CharField(max_length=7, default='#22c55e')

    def __str__(self):
        return self.name

class Recipe(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]

    author       = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title        = models.CharField(max_length=200)
    description  = models.TextField()
    image        = models.ImageField(upload_to='recipes/')   # goes to Cloudinary
    category     = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)
    difficulty   = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='medium')
    prep_time    = models.PositiveIntegerField(help_text='Minutes')  # e.g. 15
    cook_time    = models.PositiveIntegerField(help_text='Minutes')  # e.g. 30
    servings     = models.PositiveIntegerField(default=4)
    is_published = models.BooleanField(default=True)
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    @property
    def like_count(self):
        return self.likes.count()

class Ingredient(models.Model):
    recipe   = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='ingredients')
    amount   = models.CharField(max_length=50)    # "2 cups", "1 tbsp", "a pinch of"
    name     = models.CharField(max_length=200)   # "flour", "olive oil"
    order    = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.amount} {self.name}"

class Step(models.Model):
    recipe      = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='steps')
    step_number = models.PositiveIntegerField()
    instruction = models.TextField()

    class Meta:
        ordering = ['step_number']