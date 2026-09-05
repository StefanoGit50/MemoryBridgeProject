import { createContext, useContext, ReactNode } from 'react';

interface CommentsContextType {
    onAddReply: (parentId: string, text: string) => void;
}

const CommentsContext = createContext<CommentsContextType | undefined>(undefined);

export function CommentsProvider({
                                     children,
                                     onAddReply,
                                 }: {
    children: ReactNode;
    onAddReply: (parentId: string, text: string) => void;
}) {
    return (
        <CommentsContext.Provider value={{ onAddReply }}>
            {children}
        </CommentsContext.Provider>
    );
}

// Hook personalizzato per consumare il contesto in sicurezza
export function useCommentsContext() {
    const context = useContext(CommentsContext);
    if (!context) {
        throw new Error('useCommentsContext deve essere usato dentro un <CommentsProvider>');
    }
    return context;
}