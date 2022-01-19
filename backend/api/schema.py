import graphene
from graphene.types import mutation
from graphene_django.types import DjangoObjectType
from .models import Building, Program, Term, User, DropOffLocation, Category
from django.core.exceptions import BadRequest
from auth0.v3.authentication import Database, GetToken
from auth0.v3.exceptions import Auth0Error
from auth0.v3.management import Auth0

AUTH0_DOMAIN = "dev-n2mrf68i.us.auth0.com"
AUTH0_MGMT_API_AUDIENCE = "https://dev-n2mrf68i.us.auth0.com/api/v2/"
AUTH0_MGMT_API_TOKEN = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ind4YjJKakljV21oN3J5M1hzR2lvdiJ9.eyJpc3MiOiJodHRwczovL2Rldi1uMm1yZjY4aS51cy5hdXRoMC5jb20vIiwic3ViIjoic2Y2U3E3T1k4Qk8xamVnMHdiam1ZZ1BUZzg4NHJRcm1AY2xpZW50cyIsImF1ZCI6Imh0dHBzOi8vZGV2LW4ybXJmNjhpLnVzLmF1dGgwLmNvbS9hcGkvdjIvIiwiaWF0IjoxNjQxOTU1ODY0LCJleHAiOjE2NDIwNDIyNjQsImF6cCI6InNmNlNxN09ZOEJPMWplZzB3YmptWWdQVGc4ODRyUXJtIiwic2NvcGUiOiJyZWFkOmNsaWVudF9ncmFudHMgY3JlYXRlOmNsaWVudF9ncmFudHMgZGVsZXRlOmNsaWVudF9ncmFudHMgdXBkYXRlOmNsaWVudF9ncmFudHMgcmVhZDp1c2VycyB1cGRhdGU6dXNlcnMgZGVsZXRlOnVzZXJzIGNyZWF0ZTp1c2VycyByZWFkOnVzZXJzX2FwcF9tZXRhZGF0YSB1cGRhdGU6dXNlcnNfYXBwX21ldGFkYXRhIGRlbGV0ZTp1c2Vyc19hcHBfbWV0YWRhdGEgY3JlYXRlOnVzZXJzX2FwcF9tZXRhZGF0YSByZWFkOnVzZXJfY3VzdG9tX2Jsb2NrcyBjcmVhdGU6dXNlcl9jdXN0b21fYmxvY2tzIGRlbGV0ZTp1c2VyX2N1c3RvbV9ibG9ja3MgY3JlYXRlOnVzZXJfdGlja2V0cyByZWFkOmNsaWVudHMgdXBkYXRlOmNsaWVudHMgZGVsZXRlOmNsaWVudHMgY3JlYXRlOmNsaWVudHMgcmVhZDpjbGllbnRfa2V5cyB1cGRhdGU6Y2xpZW50X2tleXMgZGVsZXRlOmNsaWVudF9rZXlzIGNyZWF0ZTpjbGllbnRfa2V5cyByZWFkOmNvbm5lY3Rpb25zIHVwZGF0ZTpjb25uZWN0aW9ucyBkZWxldGU6Y29ubmVjdGlvbnMgY3JlYXRlOmNvbm5lY3Rpb25zIHJlYWQ6cmVzb3VyY2Vfc2VydmVycyB1cGRhdGU6cmVzb3VyY2Vfc2VydmVycyBkZWxldGU6cmVzb3VyY2Vfc2VydmVycyBjcmVhdGU6cmVzb3VyY2Vfc2VydmVycyByZWFkOmRldmljZV9jcmVkZW50aWFscyB1cGRhdGU6ZGV2aWNlX2NyZWRlbnRpYWxzIGRlbGV0ZTpkZXZpY2VfY3JlZGVudGlhbHMgY3JlYXRlOmRldmljZV9jcmVkZW50aWFscyByZWFkOnJ1bGVzIHVwZGF0ZTpydWxlcyBkZWxldGU6cnVsZXMgY3JlYXRlOnJ1bGVzIHJlYWQ6cnVsZXNfY29uZmlncyB1cGRhdGU6cnVsZXNfY29uZmlncyBkZWxldGU6cnVsZXNfY29uZmlncyByZWFkOmhvb2tzIHVwZGF0ZTpob29rcyBkZWxldGU6aG9va3MgY3JlYXRlOmhvb2tzIHJlYWQ6YWN0aW9ucyB1cGRhdGU6YWN0aW9ucyBkZWxldGU6YWN0aW9ucyBjcmVhdGU6YWN0aW9ucyByZWFkOmVtYWlsX3Byb3ZpZGVyIHVwZGF0ZTplbWFpbF9wcm92aWRlciBkZWxldGU6ZW1haWxfcHJvdmlkZXIgY3JlYXRlOmVtYWlsX3Byb3ZpZGVyIGJsYWNrbGlzdDp0b2tlbnMgcmVhZDpzdGF0cyByZWFkOmluc2lnaHRzIHJlYWQ6dGVuYW50X3NldHRpbmdzIHVwZGF0ZTp0ZW5hbnRfc2V0dGluZ3MgcmVhZDpsb2dzIHJlYWQ6bG9nc191c2VycyByZWFkOnNoaWVsZHMgY3JlYXRlOnNoaWVsZHMgdXBkYXRlOnNoaWVsZHMgZGVsZXRlOnNoaWVsZHMgcmVhZDphbm9tYWx5X2Jsb2NrcyBkZWxldGU6YW5vbWFseV9ibG9ja3MgdXBkYXRlOnRyaWdnZXJzIHJlYWQ6dHJpZ2dlcnMgcmVhZDpncmFudHMgZGVsZXRlOmdyYW50cyByZWFkOmd1YXJkaWFuX2ZhY3RvcnMgdXBkYXRlOmd1YXJkaWFuX2ZhY3RvcnMgcmVhZDpndWFyZGlhbl9lbnJvbGxtZW50cyBkZWxldGU6Z3VhcmRpYW5fZW5yb2xsbWVudHMgY3JlYXRlOmd1YXJkaWFuX2Vucm9sbG1lbnRfdGlja2V0cyByZWFkOnVzZXJfaWRwX3Rva2VucyBjcmVhdGU6cGFzc3dvcmRzX2NoZWNraW5nX2pvYiBkZWxldGU6cGFzc3dvcmRzX2NoZWNraW5nX2pvYiByZWFkOmN1c3RvbV9kb21haW5zIGRlbGV0ZTpjdXN0b21fZG9tYWlucyBjcmVhdGU6Y3VzdG9tX2RvbWFpbnMgdXBkYXRlOmN1c3RvbV9kb21haW5zIHJlYWQ6ZW1haWxfdGVtcGxhdGVzIGNyZWF0ZTplbWFpbF90ZW1wbGF0ZXMgdXBkYXRlOmVtYWlsX3RlbXBsYXRlcyByZWFkOm1mYV9wb2xpY2llcyB1cGRhdGU6bWZhX3BvbGljaWVzIHJlYWQ6cm9sZXMgY3JlYXRlOnJvbGVzIGRlbGV0ZTpyb2xlcyB1cGRhdGU6cm9sZXMgcmVhZDpwcm9tcHRzIHVwZGF0ZTpwcm9tcHRzIHJlYWQ6YnJhbmRpbmcgdXBkYXRlOmJyYW5kaW5nIGRlbGV0ZTpicmFuZGluZyByZWFkOmxvZ19zdHJlYW1zIGNyZWF0ZTpsb2dfc3RyZWFtcyBkZWxldGU6bG9nX3N0cmVhbXMgdXBkYXRlOmxvZ19zdHJlYW1zIGNyZWF0ZTpzaWduaW5nX2tleXMgcmVhZDpzaWduaW5nX2tleXMgdXBkYXRlOnNpZ25pbmdfa2V5cyByZWFkOmxpbWl0cyB1cGRhdGU6bGltaXRzIGNyZWF0ZTpyb2xlX21lbWJlcnMgcmVhZDpyb2xlX21lbWJlcnMgZGVsZXRlOnJvbGVfbWVtYmVycyByZWFkOmVudGl0bGVtZW50cyByZWFkOmF0dGFja19wcm90ZWN0aW9uIHVwZGF0ZTphdHRhY2tfcHJvdGVjdGlvbiByZWFkOm9yZ2FuaXphdGlvbnMgdXBkYXRlOm9yZ2FuaXphdGlvbnMgY3JlYXRlOm9yZ2FuaXphdGlvbnMgZGVsZXRlOm9yZ2FuaXphdGlvbnMgY3JlYXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJzIHJlYWQ6b3JnYW5pemF0aW9uX21lbWJlcnMgZGVsZXRlOm9yZ2FuaXphdGlvbl9tZW1iZXJzIGNyZWF0ZTpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgcmVhZDpvcmdhbml6YXRpb25fY29ubmVjdGlvbnMgdXBkYXRlOm9yZ2FuaXphdGlvbl9jb25uZWN0aW9ucyBkZWxldGU6b3JnYW5pemF0aW9uX2Nvbm5lY3Rpb25zIGNyZWF0ZTpvcmdhbml6YXRpb25fbWVtYmVyX3JvbGVzIHJlYWQ6b3JnYW5pemF0aW9uX21lbWJlcl9yb2xlcyBkZWxldGU6b3JnYW5pemF0aW9uX21lbWJlcl9yb2xlcyBjcmVhdGU6b3JnYW5pemF0aW9uX2ludml0YXRpb25zIHJlYWQ6b3JnYW5pemF0aW9uX2ludml0YXRpb25zIGRlbGV0ZTpvcmdhbml6YXRpb25faW52aXRhdGlvbnMiLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMifQ.TxGHd3tOYnXPiiMpzfHXiZsHEG-a0W0FxbhxZVdVGyzoMNQx7fu1Zo8Lme3aoso8q_-uhNTvPRxMDR5BXZnkEAv9y6P3ai9PeO2xRX9skT58QlGEyfTMspif46XKfk_ACOg1MuArGJHCbyX2JWUva22B8OCVQtahfsxEco4ee3V8vR0VuL9dMkpOcGsdg9Xu7BJbO1KKiWxXDmOrm_ZnW58FUUzUiWknEWnHQE_uXlTGZBYZ4zrfWZRi6-t5FMy4bcRo05oVMDlWYPNlmllMz8pk_aJhtu1b_NSotLmE7uL1pd5E7pPi99mFUqm9UjTjABuso_0rw8Z5k6jX5ZDktg"
AUTH0_CLIENT_ID = "mKN433oSPMGyYTcrPnLLmERQeedyrDme"
AUTH0_CLIENT_SECRET = "05ofvPW8hOw8X1B6tC9WEhQXd54KJwyInieplX0n_lyv9vKrzitNihAgG2PTTnQ2"
AUTH0_DATABASE_CONNECTION = "UWFind"

