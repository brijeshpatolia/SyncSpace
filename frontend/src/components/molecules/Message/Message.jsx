import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function formatTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export const Message = ({ message }) => {
    const sender = message?.senderId;
    const senderName =
        (typeof sender === 'object' && (sender?.username || sender?.email)) ||
        'Unknown user';
    const avatarUrl = typeof sender === 'object' ? sender?.avatar : undefined;
    const initial = senderName.charAt(0).toUpperCase();

    return (
        <div className="flex items-start gap-3 px-5 py-2 hover:bg-gray-50 transition-colors">
            <Avatar className="size-9 rounded-md">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="rounded-md bg-slack text-white text-sm">
                    {initial}
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
                <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-sm text-gray-900">
                        {senderName}
                    </span>
                    <span className="text-xs text-gray-400">
                        {formatTime(message?.createdAt)}
                    </span>
                </div>
                <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                    {message?.body}
                </p>
            </div>
        </div>
    );
};
