import { createContext, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";

const initialUser = {
  id: null,
  email: null,
  name: null,
  role: null,
  agentCityId: null,
};

export const AuthContext = createContext({
  hasUser: false,
  setHasUser: () => {},
  isDropdownOpen: false,
  setIsDropdownOpen: () => {},
  user: initialUser,
  setUser: () => {},
});

export const Stack = createStackNavigator();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(initialUser);
  const [hasUser, setHasUser] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
