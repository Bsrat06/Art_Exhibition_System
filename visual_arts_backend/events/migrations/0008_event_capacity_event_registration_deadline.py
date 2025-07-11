# Generated by Django 5.1.5 on 2025-06-27 20:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('events', '0007_remove_event_end_date_remove_event_start_date_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='capacity',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='event',
            name='registration_deadline',
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
