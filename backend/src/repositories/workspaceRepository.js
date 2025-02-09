import Workspace from "../schema/workspace.js";
import crudRepository from "./crudRepository.js";
import { StatusCodes } from "http-status-codes";
import { customErrorResponse, internalErrorResponse } from "../utils/common/responseObjects.js";

const workspaceRepository = {
    ...crudRepository(Workspace),

    async getWorkspaceByName(name) {
        try {
            const workspace = await Workspace.findOne({ name });
            if (!workspace) {
                throw customErrorResponse({ 
                    message: "Workspace not found", 
                    statusCode: StatusCodes.NOT_FOUND 
                });
            }
            return workspace;
        } catch (error) {
            console.error(`[WorkspaceRepository] Error fetching workspace by name: ${error.message}`);
            throw internalErrorResponse(error);
        }
    },

    async getWorkspaceByJoinCode(code) {
        try {
            const workspace = await Workspace.findOne({ joinCode: code });
            if (!workspace) {
                throw customErrorResponse({ 
                    message: "Workspace not found", 
                    statusCode: StatusCodes.NOT_FOUND 
                });
            }
            return workspace;
        } catch (error) {
            console.error(`[WorkspaceRepository] Error fetching workspace by join code: ${error.message}`);
            throw internalErrorResponse(error);
        }
    },

    async addMemberToWorkspace(memberId, workspaceId) {
        try {
            const workspace = await Workspace.findById(workspaceId);
            if (!workspace) {
                throw customErrorResponse({ 
                    message: "Workspace not found", 
                    statusCode: StatusCodes.NOT_FOUND 
                });
            }

            const isMemberAlreadyAdded = workspace.members.some(member =>
                member.memberId.toString() === memberId
            ); 

            if (isMemberAlreadyAdded) {
                throw customErrorResponse({ 
                    message: "User is already a member of this workspace", 
                    statusCode: StatusCodes.BAD_REQUEST 
                });
            }

            workspace.members.push({ memberId, role: "Member" });
            await workspace.save();
            return workspace;
        } catch (error) {
            console.error(`[WorkspaceRepository] Error adding member: ${error.message}`);
            throw internalErrorResponse(error);
        }
    },

    async addChannelToWorkspace(workspaceId, channelId) {
        try {
            const workspace = await Workspace.findById(workspaceId);
            if (!workspace) {
                throw customErrorResponse({ 
                    message: "Workspace not found", 
                    statusCode: StatusCodes.NOT_FOUND 
                });
            }

            if (workspace.channels.includes(channelId)) {
                throw customErrorResponse({ 
                    message: "Channel is already in the workspace", 
                    statusCode: StatusCodes.BAD_REQUEST 
                });
            }

            workspace.channels.push(channelId);
            await workspace.save();
            return workspace;
        } catch (error) {
            console.error(`[WorkspaceRepository] Error adding channel: ${error.message}`);
            throw internalErrorResponse(error);
        }
    },

    async fetchAllWorkspaceByMemberId(memberId) {
        try {
            const workspaces = await Workspace.find({ "members.memberId": memberId }).populate("members.memberId","username email avatar");

            if (!workspaces || workspaces.length === 0) {
                throw customErrorResponse({ 
                    message: "No workspaces found for this member", 
                    statusCode: StatusCodes.NOT_FOUND 
                });
            }

            return workspaces;
        } catch (error) {
            console.error(`[WorkspaceRepository] Error fetching workspaces: ${error.message}`);
            throw internalErrorResponse(error);
        }
    },
};

export default workspaceRepository;
