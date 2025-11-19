from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from .models import Recipe
from .forms import RecipeForm
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from .forms import ProfileForm
from django.contrib.auth.decorators import login_required
from .forms import RecipeForm, ProfileForm, CommentForm


def recipe_list(request):
    qs = Recipe.objects.filter(published=True).order_by("-created_at")
    q = request.GET.get("q", "").strip()
    if q:
        qs = qs.filter(title__icontains=q)

    # pagination
    page = request.GET.get("page", 1)
    per_page = 6   # change this number if you want more/less cards per page
    paginator = Paginator(qs, per_page)

    try:
        recipes = paginator.page(page)
    except PageNotAnInteger:
        recipes = paginator.page(1)
    except EmptyPage:
        recipes = paginator.page(paginator.num_pages)

    context = {
        "recipes": recipes,
        "paginator": paginator,
        "q": q,
    }
    return render(request, "recipes/list.html", context)

def recipe_detail(request, slug):
    recipe = get_object_or_404(Recipe, slug=slug, published=True)
    comment_form = CommentForm()  # <-- Pylance error FIXED by proper import
    return render(request, "recipes/detail.html", {
        "recipe": recipe,
        "form": comment_form,
    })



@login_required
def profile(request):
    user = request.user
    qs = user.recipes.all().order_by("-created_at")

    page = request.GET.get("page", 1)
    per_page = 6
    paginator = Paginator(qs, per_page)
    try:
        recipes = paginator.page(page)
    except PageNotAnInteger:
        recipes = paginator.page(1)
    except EmptyPage:
        recipes = paginator.page(paginator.num_pages)

    return render(
        request,
        "recipes/profile.html",
        {"profile_user": user, "recipes": recipes, "paginator": paginator}
    )
@login_required
def recipe_create(request):
    if request.method == "POST":
        form = RecipeForm(request.POST, request.FILES)
        if form.is_valid():
            recipe = form.save(commit=False)
            recipe.author = request.user
            recipe.save()
            form.save_m2m()
            return redirect("recipes:detail", slug=recipe.slug)
    else:
        form = RecipeForm()
    return render(request, "recipes/form.html", {"form": form, "create": True})

@login_required
def recipe_edit(request, slug):
    recipe = get_object_or_404(Recipe, slug=slug)

    # Ensure only author can edit
    if recipe.author != request.user:
        return redirect("recipes:detail", slug=slug)

    if request.method == "POST":
        form = RecipeForm(request.POST, request.FILES, instance=recipe)
        if form.is_valid():
            recipe = form.save()
            return redirect("recipes:detail", slug=recipe.slug)
    else:
        form = RecipeForm(instance=recipe)

    return render(request, "recipes/form.html", {"form": form, "create": False})


@login_required
def recipe_delete(request, slug):
    recipe = get_object_or_404(Recipe, slug=slug)

    if recipe.author != request.user:
        return redirect("recipes:detail", slug=slug)

    if request.method == "POST":
        recipe.delete()
        return redirect("recipes:list")

    return render(request, "recipes/confirm_delete.html", {"recipe": recipe})


@login_required
def profile_view(request, username=None):
    """
    If username is provided, show that user's public profile.
    If not, show request.user's profile (and edit link if owner).
    """
    from django.contrib.auth import get_user_model
    User = get_user_model()

    if username:
        user = get_object_or_404(User, username=username)
    else:
        user = request.user

    profile = getattr(user, "profile", None)
    recipes = user.recipes.filter(published=True).order_by("-created_at")
    return render(request, "recipes/profile_detail.html", {"profile_user": user, "profile": profile, "recipes": recipes})


@login_required
def profile_edit(request):
    profile = request.user.profile
    if request.method == "POST":
        form = ProfileForm(request.POST, request.FILES, instance=profile)
        if form.is_valid():
            form.save()
            return redirect("recipes:profile")  # your existing profile URL
    else:
        form = ProfileForm(instance=profile)
    return render(request, "recipes/profile_edit.html", {"form": form})