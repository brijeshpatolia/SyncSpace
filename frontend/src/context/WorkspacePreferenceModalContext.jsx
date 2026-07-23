import { createContext, useState } from 'react';


const workspacePreferenceModalContext = createContext();



export const WorkspacePreferenceModalProvider =  ({children}) => {
    const [openPreferences , setOpenPreferences] = useState(false);
    const [initialValue , setInitialValue] = useState('Edit Workspace Preferences');
  return (
    <workspacePreferenceModalContext.Provider value={{ openPreferences, setOpenPreferences, initialValue, setInitialValue }}>
      {children}
    </workspacePreferenceModalContext.Provider>
  );
};


export default workspacePreferenceModalContext;