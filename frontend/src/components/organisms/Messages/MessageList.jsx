import { Loader } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { Message } from '@/components/molecules/Message/Message';

export const MessageList = ({ messages = [], isLoading, onEdit, onDelete }) => {
    const bottomRef = useRef(null);

    // Backend returns newest-first; display oldest-first (chat order).
    const ordered = [...messages].reverse();

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader className="animate-spin size-6 text-gray-400" />
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto">
            {ordered.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-gray-400">
                    No messages yet. Say hello! 👋
                </div>
            ) : (
                <div className="flex flex-col py-4">
                    {ordered.map((message) => (
                        <Message
                            key={message._id}
                            message={message}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                    <div ref={bottomRef} />
                </div>
            )}
        </div>
    );
};
