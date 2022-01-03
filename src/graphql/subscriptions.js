/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateCategory = /* GraphQL */ `
  subscription OnCreateCategory {
    onCreateCategory {
      categoryID
      name
    }
  }
`;
export const onCreateDropOffLocation = /* GraphQL */ `
  subscription OnCreateDropOffLocation {
    onCreateDropOffLocation {
      locationID
      name
      address
    }
  }
`;
export const onCreateFoundItemPost = /* GraphQL */ `
  subscription OnCreateFoundItemPost {
    onCreateFoundItemPost {
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
export const onCreateImage = /* GraphQL */ `
  subscription OnCreateImage {
    onCreateImage {
      imageID
      image
    }
  }
`;
export const onCreateLostItemPost = /* GraphQL */ `
  subscription OnCreateLostItemPost {
    onCreateLostItemPost {
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
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
      userID
      firstName
      lastName
      email
      phoneNumber
    }
  }
`;
