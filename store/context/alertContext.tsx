import { ReactNode, createContext, useEffect, useState } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';

type AlertContentType = {
  color: 'red' | 'green' | 'blue' | 'yellow',
  message: string,
  icon?: keyof typeof Ionicons.glyphMap,
}

type AlertContextType = {
  isVisible: boolean
  alertContent: AlertContentType
  setAlert: (content: AlertContentType) => void
  hideAlert: () => void
}

export const AlertContext = createContext<AlertContextType>({} as AlertContextType);

type Props = {
  children: ReactNode
}

const AlertContextProvider: React.FC<Props> = ({ children }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertContent, setAlertContent] = useState<AlertContentType>({} as AlertContentType);

  const setAlert = (content: AlertContentType) => {
    setAlertContent(content);
    setShowAlert(true);
  }

  const hideAlert = () => {
    setShowAlert(false);
  }

  const value = {
    isVisible: showAlert,
    alertContent: alertContent,
    setAlert: setAlert,
    hideAlert: hideAlert
  }

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  )
}

export default AlertContextProvider;