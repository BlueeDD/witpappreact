import { createContext, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";

const initialUser = {
  id: null,
  email: null,
  name: null,
  role: null,
  agentCityId: null,
};

const initialCity =  "South Tours";

export const AuthContext = createContext({
  hasUser: false,
  setHasUser: () => { },
  isDropdownOpen: false,
  setIsDropdownOpen: () => { },
  user: initialUser,
  setUser: () => { },
  isConnected: true,
  setIsConnected: () => { },
  isLocationEnabled: false,
  setIsLocationEnabled: () => { },
  hasPubcrawl: false,
  setHasPubcrawl: () => { },
  cityName: initialCity,
  setCityName: () => { },
  isVisible: false,
  setIsVisible: () => { },
});

export const Stack = createStackNavigator();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(initialUser);
  const [hasUser, setHasUser] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [isLocationEnabled, setIsLocationEnabled] = useState(false);
  const [hasPubcrawl, setHasPubcrawl] = useState(false);
  const [cityName, setCityName] = useState(initialCity);
  const [isVisible, setIsVisible] = useState(false);

  const handleSetUser = (userData) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider
      value={{
        hasUser,
        setHasUser,
        isDropdownOpen,
        setIsDropdownOpen,
        user,
        setUser: handleSetUser,
        isConnected,
        setIsConnected,
        isLocationEnabled,
        setIsLocationEnabled,
        hasPubcrawl,
        setHasPubcrawl,
        cityName,
        setCityName,
        isVisible,
        setIsVisible
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
