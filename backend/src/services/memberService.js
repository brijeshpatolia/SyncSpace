import { getUserById } from '../repositories/userRepository.js';
import workspaceRepository from '../repositories/workspaceRepository.js';
import { customErrorResponse } from '../utils/common/responseObjects.js';
import { StatusCodes } from 'http-status-codes';

export const isMemberPartOfWorkspace = async (workspaceId, memberId) => {
    try {
        const workspace = await workspaceRepository.getById(workspaceId);
        if (!workspace) {
            throw customErrorResponse({
                message: 'Workspace not found.',
                statusCode: StatusCodes.NOT_FOUND
            });
        }

        const isMember = workspace.members.some(
            (member) => member.memberId.toString() === memberId
        );
        if(!isMember) {
            throw customErrorResponse({
                message: 'User is not a member of this workspace.',
                statusCode: StatusCodes.UNAUTHORIZED
            });
        }
        const user = await getUserById(memberId);
        return user;
    } catch (error) {
        console.error(`[WorkspaceService] Error checking if member is part of workspace: ${error.message}`);
        throw customErrorResponse({
            message: error.message || 'Error checking workspace membership.',
            statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
        });
    }
};
