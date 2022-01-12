import graphene
from graphene.types import mutation
from graphene_django.types import DjangoObjectType
from .models import User, DropOffLocation, Category
from auth0.v3.authentication import Database
from auth0.v3.exceptions import Auth0Error
from auth0.v3.management import Auth0

AUTH0_DOMAIN = "dev-n2mrf68i.us.auth0.com"
AUTH0_MGMT_API_TOKEN = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ind4YjJKakljV21oN3J5M1hzR2lvdiJ9.eyJpc3MiOiJodHRwczovL2Rldi1uMm1yZjY4aS51cy5hdXRoMC5jb20vIiwic3ViIjoic2Y2U3E3T1k4Qk8xamVnMHdiam1ZZ1BUZzg4NHJRcm1AY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vZGV2LW4ybXJmNjhpLnVzLmF1dGgwLmNvbS9hcGkvdjIvIiwiaWF0IjoxNjQxOTU1ODY0LCJleHAiOjE2NDIwNDIyNjQsImF6cCI6InNmNlNxN09ZOEJPMWplZzB3YmptWWdQVGc4ODRyUXJtIiwic2NvcGUiOiJyZWFkOmNsaWVudF9ncmFudHMgY3JlYXRlOmNsaWVudF9ncmFudHMgZGVsZXRlOmNsaWVudF9ncmFudHMgdXBkYXRlOmNsaWVudF9ncmFudHMgcmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGRlbGV0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgY3JlYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSByZWFkOnVzZXJfY3VzdG9tX2Jsb2NrcyBjcmVhdGU6dXNlcl9jdXN0b21fYmxvY2tzIGRlbGV0ZTp1c2VyX2N1c3RvbV9ibG9ja3MgY3JlYXRlOnVzZXJfdGlja2V0cyByZWFkOmNsaWVudHMgdXBkYXRlOmNsaWVudHMgZGVsZXRlOmNsaWVudHMgY3JlYXRlOmNsaWVudHMgcmVhZDpjbGllbnRfa2V5cyB1cGRhdGU6Y2xpZW50X2tleXMgZGVsZXRlOmNsaWVudF9rZXlzIGNyZWF0ZTpjbGllbnRfa2V5cyByZWFkOmNvbm5lY3Rpb25zIHVwZGF0ZTpjb25uZWN0aW9ucyBkZWxldGU6Y29ubmVjdGlvbnMgY3JlYXRlOmNvbm5lY3Rpb25zIHJlYWQ6cmVzb3VyY2Vfc2VydmVycyB1cGRhdGU6cmVzb3VyY2Vfc2VydmVycyBkZWxldGU6cmVzb3VyY2Vfc2VydmVycyBjcmVhdGU6cmVzb3VyY2Vfc2VydmVycyByZWFkOmRldmljZV9jcmVkZW50aWFscyB1cGRhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGRlbGV0ZTpkZXZpY2VfY3JlZGVudGlhbHMgY3JlYXRlOmRldmljZV9jcmVkZW50aWFscyByZWFkOnJ1bGVzIHVwZGF0ZTpydWxlcyBkZWxldGU6cnVsZXMgY3JlYXRlOnJ1bGVzIHJlYWQ6cnVsZXNfY29uZmlncyB1cGRhdGU6cnVsZXNfY29uZmlncyBkZWxldGU6cnVsZXNfY29uZmlncyByZWFkOmhvb2tzIHVwZGF0ZTpob29rcyBkZWxldGU6aG9va3MgY3JlYXRlOmhvb2tzIHJlYWQ6YWN0aW9ucyB1cGRhdGU6YWN0aW9ucyBkZWxldGU6YWN0aW9ucyBjcmVhdGU6YWN0aW9ucyByZWFkOmVtYWlsX3Byb3ZpZGVyIHVwZGF0ZTplbWFpbF9wcm92aWRlciBkZWxldGU6ZW1haWxfcHJvdmlkZXIgY3JlYXRlOmVtYWlsX3Byb3ZpZGVyIGJsYWNrbGlzdDp0b2tlbnMgcmVhZDpzdGF0cyByZWFkOmluc2lnaHRzIHJlYWQ6dGVuYW50X3NldHRpbmdzIHVwZGF0ZTp0ZW5hbnRfc2V0dGluZ3MgcmVhZDpsb2dzIHJlYWQ6bG9nc191c2VycyByZWFkOnNoaWVsZHMgY3JlYXRlOnNoaWVsZHMgdXBkYXRlOnNoaWVsZHMgZGVsZXRlOnNoaWVsZHMgcmVhZDphbm9tYWx5X2Jsb2NrcyBkZWxldGU6YW5vbWFseV9ibG9ja3MgdXBkYXRlOnRyaWdnZXJzIHJlYWQ6dHJpZ2dlcnMgcmVhZDpncmFudHMgZGVsZXRlOmdyYW50cyByZWFkOmd1YXJkaWFuX2ZhY3RvcnMgdXBkYXRlOmd1YXJkaWFuX2ZhY3RvcnMgcmVhZDpndWFyZGlhbl9lbnJvbGxtZW50cyBkZWxldGU6Z3VhcmRpYW5fZW5yb2xsbWVudHMgY3JlYXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRfdGlja2V0cyByZWFkOnVzZXJfaWRwX3Rva2VucyBjcmVhdGU6cGFzc3dvcmRzX2NoZWNraW5nX2pvYiBkZWxldGU6cGFzc3dvcmRzX2NoZWNraW5nX2pvYiByZWFkOmN1c3RvbV9kb21haW5zIGRlbGV0ZTpjdXN0b21fZG9tYWlucyBjcmVhdGU6Y3VzdG9tX2RvbWFpbnMgdXBkYXRlOmN1c3RvbV9kb21haW5zIHJlYWQ6ZW1haWxfdGVtcGxhdGVzIGNyZWF0ZTplbWFpbF90ZW1wbGF0ZXMgdXBkYXRlOmVtYWlsX3RlbXBsYXRlcyByZWFkOm1mYV9wb2xpY2llcyB1cGRhdGU6bWZhX3BvbGljaWVzIHJlYWQ6cm9sZXMgY3JlYXRlOnJvbGVzIGRlbGV0ZTpyb2xlcyB1cGRhdGU6cm9sZXMgcmVhZDpwcm9tcHRzIHVwZGF0ZTpwcm9tcHRzIHJlYWQ6YnJhbmRpbmcgdXBkYXRlOmJyYW5kaW5nIGRlbGV0ZTpicmFuZGluZyByZWFkOmxvZ19zdHJlYW1zIGNyZWF0ZTpsb2dfc3RyZWFtcyBkZWxldGU6bG9nX3N0cmVhbXMgdXBkYXRlOmxvZ19zdHJlYW1zIGNyZWF0ZTpzaWduaW5nX2tleXMgcmVhZDpzaWduaW5nX2tleXMgdXBkYXRlOnNpZ25pbmdfa2V5cyByZWFkOmxpbWl0cyB1cGRhdGU6bGltaXRzIGNyZWF0ZTpyb2xlX21lbWJlcnMgcmVhZDpyb2xlX21lbWJlcnMgZGVsZXRlOnJvbGVfbWVtYmVycyByZWFkOmVudGl0bGVtZW50cyByZWFkOmF0dGFja19wcm90ZWN0aW9uIHVwZGF0ZTphdHRhY2tfcHJvdGVjdGlvbiByZWFkOm9yZ2FuaXphdGlvbnMgdXBkYXRlOm9yZ2FuaXphdGlvbnMgY3JlYXRlOm9yZ2FuaXphdGlvbnMgZGVsZXRlOm9yZ2FuaXphdGlvbnMgY3JlYXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJzIHJlYWQ6b3JnYW5pemF0aW9uX21lbWJlcnMgZGVsZXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJzIGNyZWF0ZTpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgcmVhZDpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgdXBkYXRlOm9yZ2FuaXphdGlvbl9jb25uZWN0aW9ucyBkZWxldGU6b3JnYW5pemF0aW9uX2Nvbm5lY3Rpb25zIGNyZWF0ZTpvcmdhbml6YXRpb25fbWVtYmVyX3JvbGVzIHJlYWQ6b3JnYW5pemF0aW9uX21lbWJlcl9yb2xlcyBkZWxldGU6b3JnYW5pemF0aW9uX21lbWJlcl9yb2xlcyBjcmVhdGU6b3JnYW5pemF0aW9uX2ludml0YXRpb25zIHJlYWQ6b3JnYW5pemF0aW9uX2ludml0YXRpb25zIGRlbGV0ZTpvcmdhbml6YXRpb25faW52aXRhdGlvbnMiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.TxGHd3tOYnXPiiMpzfHXiZsHEG-a0W0FxbhxZVdVGyzoMNQx7fu1Zo8Lme3aoso8q_-uhNTvPRxMDR5BXZnkEAv9y6P3ai9PeO2xRX9skT58QlGEyfTMspif46XKfk_ACOg1MuArGJHCbyX2JWUva22B8OCVQtahfsxEco4ee3V8vR0VuL9dMkpOcGsdg9Xu7BJbO1KKiWxXDmOrm_ZnW58FUUzUiWknEWnHQE_uXlTGZBYZ4zrfWZRi6-t5FMy4bcRo05oVMDlWYPNlmllMz8pk_aJhtu1b_NSotLmE7uL1pd5E7pPi99mFUqm9UjTjABuso_0rw8Z5k6jX5ZDktg"
AUTH0_CLIENT_ID = "mKN433oSPMGyYTcrPnLLmERQeedyrDme"
AUTH0_DATABASE_CONNECTION = "UWFind"

