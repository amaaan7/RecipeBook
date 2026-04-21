from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from recipes.models import Recipe
from .models import Like, SavedRecipe, Comment
from .serializers import CommentSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_like(request, recipe_id):
    """POST /api/interactions/recipes/:id/like/ — toggles like on/off."""
    recipe = Recipe.objects.get(id=recipe_id)
    like, created = Like.objects.get_or_create(user=request.user, recipe=recipe)
    if not created:
        like.delete()
        return Response({'liked': False, 'count': recipe.likes.count()})
    return Response({'liked': True, 'count': recipe.likes.count()})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_save(request, recipe_id):
    """POST /api/interactions/recipes/:id/save/ — toggles save on/off."""
    recipe = Recipe.objects.get(id=recipe_id)
    save, created = SavedRecipe.objects.get_or_create(user=request.user, recipe=recipe)
    if not created:
        save.delete()
        return Response({'saved': False})
    return Response({'saved': True})

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def comments(request, recipe_id):
    recipe = Recipe.objects.get(id=recipe_id)
    if request.method == 'GET':
        all_comments = recipe.comments.select_related('user')
        return Response(CommentSerializer(all_comments, many=True).data)
    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user, recipe=recipe)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_comment(request, comment_id):
    comment = Comment.objects.get(id=comment_id)
    if comment.user != request.user:
        return Response(status=status.HTTP_403_FORBIDDEN)
    comment.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def saved_recipes(request):
    """GET /api/interactions/saved/ — all recipes this user saved."""
    saves = SavedRecipe.objects.filter(user=request.user).select_related('recipe')
    recipes = [s.recipe for s in saves]
    from recipes.serializers import RecipeListSerializer
    return Response(RecipeListSerializer(recipes, many=True, context={'request': request}).data)