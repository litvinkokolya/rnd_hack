from rest_framework.permissions import BasePermission


class AuthenticatedOrTelegramBot(BasePermission):
    def has_permission(self, request, view):
        if request.user and request.user.is_authenticated:
            return True
        if request.data.get("user", "client") == "telegram":
            return True
        return False
