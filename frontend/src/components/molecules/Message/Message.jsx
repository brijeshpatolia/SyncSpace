import { PencilIcon, Trash2Icon, XIcon } from 'lucide-react';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/context/useAuth';

function formatTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const Message = ({ message, onEdit, onDelete }) => {
    const { auth } = useAuth();
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(message?.body ?? '');

    const sender = message?.senderId;
    const senderId =
        (typeof sender === 'object' ? sender?._id : sender) ?? '';
    const isMine = String(senderId) === String(auth?.user?._id);

    const senderName =
        (typeof sender === 'object' && (sender?.username || sender?.email)) ||
        'Unknown user';
    const avatarUrl = typeof sender === 'object' ? sender?.avatar : undefined;
    const initial = senderName.charAt(0).toUpperCase();

    async function handleSaveEdit(e) {
        e.preventDefault();
        const trimmed = draft.trim();
        if (!trimmed || trimmed === message?.body) {
            setEditing(false);
            return;
        }
        try {
            await onEdit?.(message._id, trimmed);
            setEditing(false);
        } catch (error) {
            console.log('Failed to edit message', error);
        }
    }

    return (
        <div className="group flex items-start gap-3 px-5 py-2 hover:bg-gray-50 transition-colors relative">
            <Avatar className="size-9 rounded-md">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="rounded-md bg-slack text-white text-sm">
                    {initial}
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-sm text-gray-900">
                        {senderName}
                    </span>
                    <span className="text-xs text-gray-400">
                        {formatTime(message?.createdAt)}
                        {message?.updatedAt &&
                            message?.updatedAt !== message?.createdAt && (
                                <span className="ml-1 italic">(edited)</span>
                            )}
                    </span>
                </div>

                {editing ? (
                    <form onSubmit={handleSaveEdit} className="mt-1 flex flex-col gap-2">
                        <textarea
                            autoFocus
                            rows={2}
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            className="w-full text-sm border rounded p-2 outline-none focus:border-gray-400 resize-none"
                        />
                        <div className="flex gap-2 justify-end">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setEditing(false);
                                    setDraft(message?.body ?? '');
                                }}
                            >
                                <XIcon className="size-3 mr-1" />
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                size="sm"
                                disabled={draft.trim().length === 0}
                            >
                                Save
                            </Button>
                        </div>
                    </form>
                ) : (
                    <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                        {message?.body}
                    </p>
                )}
            </div>

            {isMine && !editing && (
                <div className="absolute top-1 right-4 hidden group-hover:flex items-center gap-1 bg-white border border-gray-200 rounded-md shadow-sm p-1">
                    <button
                        type="button"
                        onClick={() => {
                            setDraft(message?.body ?? '');
                            setEditing(true);
                        }}
                        className="p-1 rounded hover:bg-gray-100 text-gray-600"
                        aria-label="Edit message"
                    >
                        <PencilIcon className="size-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => onDelete?.(message._id)}
                        className="p-1 rounded hover:bg-gray-100 text-red-600"
                        aria-label="Delete message"
                    >
                        <Trash2Icon className="size-4" />
                    </button>
                </div>
            )}
        </div>
    );
};
