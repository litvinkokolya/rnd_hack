from django.db.models import Sum
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter

from utils.doc_renderer import DocRenderer
from utils.file_response import make_file_response
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

    @action(methods=['get'], detail=True, url_path='print', url_name='print')
    def print_form(self, request, pk=None):
        event = self.get_object()

        data = {}

        winner_member = event.member.filter(winner=True).first()
        if winner_member:
            data['winner'] = winner_member.user.get_full_name()
        else:
            data['winner'] = 'Победителя пока нет'

        data['name'] = event.name
        data['description'] = event.description
        data['prize'] = event.prize
        data['records'] = []

        members = event.member.all()
        members = members.annotate(
            result_sum=Sum('work__result__balls')
        )
        sorted_members = members.order_by('-result_sum')

        for member in sorted_members:
            if member.user:
                data['records'].append({
                    'full_name': member.user.get_full_name(),
                    'score': member.result_sum
                })

        renderer = DocRenderer('winners.odt')

        return make_file_response(renderer.render(data), 'Таблица результатов.odt')


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
