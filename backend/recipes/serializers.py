from rest_framework import serializers
from .models import Recipe, Category, Ingredient, Step
from accounts.serializers import UserSerializer

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Category
        fields = ['id', 'name', 'slug', 'color']

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Ingredient
        fields = ['id', 'amount', 'name', 'order']

class StepSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Step
        fields = ['id', 'step_number', 'instruction']

class RecipeListSerializer(serializers.ModelSerializer):
    """Lightweight — used in the feed. Doesn't include full ingredients/steps."""
    author     = UserSerializer(read_only=True)
    category   = CategorySerializer(read_only=True)
    like_count = serializers.IntegerField(read_only=True)
    is_liked   = serializers.SerializerMethodField()
    is_saved   = serializers.SerializerMethodField()

    class Meta:
        model  = Recipe
        fields = [
            'id', 'title', 'description', 'image', 'author', 'category',
            'difficulty', 'prep_time', 'cook_time', 'total_time',
            'servings', 'like_count', 'is_liked', 'is_saved', 'created_at'
        ]

    def get_is_liked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.likes.filter(user=request.user).exists()
        return False

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.saves.filter(user=request.user).exists()
        return False

class RecipeDetailSerializer(RecipeListSerializer):
    """Full data — used on the detail page. Includes ingredients and steps."""
    ingredients = IngredientSerializer(many=True, read_only=True)
    steps       = StepSerializer(many=True, read_only=True)

    class Meta(RecipeListSerializer.Meta):
        fields = RecipeListSerializer.Meta.fields + ['ingredients', 'steps', 'updated_at']

class RecipeWriteSerializer(serializers.ModelSerializer):
    """Used for creating and editing. Handles nested ingredients and steps."""
    ingredients = IngredientSerializer(many=True)
    steps       = StepSerializer(many=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )

    class Meta:
        model  = Recipe
        fields = [
            'title', 'description', 'image', 'category_id',
            'difficulty', 'prep_time', 'cook_time', 'servings',
            'ingredients', 'steps'
        ]

    def create(self, validated_data):
        ingredients_data = validated_data.pop('ingredients')
        steps_data       = validated_data.pop('steps')
        # author is set from request.user in the view, not from the request body
        recipe = Recipe.objects.create(**validated_data)
        for i, ing in enumerate(ingredients_data):
            Ingredient.objects.create(recipe=recipe, order=i, **ing)
        for step in steps_data:
            Step.objects.create(recipe=recipe, **step)
        return recipe

    def update(self, instance, validated_data):
        ingredients_data = validated_data.pop('ingredients', None)
        steps_data       = validated_data.pop('steps', None)
        for attr, val in validated_data.items():
            setattr(instance, attr, val)
        instance.save()
        if ingredients_data is not None:
            instance.ingredients.all().delete()
            for i, ing in enumerate(ingredients_data):
                Ingredient.objects.create(recipe=instance, order=i, **ing)
        if steps_data is not None:
            instance.steps.all().delete()
            for step in steps_data:
                Step.objects.create(recipe=instance, **step)
        return instance