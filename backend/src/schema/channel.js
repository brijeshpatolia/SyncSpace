import mongoose  from "mongoose";

// Connect to MongoDB
const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true , "Channel name is required"]
    }
},
    { timestamps: true }
);

const Channel = mongoose.model("Channel", channelSchema);

export default Channel;