auth0_database_instance = Database(AUTH0_DOMAIN)
auth0_token_instance = GetToken(AUTH0_DOMAIN)
# auth0_instance = Auth0(AUTH0_DOMAIN, AUTH0_MGMT_API_TOKEN)

####################################################################### User ###############################################################
class UserType(DjangoObjectType):
    class Meta:
        model = User

class UserInput(graphene.InputObjectType):
    first_name = graphene.String()
    last_name = graphene.String()
    term = graphene.String()
    program = graphene.String()
    email = graphene.String()
    password = graphene.String()

#################################################################### Authentication #############################################################
class SignUp(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        input = UserInput(required=True)

    def mutate(root, info, input):
        print(input)
        print(auth0_database_instance.domain)
        try:
            # make sure the user doesn't exist in our database (and ideally in auth0 too)
            internal_user = User.objects.filter(email=input.email).first()
            if internal_user:
                raise BadRequest("User already exists")
            auth0_user = auth0_database_instance.signup(client_id=AUTH0_CLIENT_ID, email=input.email, password=input.password, connection=AUTH0_DATABASE_CONNECTION)
            user_instance = User(first_name=input.first_name, last_name=input.last_name, term=input.term, program=input.program, email=input.email, auth0_id="auth0|" + auth0_user["_id"])
            user_instance.save()
            return SignUp(user=user_instance)
        except Auth0Error as error:
            raise BadRequest(error.message)

class Login(graphene.ObjectType):
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

##################################################################### Term ###############################################################
class TermType(DjangoObjectType):
    class Meta:
        model = Term

##################################################################### Program ###############################################################
class ProgramType(DjangoObjectType):
    class Meta:
        model = Program

#################################################################### Query and Mutation ############################################################
class Query(graphene.ObjectType):
    drop_off_locations = graphene.List(DropOffLocationType)
    categories = graphene.List(CategoryType)
    terms = graphene.List(TermType)
    programs = graphene.List(ProgramType)
    buildings = graphene.List(BuildingType)
    user_by_id = graphene.Field(UserType, user_id=graphene.Int())
    login = graphene.Field(Login, email=graphene.String(), password=graphene.String())

    def resolve_drop_off_locations(root, info):
        return DropOffLocation.objects.all()

    def resolve_categories(root, info):
        return Category.objects.all()

    def resolve_terms(root, info):
        return Term.objects.all()

    def resolve_programs(root, info):
        return Program.objects.all()

    def resolve_buildings(root, info):
        return Building.objects.all()
    
    def resolve_user_by_id(root, info, user_id):
        return User.objects.get(user_id=user_id)
    
    def resolve_login(root, info, email, password):
        try:
            # check if user exists in database
            internal_user = User.objects.filter(email=email).first()
            if not internal_user:
                # TODO: change this into a 404
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
            # TODO: check the users email verification status and return a message if not verified with custom error code
            return Login(token=result)
        except Auth0Error as error:
            print("error")
            # TODO: handle invalid password
            raise BadRequest(error.message)

class Mutation(graphene.ObjectType):
    sign_up = SignUp.Field()
    reset_password = ResetPassword.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)