from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.filters import OrderingFilter, SearchFilter

from .models import Achievement, Event, Member, Work, ImagesWork, Result
from .serializers import AchievementSerializer, EventSerializer, MemberSerializer, WorkSerializer, ImagesWorkSerializer, ResultSerializer


class AchievementViewSet(viewsets.ModelViewSet):
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer
    filter_backends = (OrderingFilter, DjangoFilterBackend, SearchFilter)


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    filter_backends = (OrderingFilter, DjangoFilterBackend, SearchFilter)

#   @action(methods=['get'], detail=True, url_path='print', url_name='print')
#       def print_form(self, request, *args, **kwargs):
#       TODO: когда будет известен result поле у Result сделать отправку excel


class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    filter_backends = (OrderingFilter, DjangoFilterBackend, SearchFilter)


class WorkViewSet(viewsets.ModelViewSet):
    queryset = Work.objects.all()
    serializer_class = WorkSerializer
    filter_backends = (OrderingFilter, DjangoFilterBackend, SearchFilter)


class ImagesWorkViewSet(viewsets.ModelViewSet):
    queryset = ImagesWork.objects.all()
    serializer_class = ImagesWorkSerializer
    filter_backends = (OrderingFilter, DjangoFilterBackend, SearchFilter)


class ResultViewSet(viewsets.ModelViewSet):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer
    filter_backends = (OrderingFilter, DjangoFilterBackend, SearchFilter)