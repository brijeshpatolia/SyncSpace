import { SendHorizonalIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

export const ChatInput = ({ onSubmit, disabled, placeholder }) => {
    const [body, setBody] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        const trimmed = body.trim();
        if (!trimmed || disabled) return;
        setBody('');
        try {
            await onSubmit(trimmed);
        } catch (error) {
            // Restore the text so the user doesn't lose it on failure.
            console.log('Failed to send message', error);
            setBody(trimmed);
        }
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="px-4 pb-4">
            <div className="flex items-end gap-2 border border-gray-300 rounded-lg p-2 focus-within:border-gray-400 transition-colors bg-white">
                <textarea
                    rows={1}
                    value={body}
                    disabled={disabled}
                    onChange={(e) => setBody(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder || 'Type a message'}
                    className="flex-1 resize-none outline-none text-sm text-gray-800 placeholder:text-gray-400 max-h-40 bg-transparent"
                />
                <Button
                    type="submit"
                    size="icon"
                    disabled={disabled || body.trim().length === 0}
                    className="shrink-0"
                >
                    <SendHorizonalIcon className="size-4" />
                </Button>
            </div>
        </form>
    );
};
