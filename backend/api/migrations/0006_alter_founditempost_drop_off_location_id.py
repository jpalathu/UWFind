# Generated by Django 3.2.11 on 2022-01-20 21:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_auto_20220120_0042'),
    ]

    operations = [
        migrations.AlterField(
            model_name='founditempost',
            name='drop_off_location_id',
            field=models.ForeignKey(db_column='drop_off_location_id', null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='api.dropofflocation'),
        ),
    ]