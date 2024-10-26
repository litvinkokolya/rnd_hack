from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import EventViewSet, AchievementViewSet, MemberViewSet, WorkViewSet, ImagesWorkViewSet, ResultViewSet

router = DefaultRouter()
router.register(prefix="events", viewset=EventViewSet)
router.register(prefix="achievements", viewset=AchievementViewSet)
router.register(prefix="members", viewset=MemberViewSet)
router.register(prefix="works", viewset=WorkViewSet)
router.register(prefix="image_works", viewset=ImagesWorkViewSet)
router.register(prefix="results", viewset=ResultViewSet)
urlpatterns = [path("", include(router.urls))]
