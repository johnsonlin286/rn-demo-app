import { ReactNode, createContext, useState } from "react";

type AuthContext = {
  token: string | null,
  isAuth: boolean,
  authenticate: (token: string) => void
  signout: () => void
}

export const AuthContext = createContext<AuthContext>({} as AuthContext);

type Props = {
  children: ReactNode
}

const AuthContextProvider: React.FC<Props> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);

  const authenticate = (token: string) => {
    setAuthToken(token);
  }

  const signout = () => {
    setAuthToken(null)
  }

  const value = {
    token: authToken,
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