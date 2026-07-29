from rest_framework import permissions

class IsAdminOrLibrarian(permissions.BasePermission):
    """
    Admin and Librarian can do anything (GET, POST, PUT, DELETE).
    Students can only read (GET).
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        # Safe methods = GET, HEAD, OPTIONS — reading only, never modifies data
        if request.method in permissions.SAFE_METHODS:
            return True

        # Anything else (POST, PUT, PATCH, DELETE) requires admin or librarian
        try:
            role = request.user.profile.role
        except AttributeError:
            return False

        return role in ['admin', 'librarian']


class IsAdminOnly(permissions.BasePermission):
    """
    Only Admin can modify. Everyone authenticated can read.
    Used for Settings — Librarian/Student can view config, only Admin edits it.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        if request.method in permissions.SAFE_METHODS:
            return True

        try:
            role = request.user.profile.role
        except AttributeError:
            return False

        return role == 'admin'