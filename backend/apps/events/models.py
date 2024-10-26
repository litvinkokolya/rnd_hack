from django.contrib.postgres.fields import ArrayField
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver


class Achievement(models.Model):
    image = models.ImageField(
        upload_to="achievement_images",
        null=True,
        blank=True,
        verbose_name="Изображение",
        help_text="Загрузите изображение достижения"
    )
    name = models.CharField(
        max_length=50,
        null=True,
        blank=True,
        verbose_name="Название достижения",
        help_text="Введите название достижения"
    )

    class Meta:
        verbose_name = "Достижение"
        verbose_name_plural = "Достижения"


class Event(models.Model):
    FOR_WHOM_CHOICES = [
        (1, 'Для себя'),
        (2, 'Для всех')
    ]

    name = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        verbose_name="Название",
        help_text="Введите название события"
    )
    image = models.ImageField(
        upload_to="event_images",
        null=True,
        blank=True,
        verbose_name="Изображение",
        help_text="Загрузите изображение события"
    )
    description = models.CharField(
        max_length=500,
        null=True,
        blank=True,
        verbose_name="Описание",
        help_text="Введите описание события"
    )
    tags = ArrayField(
        models.CharField(max_length=50),
        blank=True,
        verbose_name="Теги",
        help_text="Введите теги события"
    )
    max_members = models.PositiveIntegerField(
        null=True,
        blank=True,
        verbose_name="Максимальное количество участников",
        help_text="Введите максимальное количество участников"
    )
    for_whom = models.IntegerField(
        choices=FOR_WHOM_CHOICES,
        null=True,
        blank=True,
        verbose_name="Для кого",
        help_text="Выберите, для кого это событие"
    )
    count_photo = models.IntegerField(
        null=True,
        blank=True,
        verbose_name="Количество фотографий",
        help_text="Введите количество фотографий"
    )
    prize = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        verbose_name="Приз",
        help_text="Введите приз"
    )
    is_video = models.BooleanField(
        null=True,
        blank=True,
        verbose_name="Видео",
        help_text="Укажите, можно ли видео"
    )
    criteries = ArrayField(
        models.CharField(max_length=50),
        blank=True,
        verbose_name="Критерии",
        help_text="Введите критерии"
    )
    created_date = models.DateField(
        auto_now_add=True,
        verbose_name="Дата создания",
        help_text="Дата создания события"
    )
    end_date = models.DateField(
        null=True,
        blank=True,
        verbose_name="Дата окончания",
        help_text="Дата окончания события"
    )
    achievement_winner = models.ForeignKey(
        'Achievement',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='event_achiev_winner',
        verbose_name="Достижение победителя",
        help_text="Выберите достижение для победителя"
    )
    achievement_member = models.ForeignKey(
        'Achievement',
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
        related_name='event_achiev_member',
        verbose_name="Достижение участника",
        help_text="Выберите достижение для участника"
    )
    is_finished = models.BooleanField(
        default=False,
        verbose_name="Завершено",
        help_text="Укажите, завершено ли событие"
    )

    class Meta:
        verbose_name = "Челлендж"
        verbose_name_plural = "Челленджи"

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

    def __str__(self) -> str:
        return self.name if self.name else 'Укажи name!!!'


class Member(models.Model):
    user = models.ForeignKey(
        'users.User',
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='member',
        verbose_name="Пользователь",
        help_text="Выберите пользователя"
    )
    event = models.ForeignKey(
        'Event',
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='member',
        verbose_name="Событие",
        help_text="Выберите событие"
    )
    winner = models.BooleanField(
        default=False,
        verbose_name="Победитель",
        help_text="Укажите, является ли участник победителем"
    )
    joined_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Дата присоединения",
        help_text="Дата присоединения участника"
    )

    class Meta:
        verbose_name = "Участник"
        verbose_name_plural = "Участники"

    def save(self, *args, **kwargs):
        if self.event.member.count() >= self.event.max_members:
            raise ValidationError(f"Уже достаточное количество участников")
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.user} - {self.joined_at}'


class Work(models.Model):
    event = models.ForeignKey(
        "Event",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='work',
        verbose_name="Событие",
        help_text="Выберите событие"
    )
    member = models.ForeignKey(
        "Member",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='work',
        verbose_name="Участник",
        help_text="Выберите участника"
    )
    url_video = models.TextField(default="", blank=True, verbose_name="Урл видео")
    url_message_video = models.TextField(default="", blank=True, verbose_name="Урл сообщения")
    is_done = models.BooleanField(default=False, verbose_name="Оценили ли все работу")

    def save(self, *args, **kwargs):
        if self.id:
            if len(self.event.criteries) == (self.result.count() - 1):
                self.is_done = True
            else:
                self.is_done = False
        super().save(*args, **kwargs)

    class Meta:
        verbose_name = "Работа"
        verbose_name_plural = "Работы"


class ImagesWork(models.Model):
    image = models.ImageField(
        upload_to="images_work",
        null=True,
        blank=True,
        verbose_name="Изображение",
        help_text="Загрузите изображение работы"
    )
    work = models.ForeignKey(
        "Work",
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='images_work',
        verbose_name="Работа",
        help_text="Выберите работу"
    )

    class Meta:
        verbose_name = "Картинка работы"
        verbose_name_plural = "Картинки работ"

    def save(self, *args, **kwargs):
        if self.pk is None:
            # Количество фотографий в Work в момент сохранения новой фотографии
            photos_count_work = self.work.images_work.count()

            # Количество фотографий в Event, относящейся к запрошенной MemberNomination
            photos_count_event = self.work.event.count_photo

            if photos_count_work >= photos_count_event:
                return ValidationError(
                    f"Максимум {photos_count_event} фотографии для данной работы."
                )

        super().save(*args, **kwargs)


class Result(models.Model):
    work = models.ForeignKey(
        'Work',
        on_delete=models.PROTECT,
        blank=True,
        null=True,
        related_name='result',
        verbose_name="Работа",
        help_text="Выберите работу"
    )
    reviewer = models.ForeignKey(
        'Member',
        on_delete=models.PROTECT,
        blank=True,
        null=True,
        related_name='result',
        verbose_name="Оценивающий",
        help_text="Выберите оценивающего"
    )
    score = models.JSONField(default=None, null=True,
                             verbose_name="Подробная оценка",
                             help_text="Не трогать. Считается автоматически!"
                             )

    class Meta:
        verbose_name = "Результат"
        verbose_name_plural = "Результаты"


@receiver(post_save, sender=Event)
def determine_achievements(sender, instance, created, **kwargs):
    if instance.is_finished:
        instance.find_winner()
        instance.give_achievements()


@receiver(post_save, sender=Result)
def save_works(sender, instance, created, **kwargs):
    w = Work.objects.filter(pk=instance.work.pk).first()
    if w:
        w.save()

# @receiver(post_save, sender=Work)
# def save_url(sender, instance, **kwargs):
#     if instance.url_video and not instance.url_message_video:
#         integration = TelegramIntegration()
#         integration.send_video_to_telegram_channel(instance)
