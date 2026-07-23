import { createContext, useState } from 'react';

const InviteMemberModalContext = createContext();

export const InviteMemberModalProvider = ({ children }) => {
    const [openInviteMemberModal, setOpenInviteMemberModal] = useState(false);

    return (
        <InviteMemberModalContext.Provider
            value={{ openInviteMemberModal, setOpenInviteMemberModal }}
        >
            {children}
        </InviteMemberModalContext.Provider>
    );
};

export default InviteMemberModalContext;
