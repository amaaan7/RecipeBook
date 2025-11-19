from django.shortcuts import render, get_object_or_404
from .models import Recipe

def recipe_list(request):
    qs = Recipe.objects.filter(published=True)
    q = request.GET.get("q")
    if q:
        qs = qs.filter(title__icontains=q)
    return render(request, "recipes/list.html", {"recipes": qs})

def recipe_detail(request, slug):
    recipe = get_object_or_404(Recipe, slug=slug, published=True)
    return render(request, "recipes/detail.html", {"recipe": recipe})
