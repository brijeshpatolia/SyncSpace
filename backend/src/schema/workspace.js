import mongoose from "mongoose";

const workspaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Workspace name is required"],
        unique: true,
    },
    description: {
        type: String,

    },
    members: [{
        memberId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        role: {
            type: String,
            enum: ["Admin", "Member"],
            default: "Member",
        },

    }],
    joinCode: {
        type: String,
        required: [true, "Join code is required"],
        unique: true,
    },
    channels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
    }]
}, { timestamps: true });



const Workspace = mongoose.model("Workspace", workspaceSchema);

export default Workspace;