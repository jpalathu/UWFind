from django.db import models

# Create your models here.
class DropOffLocation(models.Model):
    locationID = models.AutoField(primary_key=True)
    name = models.CharField(max_length=500)
    address = models.CharField(max_length=500)

    class Meta:
        db_table = "DropOffLocation"

class Category(models.Model):
    categoryID = models.AutoField(primary_key=True)
    name = models.CharField(max_length=500)

    class Meta:
        db_table = "Category"

class Image(models.Model):
    imageID = models.AutoField(primary_key=True)
    image = models.BinaryField()

    class Meta:
        db_table = "Image"

class FoundItemPost(models.Model):
    postID = models.AutoField(primary_key=True)
    date = models.DateTimeField()
    dropOffLocationID = models.ForeignKey(DropOffLocation, on_delete=models.DO_NOTHING)
    description = models.CharField(max_length=500)
    foundLocation = models.CharField(max_length=500, null=True)
    categoryID = models.ForeignKey(Category, on_delete=models.DO_NOTHING)
    imageID = models.ForeignKey(Image, null=True, on_delete=models.CASCADE)

    class Meta:
        db_table = "FoundItemPost"

class LostItemPost(models.Model):
    postID = models.AutoField(primary_key=True)
    date = models.DateTimeField()
    description = models.CharField(max_length=500)
    lostLocation = models.CharField(max_length=500, null=True)
    categoryID = models.ForeignKey(Category, on_delete=models.DO_NOTHING)
    imageID = models.ForeignKey(Image, null=True, on_delete=models.CASCADE)

    class Meta:
        db_table = "LostItemPost"