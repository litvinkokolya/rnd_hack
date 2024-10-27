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
    created_mine = serializers.SerializerMethodField()

    def get_created_mine(self, obj) -> bool:
        user = self.context.get("request").user
        if Event.objects.filter(created_by=user).exists():
            return True
        return False

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
    event = EventSerializer()
    member = MemberSerializer()
    preview = serializers.SerializerMethodField()
    result_sum = serializers.IntegerField(source="result_all", read_only=True)
    is_filled_mine = serializers.SerializerMethodField()
    is_my_mark = serializers.SerializerMethodField()

    def get_is_filled_mine(self, obj) -> bool:
        user = self.context.get("request").user
        work = obj
        if Work.objects.filter(
            pk=work.pk, member__user=user, images_work__isnull=False
        ).exists():
            return True
        else:
            return False

    def get_is_my_mark(self, obj) -> bool:
        user = self.context.get("request").user
        work = obj
        if Result.objects.filter(
            work__pk=work.pk, reviewer__user=user
        ).exists():
            return True
        else:
            return False

    class Meta:
        model = Work
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)

        unique_results = instance.result.order_by("reviewer").distinct("reviewer")

        representation["result_sum"] = sum(result.balls for result in unique_results)

        return representation

    def get_preview(self, obj) -> str:
        preview = obj.images_work.first()
        if preview and preview.image:
            return preview.image.url
        else:
            return None


class WorkCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Work
        fields = '__all__'


class ImagesWorkSerializer(serializers.ModelSerializer):
    work = WorkSerializer()
    class Meta:
        model = ImagesWork
        fields = '__all__'


class ImagesWorkCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ImagesWork
        fields = '__all__'


class ResultCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Result
        fields = '__all__'


class ResultSerializer(serializers.ModelSerializer):
    work = WorkSerializer()
    reviewer = MemberSerializer()

    full_name_reviewer = serializers.SerializerMethodField()

    def get_full_name_reviewer(self, obj) -> str:
        return obj.reviewer.user.get_full_name()

    class Meta:
        model = Result
        fields = '__all__'
