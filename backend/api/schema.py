from datetime import datetime
from re import U
import graphene
from graphene.types import mutation
from graphene_django.types import DjangoObjectType
from .models import Building, ChatRoom, ChatRoomUser, FoundItemPost, LostItemPost, Message, User, DropOffLocation, Category
from django.core.exceptions import BadRequest
from auth0.v3.authentication import Database, GetToken
from auth0.v3.exceptions import Auth0Error
from datetime import datetime
import channels_graphql_ws

AUTH0_DOMAIN = "dev-n2mrf68i.us.auth0.com"
AUTH0_MGMT_API_AUDIENCE = "https://dev-n2mrf68i.us.auth0.com/api/v2/"
AUTH0_MGMT_API_TOKEN = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ind4YjJKakljV21oN3J5M1hzR2lvdiJ9.eyJpc3MiOiJodHRwczovL2Rldi1uMm1yZjY4aS51cy5hdXRoMC5jb20vIiwic3ViIjoic2Y2U3E3T1k4Qk8xamVnMHdiam1ZZ1BUZzg4NHJRcm1AY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vZGV2LW4ybXJmNjhpLnVzLmF1dGgwLmNvbS9hcGkvdjIvIiwiaWF0IjoxNjQxOTU1ODY0LCJleHAiOjE2NDIwNDIyNjQsImF6cCI6InNmNlNxN09ZOEJPMWplZzB3YmptWWdQVGc4ODRyUXJtIiwic2NvcGUiOiJyZWFkOmNsaWVudF9ncmFudHMgY3JlYXRlOmNsaWVudF9ncmFudHMgZGVsZXRlOmNsaWVudF9ncmFudHMgdXBkYXRlOmNsaWVudF9ncmFudHMgcmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGRlbGV0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgY3JlYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSByZWFkOnVzZXJfY3VzdG9tX2Jsb2NrcyBjcmVhdGU6dXNlcl9jdXN0b21fYmxvY2tzIGRlbGV0ZTp1c2VyX2N1c3RvbV9ibG9ja3MgY3JlYXRlOnVzZXJfdGlja2V0cyByZWFkOmNsaWVudHMgdXBkYXRlOmNsaWVudHMgZGVsZXRlOmNsaWVudHMgY3JlYXRlOmNsaWVudHMgcmVhZDpjbGllbnRfa2V5cyB1cGRhdGU6Y2xpZW50X2tleXMgZGVsZXRlOmNsaWVudF9rZXlzIGNyZWF0ZTpjbGllbnRfa2V5cyByZWFkOmNvbm5lY3Rpb25zIHVwZGF0ZTpjb25uZWN0aW9ucyBkZWxldGU6Y29ubmVjdGlvbnMgY3JlYXRlOmNvbm5lY3Rpb25zIHJlYWQ6cmVzb3VyY2Vfc2VydmVycyB1cGRhdGU6cmVzb3VyY2Vfc2VydmVycyBkZWxldGU6cmVzb3VyY2Vfc2VydmVycyBjcmVhdGU6cmVzb3VyY2Vfc2VydmVycyByZWFkOmRldmljZV9jcmVkZW50aWFscyB1cGRhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGRlbGV0ZTpkZXZpY2VfY3JlZGVudGlhbHMgY3JlYXRlOmRldmljZV9jcmVkZW50aWFscyByZWFkOnJ1bGVzIHVwZGF0ZTpydWxlcyBkZWxldGU6cnVsZXMgY3JlYXRlOnJ1bGVzIHJlYWQ6cnVsZXNfY29uZmlncyB1cGRhdGU6cnVsZXNfY29uZmlncyBkZWxldGU6cnVsZXNfY29uZmlncyByZWFkOmhvb2tzIHVwZGF0ZTpob29rcyBkZWxldGU6aG9va3MgY3JlYXRlOmhvb2tzIHJlYWQ6YWN0aW9ucyB1cGRhdGU6YWN0aW9ucyBkZWxldGU6YWN0aW9ucyBjcmVhdGU6YWN0aW9ucyByZWFkOmVtYWlsX3Byb3ZpZGVyIHVwZGF0ZTplbWFpbF9wcm92aWRlciBkZWxldGU6ZW1haWxfcHJvdmlkZXIgY3JlYXRlOmVtYWlsX3Byb3ZpZGVyIGJsYWNrbGlzdDp0b2tlbnMgcmVhZDpzdGF0cyByZWFkOmluc2lnaHRzIHJlYWQ6dGVuYW50X3NldHRpbmdzIHVwZGF0ZTp0ZW5hbnRfc2V0dGluZ3MgcmVhZDpsb2dzIHJlYWQ6bG9nc191c2VycyByZWFkOnNoaWVsZHMgY3JlYXRlOnNoaWVsZHMgdXBkYXRlOnNoaWVsZHMgZGVsZXRlOnNoaWVsZHMgcmVhZDphbm9tYWx5X2Jsb2NrcyBkZWxldGU6YW5vbWFseV9ibG9ja3MgdXBkYXRlOnRyaWdnZXJzIHJlYWQ6dHJpZ2dlcnMgcmVhZDpncmFudHMgZGVsZXRlOmdyYW50cyByZWFkOmd1YXJkaWFuX2ZhY3RvcnMgdXBkYXRlOmd1YXJkaWFuX2ZhY3RvcnMgcmVhZDpndWFyZGlhbl9lbnJvbGxtZW50cyBkZWxldGU6Z3VhcmRpYW5fZW5yb2xsbWVudHMgY3JlYXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRfdGlja2V0cyByZWFkOnVzZXJfaWRwX3Rva2VucyBjcmVhdGU6cGFzc3dvcmRzX2NoZWNraW5nX2pvYiBkZWxldGU6cGFzc3dvcmRzX2NoZWNraW5nX2pvYiByZWFkOmN1c3RvbV9kb21haW5zIGRlbGV0ZTpjdXN0b21fZG9tYWlucyBjcmVhdGU6Y3VzdG9tX2RvbWFpbnMgdXBkYXRlOmN1c3RvbV9kb21haW5zIHJlYWQ6ZW1haWxfdGVtcGxhdGVzIGNyZWF0ZTplbWFpbF90ZW1wbGF0ZXMgdXBkYXRlOmVtYWlsX3RlbXBsYXRlcyByZWFkOm1mYV9wb2xpY2llcyB1cGRhdGU6bWZhX3BvbGljaWVzIHJlYWQ6cm9sZXMgY3JlYXRlOnJvbGVzIGRlbGV0ZTpyb2xlcyB1cGRhdGU6cm9sZXMgcmVhZDpwcm9tcHRzIHVwZGF0ZTpwcm9tcHRzIHJlYWQ6YnJhbmRpbmcgdXBkYXRlOmJyYW5kaW5nIGRlbGV0ZTpicmFuZGluZyByZWFkOmxvZ19zdHJlYW1zIGNyZWF0ZTpsb2dfc3RyZWFtcyBkZWxldGU6bG9nX3N0cmVhbXMgdXBkYXRlOmxvZ19zdHJlYW1zIGNyZWF0ZTpzaWduaW5nX2tleXMgcmVhZDpzaWduaW5nX2tleXMgdXBkYXRlOnNpZ25pbmdfa2V5cyByZWFkOmxpbWl0cyB1cGRhdGU6bGltaXRzIGNyZWF0ZTpyb2xlX21lbWJlcnMgcmVhZDpyb2xlX21lbWJlcnMgZGVsZXRlOnJvbGVfbWVtYmVycyByZWFkOmVudGl0bGVtZW50cyByZWFkOmF0dGFja19wcm90ZWN0aW9uIHVwZGF0ZTphdHRhY2tfcHJvdGVjdGlvbiByZWFkOm9yZ2FuaXphdGlvbnMgdXBkYXRlOm9yZ2FuaXphdGlvbnMgY3JlYXRlOm9yZ2FuaXphdGlvbnMgZGVsZXRlOm9yZ2FuaXphdGlvbnMgY3JlYXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJzIHJlYWQ6b3JnYW5pemF0aW9uX21lbWJlcnMgZGVsZXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJzIGNyZWF0ZTpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgcmVhZDpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgdXBkYXRlOm9yZ2FuaXphdGlvbl9jb25uZWN0aW9ucyBkZWxldGU6b3JnYW5pemF0aW9uX2Nvbm5lY3Rpb25zIGNyZWF0ZTpvcmdhbml6YXRpb25fbWVtYmVyX3JvbGVzIHJlYWQ6b3JnYW5pemF0aW9uX21lbWJlcl9yb2xlcyBkZWxldGU6b3JnYW5pemF0aW9uX21lbWJlcl9yb2xlcyBjcmVhdGU6b3JnYW5pemF0aW9uX2ludml0YXRpb25zIHJlYWQ6b3JnYW5pemF0aW9uX2ludml0YXRpb25zIGRlbGV0ZTpvcmdhbml6YXRpb25faW52aXRhdGlvbnMiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.TxGHd3tOYnXPiiMpzfHXiZsHEG-a0W0FxbhxZVdVGyzoMNQx7fu1Zo8Lme3aoso8q_-uhNTvPRxMDR5BXZnkEAv9y6P3ai9PeO2xRX9skT58QlGEyfTMspif46XKfk_ACOg1MuArGJHCbyX2JWUva22B8OCVQtahfsxEco4ee3V8vR0VuL9dMkpOcGsdg9Xu7BJbO1KKiWxXDmOrm_ZnW58FUUzUiWknEWnHQE_uXlTGZBYZ4zrfWZRi6-t5FMy4bcRo05oVMDlWYPNlmllMz8pk_aJhtu1b_NSotLmE7uL1pd5E7pPi99mFUqm9UjTjABuso_0rw8Z5k6jX5ZDktg"
AUTH0_CLIENT_ID = "mKN433oSPMGyYTcrPnLLmERQeedyrDme"
AUTH0_CLIENT_SECRET = "05ofvPW8hOw8X1B6tC9WEhQXd54KJwyInieplX0n_lyv9vKrzitNihAgG2PTTnQ2"
AUTH0_DATABASE_CONNECTION = "UWFind"

