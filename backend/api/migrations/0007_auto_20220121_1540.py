# Generated by Django 3.2.11 on 2022-01-21 20:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_alter_founditempost_drop_off_location_id'),
    ]

    operations = [
        migrations.DeleteModel(
            name='Program',
        ),
        migrations.DeleteModel(
            name='Term',
        ),
        migrations.RemoveField(
            model_name='user',
            name='program',
        ),
        migrations.RemoveField(
            model_name='user',
            name='term',
        ),
        migrations.AddField(
            model_name='user',
            name='bio',
            field=models.CharField(default='student', max_length=500),
            preserve_default=False,
        ),
    ]