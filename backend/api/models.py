from django.db import models

# Create your models here.
class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    first_name = models.CharField(max_length=500)
    last_name = models.CharField(max_length=500)
    bio = models.CharField(max_length=500)
    image_url = models.CharField(max_length=500, null=True)
    email = models.CharField(max_length=500, unique=True)
    auth0_id = models.CharField(max_length=500)

    class Meta:
        db_table = "user"
    
class DropOffLocation(models.Model):
    location_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=500)

    class Meta:
        db_table = "drop_off_location"

class Category(models.Model):
    category_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=500)

    class Meta:
        db_table = "category"

class Building(models.Model):
    building_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=500)

    class Meta:
        db_table = "building"

class FoundItemPost(models.Model):
    post_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=500)
    date = models.DateField()
    # Django has an issue with creating these 2, so need to specify unique related_name
    found_user_id = models.ForeignKey(User, related_name="found_user_id", db_column="found_user_id", on_delete=models.DO_NOTHING)
    claimed_user_id = models.ForeignKey(User, related_name="claimed_user_id", db_column="claimed_user_id", null=True, on_delete=models.DO_NOTHING)
    drop_off_location_id = models.ForeignKey(DropOffLocation, db_column="drop_off_location_id", null=True, on_delete=models.DO_NOTHING)
    other_drop_off_location = models.CharField(max_length=500, null=True)
    description = models.CharField(max_length=500)
    building_id = models.ForeignKey(Building, db_column="building_id", on_delete=models.DO_NOTHING)
    category_id = models.ForeignKey(Category, db_column="category_id", on_delete=models.DO_NOTHING)
    image_url = models.CharField(max_length=500, null=True)
    deleted_at = models.DateTimeField(null=True)

    class Meta:
        db_table = "found_item_post"

class LostItemPost(models.Model):
    post_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=500)
    date = models.DateField()
    lost_user_id = models.ForeignKey(User, db_column="lost_user_id", on_delete=models.DO_NOTHING)
    description = models.CharField(max_length=500)
    building_id = models.ForeignKey(Building, db_column="building_id", on_delete=models.DO_NOTHING)
    category_id = models.ForeignKey(Category, db_column="category_id", on_delete=models.DO_NOTHING)
    image_url = models.CharField(max_length=500, null=True)
    deleted_at = models.DateTimeField(null=True)

    class Meta:
        db_table = "lost_item_post"
class ChatRoom(models.Model):
    chat_room_id = models.AutoField(primary_key=True)
    created_at = models.DateTimeField()
    deleted_at = models.DateTimeField(null=True)

    class Meta:
        db_table = "chat_room"

class Message(models.Model):
    message_id = models.AutoField(primary_key=True)
    chat_room_id = models.ForeignKey(ChatRoom, db_column="chat_room_id", on_delete=models.DO_NOTHING)
    sender_id = models.ForeignKey(User, db_column="sender_id", on_delete=models.DO_NOTHING)
    content = models.TextField()
    created_at = models.DateTimeField()
    deleted_at = models.DateTimeField(null=True)

    class Meta:
        db_table = "message"

class ChatRoomUser(models.Model):
    chat_room_id = models.OneToOneField(ChatRoom, primary_key=True, db_column="chat_room_id", on_delete=models.DO_NOTHING)
    user_id = models.OneToOneField(User, db_column="user_id", on_delete=models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = "chat_room_user"
        unique_together = (("chat_room_id", "user_id"))