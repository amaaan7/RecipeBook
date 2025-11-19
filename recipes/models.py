from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify
from django.conf import settings
from django.db import models
from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver

User = get_user_model()

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    slug = models.SlugField(max_length=60, unique=True)

    def __str__(self):
        return self.name


class Recipe(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="recipes")
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)
    description = models.TextField(blank=True)
    ingredients = models.TextField(help_text="One ingredient per line")
    steps = models.TextField(help_text="One step per line")
    notes = models.TextField(blank=True)
    image = models.ImageField(upload_to="recipes/", null=True, blank=True)
    tags = models.ManyToManyField(Tag, blank=True, related_name="recipes")
    published = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        # ensure slug exists and is unique-ish
        if not self.slug:
            base = slugify(self.title) or "recipe"
            slug = base
            i = 1
            # avoid infinite loop; simple incrementer for duplicates
            while Recipe.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base}-{i}"
                i += 1
            self.slug = slug
        super().save(*args, **kwargs)

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)
    bio = models.TextField(blank=True)

    def __str__(self):
        return f"Profile({self.user.username})"

class Comment(models.Model):
    recipe = models.ForeignKey("Recipe", on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return f"Comment by {self.author.username} on {self.recipe.title}"



#----------------signals--------------------------
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        from .models import Profile
        Profile.objects.create(user=instance)