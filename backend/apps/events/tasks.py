from datetime import date

from celery import shared_task

from apps.events.models import Event


@shared_task
def check_events():
    today = date.today()
    events = Event.objects.filter(end_date=today, is_finished=False)
    for event in events:
        event.is_finished = True
        event.save()
