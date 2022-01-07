import graphene
from graphene_django.types import DjangoObjectType
from .models import DropOffLocation, Category

class DropOffLocationType(DjangoObjectType):
    class Meta:
        model = DropOffLocation

class CategoryType(DjangoObjectType):
    class Meta:
        model = Category

# class CategoryInput(graphene.InputObjectType):
#     name = graphene.String()

# class CreateCategory(graphene.Mutation):
#     category = graphene.Field(Category)

#     class Arguments:
#         input = CategoryInput(required=True)
    
#     def mutate(self, info, input):
#         category = Category(input)
        # return CreateCategory(category)

class Query(graphene.ObjectType):
    drop_off_locations = graphene.List(DropOffLocationType)
    categories = graphene.List(CategoryType)

    def resolve_drop_off_locations(root, info):
        return DropOffLocation.objects.all()

    def resolve_categories(root, info):
        return Category.objects.all()

# class Mutation(graphene.ObjectType):
#     create_category = CreateCategory.Field()

schema = graphene.Schema(query=Query)