database = Database(AUTH0_DOMAIN)
auth0 = Auth0(AUTH0_DOMAIN, AUTH0_MGMT_API_TOKEN)

####################################################################### User ###############################################################
class UserType(DjangoObjectType):
    class Meta:
        model = User

class UserInput(graphene.InputObjectType):
    firstName = graphene.String()
    lastName = graphene.String()
    email = graphene.String()
    phoneNumber = graphene.String()
    password = graphene.String()

class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        input = UserInput(required=True)

    def mutate(root, info, input):
        print(input)
        print(database.domain)
        try:
            user_data = database.signup(
                client_id=AUTH0_CLIENT_ID, 
                email=input.email, 
                password=input.password, 
                connection=AUTH0_DATABASE_CONNECTION
            )
            print(user_data)
            print(user_data.get("_id"))
            # auth0.jobs.send_verification_email({
            #     "user_id": "auth0|" + user_data["_id"] 
            # })
        except Auth0Error as e:
            print(e.args, e.error_code, e.status_code)
        userInstance = User(
            firstName=input.firstName,
            lastName=input.lastName,
            email=input.email,
            phoneNumber=input.phoneNumber
        )
        userInstance.save()
        return CreateUser(user=userInstance)

#################################################################### DropOffLocation ###############################################################
class DropOffLocationType(DjangoObjectType):
    class Meta:
        model = DropOffLocation

##################################################################### Category ###############################################################
class CategoryType(DjangoObjectType):
    class Meta:
        model = Category

#################################################################### Query and Mutation ############################################################
class Query(graphene.ObjectType):
    drop_off_locations = graphene.List(DropOffLocationType)
    categories = graphene.List(CategoryType)
    user_by_id = graphene.Field(UserType, userID=graphene.Int())

    def resolve_drop_off_locations(root, info):
        return DropOffLocation.objects.all()

    def resolve_categories(root, info):
        return Category.objects.all()
    
    def resolve_user_by_id(root, info, userID):
        return User.objects.get(userID=userID)

class Mutation(graphene.ObjectType):
    sign_up = CreateUser.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)