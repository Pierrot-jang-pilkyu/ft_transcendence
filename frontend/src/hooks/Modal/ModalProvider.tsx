import React from "react";
import { useState } from "react";

export const ModalStateContext = React.createContext();
export const ModalSetterContext = React.createContext();

function ModalProvider({ children }) {
  const [state, setState] = useState({
    type: null,
    props: null,
  });

  return (
    <ModalSetterContext.Provider value={setState}>
      <ModalStateContext.Provider value={state}>
        {children}
      </ModalStateContext.Provider>
    </ModalSetterContext.Provider>
  );
}
