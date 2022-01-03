/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const deleteCategory = /* GraphQL */ `
  mutation DeleteCategory($categoryID: Int!) {
    deleteCategory(categoryID: $categoryID) {
      categoryID
      name
    }
  }
`;
export const createCategory = /* GraphQL */ `
  mutation CreateCategory($createCategoryInput: CreateCategoryInput!) {
    createCategory(createCategoryInput: $createCategoryInput) {
      categoryID
      name
    }
  }
`;
export const updateCategory = /* GraphQL */ `
  mutation UpdateCategory($updateCategoryInput: UpdateCategoryInput!) {
    updateCategory(updateCategoryInput: $updateCategoryInput) {
      categoryID
      name
    }
  }
`;
export const deleteDropOffLocation = /* GraphQL */ `
  mutation DeleteDropOffLocation($locationID: Int!) {
    deleteDropOffLocation(locationID: $locationID) {
      locationID
      name
      address
    }
  }
`;
export const createDropOffLocation = /* GraphQL */ `
  mutation CreateDropOffLocation(
    $createDropOffLocationInput: CreateDropOffLocationInput!
  ) {
    createDropOffLocation(
      createDropOffLocationInput: $createDropOffLocationInput
    ) {
      locationID
      name
      address
    }
  }
`;
export const updateDropOffLocation = /* GraphQL */ `
  mutation UpdateDropOffLocation(
    $updateDropOffLocationInput: UpdateDropOffLocationInput!
  ) {
    updateDropOffLocation(
      updateDropOffLocationInput: $updateDropOffLocationInput
    ) {
      locationID
      name
      address
    }
  }
`;
export const deleteFoundItemPost = /* GraphQL */ `
  mutation DeleteFoundItemPost($postID: Int!) {
    deleteFoundItemPost(postID: $postID) {
      postID
      foundUserID
      claimedUserID
      imageID
      date
      dropOffLocationID
      foundLocation
      description
      categoryID
    }
  }
`;
export const createFoundItemPost = /* GraphQL */ `
  mutation CreateFoundItemPost(
    $createFoundItemPostInput: CreateFoundItemPostInput!
  ) {
    createFoundItemPost(createFoundItemPostInput: $createFoundItemPostInput) {
      postID
      foundUserID
      claimedUserID
      imageID
      date
      dropOffLocationID
      foundLocation
      description
      categoryID
    }
  }
`;
export const updateFoundItemPost = /* GraphQL */ `
  mutation UpdateFoundItemPost(
    $updateFoundItemPostInput: UpdateFoundItemPostInput!
  ) {
    updateFoundItemPost(updateFoundItemPostInput: $updateFoundItemPostInput) {
      postID
      foundUserID
      claimedUserID
      imageID
      date
      dropOffLocationID
      foundLocation
      description
      categoryID
    }
  }
`;
export const deleteImage = /* GraphQL */ `
  mutation DeleteImage($imageID: Int!) {
    deleteImage(imageID: $imageID) {
      imageID
      image
    }
  }
`;
export const createImage = /* GraphQL */ `
  mutation CreateImage($createImageInput: CreateImageInput!) {
    createImage(createImageInput: $createImageInput) {
      imageID
      image
    }
  }
`;
export const updateImage = /* GraphQL */ `
  mutation UpdateImage($updateImageInput: UpdateImageInput!) {
    updateImage(updateImageInput: $updateImageInput) {
      imageID
      image
    }
  }
`;
export const deleteLostItemPost = /* GraphQL */ `
  mutation DeleteLostItemPost($postID: Int!) {
    deleteLostItemPost(postID: $postID) {
      postID
      lostUserID
      imageID
      date
      lostLocation
      description
      categoryID
    }
  }
`;
export const createLostItemPost = /* GraphQL */ `
  mutation CreateLostItemPost(
    $createLostItemPostInput: CreateLostItemPostInput!
  ) {
    createLostItemPost(createLostItemPostInput: $createLostItemPostInput) {
      postID
      lostUserID
      imageID
      date
      lostLocation
      description
      categoryID
    }
  }
`;
export const updateLostItemPost = /* GraphQL */ `
  mutation UpdateLostItemPost(
    $updateLostItemPostInput: UpdateLostItemPostInput!
  ) {
    updateLostItemPost(updateLostItemPostInput: $updateLostItemPostInput) {
      postID
      lostUserID
      imageID
      date
      lostLocation
      description
      categoryID
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser($userID: Int!) {
    deleteUser(userID: $userID) {
      userID
      firstName
      lastName
      email
      phoneNumber
    }
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      userID
      firstName
      lastName
      email
      phoneNumber
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser($updateUserInput: UpdateUserInput!) {
    updateUser(updateUserInput: $updateUserInput) {
      userID
      firstName
      lastName
      email
      phoneNumber
    }
  }
`;
