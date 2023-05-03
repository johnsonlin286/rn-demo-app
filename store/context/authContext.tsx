import { ReactNode, createContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type userType = {
  id: string,
  name: string,
  email: string,
}

type AuthContext = {
  token: string | null,
  user: userType | null,
  isAuth: boolean,
  authenticate: (token: string, id: string, name: string, email: string) => void
  signout: () => void
}

export const AuthContext = createContext<AuthContext>({} as AuthContext);

type Props = {
  children: ReactNode
}

const AuthContextProvider: React.FC<Props> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [user, setUser] = useState<userType | null>(null);

  const authenticate = (token: string, id: string, name: string, email: string) => {
    setAuthToken(token);
    setUser({
      id, name, email
    });
    const storage = {
      token: token,
      id: id,
      name: name,
      email: email,
      created_at: new Date()
    }
    AsyncStorage.setItem('user', JSON.stringify(storage))
  }

  const signout = () => {
    setAuthToken(null);
    setUser(null);
    AsyncStorage.removeItem('user');
  }

  const value = {
    token: authToken,
    user: user,
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