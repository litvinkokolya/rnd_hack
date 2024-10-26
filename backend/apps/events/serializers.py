from rest_framework import serializers

from apps.events.models import Achievement, Event, Member, Work, ImagesWork, Result


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = '__all__'


class EventCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'


class EventSerializer(serializers.ModelSerializer):
    achievement_winner = AchievementSerializer()
    achievement_member = AchievementSerializer()
    is_participation = serializers.SerializerMethodField()

    def get_is_participation(self, obj) -> bool:
        user = self.context.get("request").user
        event = obj
        if Member.objects.filter(
            event__pk=event.pk, user=user
        ).exists():
            return True
        else:
            return False

    class Meta:
        model = Event
        fields = '__all__'


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = '__all__'


class WorkSerializer(serializers.ModelSerializer):
    class Meta:
        model = Work
        fields = '__all__'


class ImagesWorkSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagesWork
        fields = '__all__'


class ResultSerializer(serializers.ModelSerializer):

    class Meta:
        model = Result
        fields = '__all__'
