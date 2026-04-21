import django_filters
from .models import Recipe

class RecipeFilter(django_filters.FilterSet):
    category = django_filters.CharFilter(field_name='category__slug')
    difficulty = django_filters.CharFilter()
    max_time = django_filters.NumberFilter(field_name='prep_time', lookup_expr='lte')
    author = django_filters.NumberFilter(field_name='author__id')

    class Meta:
        model = Recipe
        fields = ['category', 'difficulty', 'max_time', 'author']