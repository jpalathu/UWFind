/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getCategory = /* GraphQL */ `
  query GetCategory($categoryID: Int!) {
    getCategory(categoryID: $categoryID) {
      categoryID
      name
    }
  }
`;
export const listCategorys = /* GraphQL */ `
  query ListCategorys {
    listCategorys {
      categoryID
      name
    }
  }
`;
export const getDropOffLocation = /* GraphQL */ `
  query GetDropOffLocation($locationID: Int!) {
    getDropOffLocation(locationID: $locationID) {
      locationID
      name
      address
    }
  }
`;
export const listDropOffLocations = /* GraphQL */ `
  query ListDropOffLocations {
    listDropOffLocations {
      locationID
      name
      address
    }
  }
`;
export const getFoundItemPost = /* GraphQL */ `
  query GetFoundItemPost($postID: Int!) {
    getFoundItemPost(postID: $postID) {
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
export const listFoundItemPosts = /* GraphQL */ `
  query ListFoundItemPosts {
    listFoundItemPosts {
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
export const getImage = /* GraphQL */ `
  query GetImage($imageID: Int!) {
    getImage(imageID: $imageID) {
      imageID
      image
    }
  }
`;
export const listImages = /* GraphQL */ `
  query ListImages {
    listImages {
      imageID
      image
    }
  }
`;
export const getLostItemPost = /* GraphQL */ `
  query GetLostItemPost($postID: Int!) {
    getLostItemPost(postID: $postID) {
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
export const listLostItemPosts = /* GraphQL */ `
  query ListLostItemPosts {
    listLostItemPosts {
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
export const getUser = /* GraphQL */ `
  query GetUser($userID: Int!) {
    getUser(userID: $userID) {
      userID
      firstName
      lastName
      email
      phoneNumber
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers {
    listUsers {
      userID
      firstName
      lastName
      email
      phoneNumber
    }
  }
`;
