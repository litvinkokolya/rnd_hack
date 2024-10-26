from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    'check-events-every-midnight': {
        'task': 'apps.events.tasks.check_events',
        'schedule': crontab(minute=0, hour=0),  # Каждый день в полночь
    },
}
