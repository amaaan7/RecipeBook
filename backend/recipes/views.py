from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from .models import Recipe, Category
from .serializers import (
    RecipeListSerializer, RecipeDetailSerializer,
    RecipeWriteSerializer, CategorySerializer
)
from .filters import RecipeFilter
from .permissions import IsAuthorOrReadOnly

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """Categories are read-only — admins create them in the Django admin panel."""
    queryset         = Category.objects.all()
    serializer_class = CategorySerializer

class RecipeViewSet(viewsets.ModelViewSet):
    queryset = Recipe.objects.filter(is_published=True).select_related(
        'author', 'category'
    ).prefetch_related('ingredients', 'steps', 'likes')
    permission_classes  = [IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]
    filter_backends     = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class     = RecipeFilter
    search_fields       = ['title', 'description', 'ingredients__name']
    ordering_fields     = ['created_at', 'like_count', 'total_time']
    ordering            = ['-created_at']

    def get_serializer_class(self):
        """Use different serializers for different actions."""
        if self.action == 'list':
            return RecipeListSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return RecipeWriteSerializer
        return RecipeDetailSerializer  # retrieve

    def perform_create(self, serializer):
        """Automatically set author = the logged-in user."""
        serializer.save(author=self.request.user)

    @action(detail=False, methods=['get'], url_path='my-recipes')
    def my_recipes(self, request):
        """GET /api/recipes/my-recipes/ — returns only the logged-in user's recipes."""
        qs = self.get_queryset().filter(author=request.user)
        serializer = RecipeListSerializer(qs, many=True, context={'request': request})
        return Response(serializer.data)