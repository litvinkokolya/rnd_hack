# Generated by Django 5.1.2 on 2024-10-26 14:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='prize',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
    ]
