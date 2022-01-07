from django.db import models

# Create your models here.
class DropOffLocation(models.Model):
    locationID = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    address = models.CharField(max_length=100)

    class Meta:
        db_table = "DropOffLocation"

class Category(models.Model):
    categoryID = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)

    class Meta:
        db_table = "Category"