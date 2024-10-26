from django.contrib.postgres.fields import ArrayField
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class Achievement(models.Model):
    image = models.ImageField(upload_to="achievement_images", null=True, blank=True)
    name = models.CharField(max_length=50, null=True, blank=True)


class Event(models.Model):
    FOR_WHOM_CHOICES = [
        (1, 'Для себя'),
        (2, 'Для всех')
    ]

    name = models.CharField(max_length=100, null=True, blank=True)
    image = models.ImageField(upload_to="event_images", null=True, blank=True)
    description = models.CharField(max_length=500, null=True, blank=True)
    tags = ArrayField(models.CharField(max_length=50), blank=True)
    max_members = models.PositiveIntegerField(null=True, blank=True)
    for_whom = models.IntegerField(choices=FOR_WHOM_CHOICES, null=True, blank=True)
    count_photo = models.IntegerField(null=True, blank=True)
    is_video = models.BooleanField(null=True, blank=True)
    criteries = ArrayField(models.CharField(max_length=50), blank=True)
    created_date = models.DateField(auto_now_add=True)
    end_date = models.DateField(null=True, blank=True)
    achievement_winner = models.ForeignKey('Achievement', on_delete=models.SET_NULL, blank=True, null=True,
                                           related_name='event_achiev_winner')
    achievement_member = models.ForeignKey('Achievement', on_delete=models.SET_NULL, blank=True, null=True,
                                           related_name='event_achiev_member')
    is_finished = models.BooleanField(default=False)

    def find_winner(self):
        results = Result.objects.filter(work__event=self)
        #TODO: дописать когда будет известно что будет приходить в result.result

    def give_achievements(self):
        members = self.member.all()
        for member in members:
            if member.winner:
                member.user.achievements.add(self.achievement_winner)
            else:
                member.user.achievements.add(self.achievement_member)


class Member(models.Model):
    user = models.ForeignKey('users.User', on_delete=models.PROTECT, null=True, blank=True, related_name='member')
    event = models.ForeignKey('Event', on_delete=models.PROTECT, null=True, blank=True, related_name='member')
    winner = models.BooleanField(default=False)
    joined_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user} - {self.joined_at}'


class Work(models.Model):
    event = models.ForeignKey("Event", on_delete=models.SET_NULL, null=True, blank=True, related_name='work')
    member = models.ForeignKey("Member", on_delete=models.SET_NULL, null=True, blank=True, related_name='work')


class ImagesWork(models.Model):
    image = models.ImageField(upload_to="work_images", null=True, blank=True)
    work = models.ForeignKey("Work", on_delete=models.PROTECT, null=True, blank=True, related_name='images_work')

    def save(self, *args, **kwargs):
        if self.pk is None:
            # Количество фотографий в Work в момент сохранения новой фотографии
            photos_count_work = self.work.image.count()

            # Количество фотографий в Event, относящейся к запрошенной MemberNomination
            photos_count_event = self.work.event.count_photo

            if photos_count_work >= photos_count_event:
                return ValueError(
                    f"Максимум {photos_count_event} фотографии для данной работы."
                )

        super().save(*args, **kwargs)


class Result(models.Model):
    work = models.ForeignKey('Work', on_delete=models.PROTECT, blank=True, null=True, related_name='result')
    reviewer = models.ForeignKey('Member', on_delete=models.PROTECT, blank=True, null=True, related_name='result')
    score = ArrayField(models.CharField(max_length=5000), blank=True, null=True)


@receiver(post_save, sender=Event)
def determine_achievements(sender, instance, created, **kwargs):
    if instance.is_finished:
        instance.find_winner()
        instance.give_achievements()
