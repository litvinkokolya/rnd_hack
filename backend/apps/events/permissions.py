from rest_framework.permissions import BasePermission


class TelegramBotUpdate(BasePermission):
    def has_permission(self, request, view):
        if request.method in ["GET", "HEAD", "OPTIONS"]:
            return True
        if request.data.get("user", "client") == "telegram":
            return True
        return False
