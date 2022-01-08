from django.db import models

# Create your models here.
class User(models.Model):
    userID = models.AutoField(primary_key=True)
    firstName = models.CharField(max_length=500)
    lastName = models.CharField(max_length=500)
    email = models.CharField(max_length=500)
    phoneNumber = models.CharField(max_length=500)

    class Meta:
        db_table = "User"
    
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
    # Django has an issue with creating these 2, so need to specify unique related_name
    foundUserID = models.ForeignKey(User, related_name="foundUserID", db_column="foundUserID", on_delete=models.DO_NOTHING)
    claimedUserID = models.ForeignKey(User, related_name="claimedUserID", db_column="claimedUserID", null=True, on_delete=models.DO_NOTHING)
    dropOffLocationID = models.ForeignKey(DropOffLocation, db_column="dropOffLocationID", on_delete=models.DO_NOTHING)
    description = models.CharField(max_length=500)
    foundLocation = models.CharField(max_length=500, null=True)
    categoryID = models.ForeignKey(Category, db_column="categoryID", on_delete=models.DO_NOTHING)
    imageID = models.OneToOneField(Image, db_column="imageID", null=True, on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "FoundItemPost"

class LostItemPost(models.Model):
    postID = models.AutoField(primary_key=True)
    date = models.DateTimeField()
    lostUserID = models.ForeignKey(User, db_column="lostUserID", on_delete=models.DO_NOTHING)
    description = models.CharField(max_length=500)
    lostLocation = models.CharField(max_length=500, null=True)
    categoryID = models.ForeignKey(Category, db_column="categoryID", on_delete=models.DO_NOTHING)
    imageID = models.OneToOneField(Image, db_column="imageID", null=True, on_delete=models.DO_NOTHING)

    class Meta:
        db_table = "LostItemPost"