
import { isMemberPartOfWorkspace } from '../services/memberService.js';
import { customErrorResponse, successResponse } from '../utils/common/responseObjects.js';
import { StatusCodes } from 'http-status-codes';

export const isMemberPartOfWorkspaceController = async (req, res) => {
    try {
        const { workspaceId } = req.params;
        const memberId = req.user.id; // Extracting userId from authenticated token

        console.log(`[DEBUG] Checking if user ${memberId} is a member of workspace ${workspaceId}`);

        if (!workspaceId) {
            console.error("[ERROR] Missing workspace ID");
            return res.status(StatusCodes.BAD_REQUEST).json(customErrorResponse({
                message: "Workspace ID is required.",
                statusCode: StatusCodes.BAD_REQUEST
            }));
        }

        const user = await isMemberPartOfWorkspace(workspaceId, memberId);

        console.log("[SUCCESS] User is a member of the workspace:", user);
        return res.status(StatusCodes.OK).json(successResponse(user, "User is a member of the workspace."));

    } catch (error) {
        console.error("[ERROR] Exception in isMemberPartOfWorkspaceController:", error);
        return res.status(error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(customErrorResponse({
            message: error?.message || "Internal Server Error",
            statusCode: error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
        }));
    }
};
