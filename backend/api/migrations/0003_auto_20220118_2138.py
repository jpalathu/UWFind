# Generated by Django 3.2.11 on 2022-01-19 02:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_auto_20220118_2128'),
    ]

    operations = [
        migrations.CreateModel(
            name='Building',
            fields=[
                ('building_id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=500)),
            ],
            options={
                'db_table': 'building',
            },
        ),
        migrations.CreateModel(
            name='Program',
            fields=[
                ('program_id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=500)),
            ],
            options={
                'db_table': 'program',
            },
        ),
        migrations.CreateModel(
            name='Term',
            fields=[
                ('term_id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=500)),
            ],
            options={
                'db_table': 'term',
            },
        ),
        migrations.AddField(
            model_name='founditempost',
            name='title',
            field=models.CharField(default='test', max_length=500),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='lostitempost',
            name='title',
            field=models.CharField(default='test', max_length=500),
            preserve_default=False,
        ),
    ]
