import { ReactNode, createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContext = {
  token: string | null,
  name: string | null,
  isAuth: boolean,
  authenticate: (token: string, name: string) => void
  signout: () => void
}

export const AuthContext = createContext<AuthContext>({} as AuthContext);

type Props = {
  children: ReactNode
}

const AuthContextProvider: React.FC<Props> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  const authenticate = (token: string, name: string) => {
    setAuthToken(token);
    setUserName(name);
    const storage = {
      token: token,
      name: name,
      created_at: new Date()
    }
    AsyncStorage.setItem('user', JSON.stringify(storage))
  }

  const signout = () => {
    setAuthToken(null);
    setUserName(null);
    AsyncStorage.removeItem('user');
  }

  const value = {
    token: authToken,
    name: userName,
    isAuth: !!authToken,
    authenticate: authenticate,
    signout: signout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider;