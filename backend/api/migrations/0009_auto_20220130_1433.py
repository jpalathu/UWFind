# Generated by Django 3.2.11 on 2022-01-30 19:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0008_auto_20220123_1423'),
    ]

    operations = [
        migrations.AlterField(
            model_name='founditempost',
            name='date',
            field=models.DateField(),
        ),
        migrations.AlterField(
            model_name='lostitempost',
            name='date',
            field=models.DateField(),
        ),
    ]
