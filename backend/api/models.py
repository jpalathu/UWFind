from django.db import models

# Create your models here.
class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=500)
    last_name = models.CharField(max_length=500)
    term = models.CharField(max_length=500)
    program = models.CharField(max_length=500)
    email = models.CharField(max_length=500, unique=True)
    auth0_id = models.CharField(max_length=500)

    class Meta:
        db_table = "user"
    
class DropOffLocation(models.Model):
    location_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=500)
    address = models.CharField(max_length=500)

    class Meta:
        db_table = "drop_off_location"

class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=500)

    class Meta:
        db_table = "category"

class Term(models.Model):
    term_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=500)

    class Meta:
        db_table = "term"

class Program(models.Model):
    program_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=500)

    class Meta:
        db_table = "program"

class Building(models.Model):
    building_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=500)

    class Meta:
        db_table = "building"

class FoundItemPost(models.Model):
    post_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=500)
    date = models.DateTimeField()
    # Django has an issue with creating these 2, so need to specify unique related_name
    found_user_id = models.ForeignKey(User, related_name="found_user_id", db_column="found_user_id", on_delete=models.DO_NOTHING)
    claimed_user_id = models.ForeignKey(User, related_name="claimed_user_id", db_column="claimed_user_id", null=True, on_delete=models.DO_NOTHING)
    drop_off_location_id = models.ForeignKey(DropOffLocation, db_column="drop_off_location_id", on_delete=models.DO_NOTHING)
    description = models.CharField(max_length=500)
    location = models.CharField(max_length=500, null=True)
    category_id = models.ForeignKey(Category, db_column="category_id", on_delete=models.DO_NOTHING)
    image_url = models.CharField(max_length=500, null=True)

    class Meta:
        db_table = "found_item_post"

class LostItemPost(models.Model):
    post_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=500)
    date = models.DateTimeField()
    lost_user_id = models.ForeignKey(User, db_column="lost_user_id", on_delete=models.DO_NOTHING)
    description = models.CharField(max_length=500)
    location = models.CharField(max_length=500, null=True)
    category_id = models.ForeignKey(Category, db_column="category_id", on_delete=models.DO_NOTHING)
    image_url = models.CharField(max_length=500, null=True)

    class Meta:
        db_table = "lost_item_post"