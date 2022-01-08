import graphene
from graphene.types import mutation
from graphene_django.types import DjangoObjectType
from .models import User, DropOffLocation, Category

####################################################################### User ###############################################################
class UserType(DjangoObjectType):
    class Meta:
        model = User

class UserInput(graphene.InputObjectType):
    firstName = graphene.String()
    lastName = graphene.String()
    email = graphene.String()
    phoneNumber = graphene.String()

class CreateUser(graphene.Mutation):
    user = graphene.Field(UserType)

    class Arguments:
        input = UserInput(required=True)

    def mutate(root, info, input):
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
    create_user = CreateUser.Field()

schema = graphene.Schema(query=Query, mutation=Mutation)