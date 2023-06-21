import { createContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";


export const AuthContext = createContext({
  hasUser: false,
  setHasUser: () => { },
  isDropdownOpen: false,
  setIsDropdownOpen: () => { },
  user: {
    id: null,
    email: null,
    name: null,
    role: null,
    agentCityId: null,
  },
  setUser: () => { },
});

export const Stack = createStackNavigator();
