# Generated by Django 3.2.11 on 2022-01-23 19:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_auto_20220121_1540'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='dropofflocation',
            name='address',
        ),
        migrations.AddField(
            model_name='founditempost',
            name='other_drop_off_location',
            field=models.CharField(max_length=500, null=True),
        ),
    ]
