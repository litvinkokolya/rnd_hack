from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.filters import OrderingFilter, SearchFilter

from .models import Achievement, Event, Member, Work, ImagesWork, Result
from .permissions import AuthenticatedOrTelegramBot
from .serializers import AchievementSerializer, EventSerializer, MemberSerializer, WorkSerializer, ImagesWorkSerializer, \
    ResultSerializer, EventCreateSerializer, WorkCreateSerializer, ImagesWorkCreateSerializer, ResultCreateSerializer


class AchievementViewSet(viewsets.ModelViewSet):
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
    filter_backends = (OrderingFilter, DjangoFilterBackend, SearchFilter)


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    filter_backends = (OrderingFilter, DjangoFilterBackend, SearchFilter)

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return EventCreateSerializer
        return EventSerializer


class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    filter_backends = (OrderingFilter, DjangoFilterBackend, SearchFilter)


class WorkViewSet(viewsets.ModelViewSet):
    queryset = Work.objects.all()
    filterset_fields = ["event"]
    filter_backends = (OrderingFilter, DjangoFilterBackend, SearchFilter)
    permission_classes = [AuthenticatedOrTelegramBot]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return WorkCreateSerializer
        return WorkSerializer


class ImagesWorkViewSet(viewsets.ModelViewSet):
    queryset = ImagesWork.objects.all()
    filterset_fields = ["work"]
    filter_backends = (OrderingFilter, DjangoFilterBackend, SearchFilter)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ImagesWorkCreateSerializer
        return ImagesWorkSerializer


class ResultViewSet(viewsets.ModelViewSet):
    queryset = Result.objects.all()
    filterset_fields = ["work"]
    filter_backends = (OrderingFilter, DjangoFilterBackend, SearchFilter)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ResultCreateSerializer
        return ResultSerializer
