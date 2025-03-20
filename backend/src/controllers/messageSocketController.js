
import { JOIN_CHANNEL_EVENT } from "../utils/common/eventConstants.js";


export default function messageHandler(io , socket) {

    socket.on(JOIN_CHANNEL_EVENT , async function joinChannelHandler(data ,cb){
        const roomid  = data.channelId;
        socket.join(roomid);
        cb({
            success : true,
            message : `Joined Channel ${roomid}`,
            data  : roomid
        })

    });
}