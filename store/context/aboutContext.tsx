import { ReactNode, createContext, useState } from "react";

type aboutContextType = {
  visible: boolean,
  visibleToggle: () => void,
  hideToggle: () => void
}

export const AboutContext = createContext<aboutContextType>({} as aboutContextType);

type Props = {
  children: ReactNode
}

const AboutContextProvider = ({ children }: Props) => {
  const [visible, setVisible] = useState(false);

  const visibleToggle = () => {
    setVisible(true);
  }

  const hideToggle = () => {
    setVisible(false);
  }

  const value = {
    visible: visible,
    visibleToggle: visibleToggle,
    hideToggle: hideToggle
  }

  return (
    <AboutContext.Provider value={value}>
      {children}
    </AboutContext.Provider>
  );
}

export default AboutContextProvider;