auth0_database_instance = Database(AUTH0_DOMAIN)
auth0_token_instance = GetToken(AUTH0_DOMAIN)

####################################################################### User ###############################################################
class UserType(DjangoObjectType):
    class Meta:
        model = User

class UserInput(graphene.InputObjectType):
    first_name = graphene.String(required=True)
    last_name = graphene.String(required=True)
    bio = graphene.String(required=True)
    email = graphene.String()
    image_url = graphene.String()
    password = graphene.String()

class UpdateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        id = graphene.Int(required=True)
        input = UserInput(required=True)

    def mutate(root, info, id, input):
        try:
            user_instance = User.objects.get(user_id=id)
            if user_instance:
                user_instance.first_name = input.first_name
                user_instance.last_name = input.last_name
                user_instance.bio = input.bio
                user_instance.image_url = None if input.image_url is None else input.image_url
                user_instance.save()
                return UpdateUser(user=user_instance)
            return UpdateUser(user=None)
        except:
            raise BadRequest("Unable to update user")

#################################################################### Authentication #############################################################
class SignUp(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        input = UserInput(required=True)

    def mutate(root, info, input):
        try:
            # make sure the user doesn't exist in our database (and ideally in auth0 too)
            internal_user = User.objects.filter(email=input.email).first()
            if internal_user:
                raise BadRequest("User already exists")
            auth0_user = auth0_database_instance.signup(client_id=AUTH0_CLIENT_ID, email=input.email, password=input.password, connection=AUTH0_DATABASE_CONNECTION)
            user_instance = User(
                first_name=input.first_name, 
                last_name=input.last_name,
                bio=input.bio, 
                email=input.email, 
                image_url=None,
                auth0_id="auth0|" + auth0_user["_id"])
            user_instance.save()
            return SignUp(user=user_instance)
        except Auth0Error as error:
            raise BadRequest(error.message)

class Login(graphene.ObjectType):
    user = graphene.Field(UserType)
    token = graphene.JSONString()

class ResetPassword(graphene.Mutation):
    is_sent = graphene.Boolean()
    class Arguments:
        email = graphene.String()
    
    def mutate(root, info, email):
        try:
            # send change password email
            auth0_database_instance.change_password(client_id=AUTH0_CLIENT_ID, email=email, connection=AUTH0_DATABASE_CONNECTION)
            return ResetPassword(is_sent=True)
        except Auth0Error as error:
            raise BadRequest(error.message)

#################################################################### DropOffLocation ###############################################################
class DropOffLocationType(DjangoObjectType):
    class Meta:
        model = DropOffLocation

##################################################################### Category ###############################################################
class CategoryType(DjangoObjectType):
    class Meta:
        model = Category

##################################################################### Building ###############################################################
class BuildingType(DjangoObjectType):
    class Meta:
        model = Building

##################################################################### LostItemPost ###############################################################
class LostItemPostType(DjangoObjectType):
    class Meta:
        model = LostItemPost

class LostItemPostInput(graphene.InputObjectType):
    title = graphene.String(required=True)
    lost_user_id = graphene.Int(required=True)
    description = graphene.String(required=True)
    building_id = graphene.Int(required=True)
    category_id = graphene.Int(required=True)
    image_url = graphene.String()
    date = graphene.String(required=True)

class LostItemPostFilterInput(graphene.InputObjectType):
    start_date = graphene.String()
    end_date = graphene.String()
    building_id = graphene.Int()
    category_id = graphene.Int()

class CreateLostItemPost(graphene.Mutation):
    lost_item_post = graphene.Field(LostItemPostType)

    class Arguments:
        input = LostItemPostInput(required=True)

    def mutate(root, info, input):
        try:
            post_instance = LostItemPost(
                title = input.title,
                lost_user_id = User.objects.get(user_id=input.lost_user_id),
                description = input.description,
                building_id = Building.objects.get(building_id=input.building_id),
                category_id = Category.objects.get(category_id=input.category_id),
                image_url = None if input.image_url is None else input.image_url,
                date = input.date
            )
            post_instance.save()
            return CreateLostItemPost(lost_item_post=post_instance)
        except:
            raise BadRequest("Unable to create lost item post")

class UpdateLostItemPost(graphene.Mutation):
    lost_item_post = graphene.Field(LostItemPostType)

    class Arguments:
        id = graphene.Int(required=True)
        input = LostItemPostInput(required=True)

    def mutate(root, info, id, input):
        try:
            post_instance = LostItemPost.objects.get(post_id=id)
            post_instance.title = input.title
            post_instance.description = input.description
            post_instance.building_id = Building.objects.get(building_id=input.building_id)
            post_instance.category_id = Category.objects.get(category_id=input.category_id)
            post_instance.image_url = None if input.image_url is None else input.image_url
            post_instance.date = input.date
            post_instance.save()
            return UpdateLostItemPost(lost_item_post=post_instance)
        except:
            raise BadRequest("Unable to update lost item post")

class DeleteLostItemPost(graphene.Mutation):
    lost_item_post = graphene.Field(LostItemPostType)

    class Arguments:
        id = graphene.Int(required=True)

    def mutate(root, info, id):
        try:
            post_instance = LostItemPost.objects.get(post_id=id)
            post_instance.deleted_at = datetime.now()
            post_instance.save()
            return DeleteLostItemPost(lost_item_post=post_instance)
        except:
            raise BadRequest("Unable to delete lost item post")


##################################################################### FoundItemPost ###############################################################
class FoundItemPostType(DjangoObjectType):
    class Meta:
        model = FoundItemPost

class FoundItemPostInput(graphene.InputObjectType):
    title = graphene.String(required=True)
    found_user_id = graphene.Int(required=True)
    claimed_user_id = graphene.Int()
    drop_off_location_id = graphene.Int()
    other_drop_off_location = graphene.String()
    description = graphene.String(required=True)
    building_id = graphene.Int(required=True)
    category_id = graphene.Int(required=True)
    image_url = graphene.String()
    date = graphene.String(required=True)

class FoundItemPostFilterInput(graphene.InputObjectType):
    start_date = graphene.String()
    end_date = graphene.String()
    building_id = graphene.Int()
    category_id = graphene.Int()

class CreateFoundItemPost(graphene.Mutation):
    found_item_post = graphene.Field(FoundItemPostType)

    class Arguments:
        input = FoundItemPostInput(required=True)

    def mutate(root, info, input):
        try:
            post_instance = FoundItemPost(
                title = input.title,
                found_user_id = User.objects.get(user_id=input.found_user_id),
                claimed_user_id = None if input.claimed_user_id is None else User.objects.get(user_id=input.claimed_user_id),
                drop_off_location_id = None if input.drop_off_location_id is None else DropOffLocation.objects.get(location_id=input.drop_off_location_id),
                other_drop_off_location = None if input.other_drop_off_location is None else input.other_drop_off_location,
                description = input.description,
                building_id = Building.objects.get(building_id=input.building_id),
                category_id = Category.objects.get(category_id=input.category_id),
                image_url = None if input.image_url is None else input.image_url,
                date = input.date
            )
            post_instance.save()
            return CreateFoundItemPost(found_item_post=post_instance)
        except:
            raise BadRequest("Unable to create found item post")

class UpdateFoundItemPost(graphene.Mutation):
    found_item_post = graphene.Field(FoundItemPostType)

    class Arguments:
        id = graphene.Int(required=True)
        input = FoundItemPostInput(required=True)

    def mutate(root, info, id, input):
        try:
            post_instance = FoundItemPost.objects.get(post_id=id)
            post_instance.title = input.title
            post_instance.description = input.description
            post_instance.drop_off_location_id = None if input.drop_off_location_id is None else DropOffLocation.objects.get(location_id=input.drop_off_location_id)
            post_instance.other_drop_off_location = None if input.other_drop_off_location is None else input.other_drop_off_location
            post_instance.building_id = Building.objects.get(building_id=input.building_id)
            post_instance.category_id = Category.objects.get(category_id=input.category_id)
            post_instance.image_url = None if input.image_url is None else input.image_url
            post_instance.date = input.date
            post_instance.save()
            return UpdateFoundItemPost(found_item_post=post_instance)
        except:
            raise BadRequest("Unable to update found item post")

class DeleteFoundItemPost(graphene.Mutation):
    found_item_post = graphene.Field(FoundItemPostType)

    class Arguments:
        id = graphene.Int(required=True)

    def mutate(root, info, id):
        try:
            post_instance = FoundItemPost.objects.get(post_id=id)
            post_instance.deleted_at = datetime.now()
            post_instance.save()
            return DeleteFoundItemPost(found_item_post=post_instance)
        except:
            raise BadRequest("Unable to delete found item post")

########################################################################### Chat ###################################################################
class ChatRoomType(DjangoObjectType):
    class Meta:
        model = ChatRoom

class CreateChatRoom(graphene.Mutation):
    chat_room = graphene.Field(ChatRoomType)
    user = graphene.Field(UserType)
    already_exists = graphene.Boolean()
    class Arguments:
        current_user_id = graphene.Int(required=True)
        other_user_id = graphene.Int(required=True)

    def mutate(root, info, current_user_id, other_user_id):
        try:
            # first check if a chatroom with you and the other exists
            # if it does, then return already_exists True
            # else create a new chat room and add both to the chat room user table
            chat_room_users = ChatRoomUser.objects.filter(user_id=current_user_id)
            for item in chat_room_users.iterator():
                other = ChatRoomUser.objects.filter(user_id=other_user_id, chat_room_id=item.chat_room_id.chat_room_id).first()
                if other:
                    return CreateChatRoom(
                        already_exists=True, 
                        chat_room=item.chat_room_id,
                        user=other.user_id
                    )
              
            chat_room_instance = ChatRoom(created_at=datetime.now())
            chat_room_instance.save()

            current_user = User.objects.get(user_id=current_user_id)
            other_user = User.objects.get(user_id=other_user_id)
            save_list = [
                ChatRoomUser(chat_room_id=chat_room_instance, user_id=current_user),
                ChatRoomUser(chat_room_id=chat_room_instance, user_id=other_user)
            ]
            ChatRoomUser.objects.bulk_create(save_list)

            return CreateChatRoom(
                already_exists=False, 
                chat_room=chat_room_instance,
                user=other_user
            )
        except:
            raise BadRequest("Unable to create chat room")

class MessageType(DjangoObjectType):
    class Meta:
        model = Message

class MessageInput(graphene.InputObjectType):
    chat_room_id = graphene.Int(required=True)
    sender_id = graphene.Int(required=True)
    content = graphene.String(required=True)

class SendMessage(graphene.Mutation):
    message = graphene.Field(MessageType)

    class Arguments:
        input = MessageInput(required=True)

    def mutate(root, info, input):
        try:
            message_instance = Message(
                chat_room_id=ChatRoom.objects.get(chat_room_id=input.chat_room_id),
                sender_id=User.objects.get(user_id=input.sender_id),
                content=input.content,
                created_at=datetime.now()
            )
            message_instance.save()
 
            OnNewMessage.broadcast(payload=message_instance, group="{}".format(input.chat_room_id))
            return SendMessage(message=message_instance)
        except:
            raise BadRequest("Unable to send message")

class OnNewMessage(channels_graphql_ws.Subscription):
    message = graphene.Field(MessageType)

    class Arguments:
        chat_room_id = graphene.Int()

    def subscribe(root, info, chat_room_id=None):
        return ["{}".format(chat_room_id)] if chat_room_id is not None else None

    def publish(root, info, chat_room_id):
        return OnNewMessage(message=root)

class ChatRoomUserType(DjangoObjectType):
    class Meta:
        model = ChatRoomUser

class CustomChatRoom(graphene.ObjectType):
    chat_room_id = graphene.Int()
    first_name = graphene.String()
    last_name = graphene.String()
    image_url = graphene.String()
    last_message = graphene.String()
    last_modified = graphene.DateTime()


#################################################################### Query and Mutation ############################################################
class Query(graphene.ObjectType):
    drop_off_locations = graphene.List(DropOffLocationType)
    categories = graphene.List(CategoryType)
    buildings = graphene.List(BuildingType)
    user_by_id = graphene.Field(UserType, id=graphene.Int())
    login = graphene.Field(Login, email=graphene.String(), password=graphene.String())
    lost_item_posts = graphene.List(LostItemPostType, filter=LostItemPostFilterInput())
    lost_item_post_by_id = graphene.Field(LostItemPostType, id=graphene.Int())
    found_item_posts = graphene.List(FoundItemPostType, filter=FoundItemPostFilterInput())
    found_item_post_by_id = graphene.Field(FoundItemPostType, id=graphene.Int())
    messages = graphene.List(MessageType, chat_room_id=graphene.Int())
    chat_rooms = graphene.List(CustomChatRoom, user_id=graphene.Int())
    users = graphene.List(UserType, current_user_id=graphene.Int())

    def resolve_drop_off_locations(root, info):
        return DropOffLocation.objects.all()

    def resolve_categories(root, info):
        return Category.objects.all()

    def resolve_buildings(root, info):
        return Building.objects.all()
    
    def resolve_user_by_id(root, info, id):
        return User.objects.get(user_id=id)
    
    def resolve_login(root, info, email, password):
        try:
            # check if user exists in database
            internal_user = User.objects.filter(email=email).first()
            if not internal_user:
                raise BadRequest("User doesn't exist")
            # check if valid login
            result = auth0_token_instance.login(
                client_id=AUTH0_CLIENT_ID, 
                client_secret=AUTH0_CLIENT_SECRET,
                username=email, 
                password=password, 
                realm=AUTH0_DATABASE_CONNECTION,
                scope="openid",
                audience=AUTH0_MGMT_API_AUDIENCE
            )
            return Login(token=result, user=internal_user)
        except Auth0Error as error:
            raise BadRequest(error.message)

    def resolve_lost_item_posts(root, info, filter):
        category_exists = filter.category_id is not None
        building_exists = filter.building_id is not None
        date_range_exists = filter.start_date is not None and filter.end_date is not None
        
        posts = LostItemPost.objects.filter(deleted_at=None)
        if category_exists:
            posts = posts.filter(category_id=filter.category_id)
        if building_exists:
            posts = posts.filter(building_id=filter.building_id)
        if date_range_exists:
            posts = posts.filter(date__range=[filter.start_date, filter.end_date])

        return posts

    def resolve_lost_item_post_by_id(root, info, id):
        return LostItemPost.objects.get(post_id=id)

    def resolve_found_item_posts(root, info, filter):
        category_exists = filter.category_id is not None
        building_exists = filter.building_id is not None
        date_range_exists = filter.start_date is not None and filter.end_date is not None
        
        posts = FoundItemPost.objects.filter(deleted_at=None)
        if category_exists:
            posts = posts.filter(category_id=filter.category_id)
        if building_exists:
            posts = posts.filter(building_id=filter.building_id)
        if date_range_exists:
            posts = posts.filter(date__range=[filter.start_date, filter.end_date])

        return posts

    def resolve_found_item_post_by_id(root, info, id):
        return FoundItemPost.objects.get(post_id=id)

    def resolve_messages(root, info, chat_room_id):
        return Message.objects.filter(chat_room_id=chat_room_id).order_by("-created_at")

    def resolve_chat_rooms(root, info, user_id):
        # get all chat rooms for this user
        chat_room_users = ChatRoomUser.objects.filter(user_id=user_id)
        res = []

        for item in chat_room_users.iterator():
            other_chat_room_user = ChatRoomUser.objects.filter(chat_room_id=item.chat_room_id.chat_room_id).exclude(user_id=user_id).first()
            other_user = other_chat_room_user.user_id
            message = Message.objects.filter(chat_room_id=item.chat_room_id.chat_room_id).order_by("-created_at").first()
            res.append(CustomChatRoom(
                chat_room_id=item.chat_room_id.chat_room_id,
                first_name = other_user.first_name,
                last_name = other_user.last_name,
                image_url = other_user.image_url,
                last_message = "You can now chat with" + " " + other_user.first_name + " " + other_user.last_name if message is None else message.content,
                last_modified = item.chat_room_id.created_at if message is None else message.created_at
            ))

        return res

    def resolve_users(root, info, current_user_id):
        return User.objects.exclude(user_id=current_user_id)
        

class Mutation(graphene.ObjectType):
    sign_up = SignUp.Field()
    reset_password = ResetPassword.Field()
    create_lost_item_post = CreateLostItemPost.Field()
    create_found_item_post = CreateFoundItemPost.Field()
    update_user = UpdateUser.Field()
    update_lost_item_post = UpdateLostItemPost.Field()
    update_found_item_post = UpdateFoundItemPost.Field()
    delete_lost_item_post = DeleteLostItemPost.Field()
    delete_found_item_post = DeleteFoundItemPost.Field()
    create_chat_room = CreateChatRoom.Field()
    send_message = SendMessage.Field()

class Subscription(graphene.ObjectType):
    on_new_message = OnNewMessage.Field()

schema = graphene.Schema(query=Query, mutation=Mutation, subscription=Subscription)

class MyGraphqlWsConsumer(channels_graphql_ws.GraphqlWsConsumer):
    schema = schema

    async def on_connect(self, payload):
        print("connected", payload)