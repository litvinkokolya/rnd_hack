from django.contrib import admin
from .models import Achievement, Event, Member, Work, ImagesWork, Result


@admin.register(Achievement)
class AchievementAdmin(admin.ModelAdmin):
    list_display = ('name', 'image')
    search_fields = ('name',)


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'max_members', 'for_whom', 'count_photo', 'prize', 'is_video', 'created_date', 'end_date', 'is_finished')
    list_filter = ('for_whom', 'is_video', 'is_finished')
    actions = ["make_finished"]
    search_fields = ('name', 'description', 'prize')

    @admin.action(description="Завершить челлендж")
    def make_finished(self, request, queryset):
        queryset.update(is_finished=True)
        for event in queryset:
            event.save()


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ('user', 'event', 'winner', 'joined_at')
    list_filter = ('winner',)
    search_fields = ('user__username', 'event__name')


@admin.register(Work)
class WorkAdmin(admin.ModelAdmin):
    list_display = ('event', 'member')
    search_fields = ('event__name', 'member__user__username')


@admin.register(ImagesWork)
class ImagesWorkAdmin(admin.ModelAdmin):
    list_display = ('image', 'work')
    search_fields = ('work__event__name',)


@admin.register(Result)
class ResultAdmin(admin.ModelAdmin):
    list_display = ('work', 'reviewer', 'score')
    search_fields = ('work__event__name', 'reviewer__user__username')
