from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAuthorOrReadOnly(BasePermission):
    """
    Anyone can read (GET). Only the author can edit or delete (PUT, PATCH, DELETE).
    This is the most important security rule for user-generated content.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:   # GET, HEAD, OPTIONS
            return True
        return obj.author == request.user    # only author can modify