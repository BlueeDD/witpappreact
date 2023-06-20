import { createContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";


export const AuthContext = createContext({
  hasUser: false,
  setUser: () => {},
  isDropdownOpen: false,
  setIsDropdownOpen: () => {},
});

export const Stack = createStackNavigator();
