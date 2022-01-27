import { observable, action } from "mobx";
import React from "react";

class Store {
  @observable userID = "";
  @observable authToken = {};

  @action updateUserID = (userID) => {
    this.userID = userID;
  };

  @action updateAuthToken = (authToken) => {
    this.authToken = authToken;
  };
}

const store = new Store();
export const StoreContext = React.createContext(store);
export const useStore = () => React.useContext(StoreContext);
