import { StatusCodes } from "http-status-codes";
import { addChannelToWorkspaceService, addMemberToWorkspaceService, createWorkspaceService, deleteWorkspaceService, getAllWorkspacesService, getWorkspaceByJoinCodeService, getWorkspaceService, updateWorkspaceService } from "../services/workspaceService.js";
import { customErrorResponse, successResponse } from "../utils/common/responseObjects.js";

export const createWorkspaceController = async (req, res) => {
    try {
        const response = await createWorkspaceService({
            ...req.body,
            owner: req.user
        });

        return res.status(StatusCodes.CREATED).json(successResponse(response, "Workspace created successfully!"));
    } catch (error) {
        console.error("Create Workspace Controller Error:", error);

        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(customErrorResponse({
            message: "Internal Server Error",
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR
        }));
    }
};

export const getAllWorkspacesController = async (req, res) => {
    try {
        const userId = req.user.id;
        const workspaces = await getAllWorkspacesService(userId);

        return res.status(StatusCodes.OK).json(successResponse(workspaces, "Workspaces fetched successfully!"));
    } catch (error) {
        console.error("Error fetching workspaces:", error);

        if (error.statusCode) {
            return res.status(error.statusCode).json(customErrorResponse(error));
        }

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(customErrorResponse({
            message: "Internal Server Error",
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR
        }));
    }
};


export const deleteWorkspaceController = async (req, res) => {
    try {
      const response = await deleteWorkspaceService(req.params.workspaceId, req.user.id);
      return res
        .status(StatusCodes.OK)
        .json(successResponse(response, "Workspace deleted successfully"));
    } catch (error) {
      console.error("Error deleting workspace:", error.message || error);
      
      return res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(customErrorResponse({
        message: error.message || "Internal Server Error",
        statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
      }));
    }
  };
  
  export const getWorkspaceController = async (req, res) => {
    try {
      const userId = req.user?.id;
      const workspaceId = req.params?.workspaceId;
  
      console.log(`[DEBUG] Received request to fetch workspace - User ID: ${userId}, Workspace ID: ${workspaceId}`);
  
      if (!userId || !workspaceId) {
        console.error("[ERROR] Missing User ID or Workspace ID");
        return res.status(StatusCodes.BAD_REQUEST).json(customErrorResponse({
          message: "User ID and Workspace ID are required.",
          statusCode: StatusCodes.BAD_REQUEST,
        }));
      }
  
      console.log("[DEBUG] Calling getWorkspaceService...");
      const workspace = await getWorkspaceService(workspaceId, userId);
      console.log("[SUCCESS] Workspace retrieved successfully:", workspace);
  
      return res.status(StatusCodes.OK).json(successResponse(workspace, "Workspace fetched successfully!"));
    } catch (error) {
      console.error("[ERROR] Exception in getWorkspaceController:", error?.message || error);
  
      return res.status(error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(customErrorResponse({
        message: error?.message || "Internal Server Error",
        statusCode: error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      }));
    }
  };
  
  export const getWorkspaceByJoinCodeController = async (req, res) => {
    try {
        const { joinCode } = req.body;  // ✅ Extract joinCode properly
        console.log(`[DEBUG] Received request with join code: ${joinCode}`);

        if (!joinCode) {
            console.error("[ERROR] Missing join code.");
            return res.status(StatusCodes.BAD_REQUEST).json(customErrorResponse({
                message: "Join code is required.",
                statusCode: StatusCodes.BAD_REQUEST,
            }));
        }

        console.log("[DEBUG] Calling getWorkspaceByJoinCodeService...");
        const workspace = await getWorkspaceByJoinCodeService(joinCode);
        console.log("[SUCCESS] Workspace fetched:", workspace);

        return res.status(StatusCodes.OK).json(successResponse(workspace, "Workspace fetched successfully!"));
    } catch (error) {
        console.error("[ERROR] Exception in getWorkspaceByJoinCodeController:", error);
        return res.status(error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(customErrorResponse({
            message: error?.message || "Internal Server Error",
            statusCode: error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        }));
    }
};

export const addMemberToWorkspaceController = async (req, res) => {
    try {
        const userId = req.user.id;
        const workspaceId = req.params.workspaceId;

        console.log(`[DEBUG] Adding user ${userId} to workspace ${workspaceId}`);

        const response = await addMemberToWorkspaceService(workspaceId, userId);

        console.log("[SUCCESS] User added to workspace:", response);

        return res.status(StatusCodes.OK).json(successResponse(response, "User added to workspace successfully!"));
    } catch (error) {
        console.error("[ERROR] Exception in addMemberToWorkspaceController:", error);
        return res.status(error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(customErrorResponse({
            message: error?.message || "Internal Server Error",
            statusCode: error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        }));
    }
};


export const addChannelToWorkspaceController = async (req, res) => {
    try {
        const userId = req.user.id;
        const workspaceId = req.params.workspaceId;
        const { channelName } = req.body;

        console.log(`[DEBUG] Adding channel "${channelName}" to workspace ${workspaceId} by user ${userId}`);

        const response = await addChannelToWorkspaceService(workspaceId, userId, channelName);

        console.log("[SUCCESS] Channel added to workspace:", response);

        return res.status(StatusCodes.OK).json(successResponse(response, "Channel added successfully!"));
    } catch (error) {
        console.error("[ERROR] Exception in addChannelToWorkspaceController:", error);
        return res.status(error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(customErrorResponse({
            message: error?.message || "Internal Server Error",
            statusCode: error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        }));
    }
};



export const updateWorkspaceController = async (req, res) => {
    try {
        const userId = req.user.id;
        const workspaceId = req.params.workspaceId;
        const updatedWorkspaceData = req.body;

        console.log(`[DEBUG] User ${userId} requested to update workspace ${workspaceId}`);
        console.log("[DEBUG] Update Payload:", updatedWorkspaceData);

        if (!updatedWorkspaceData || Object.keys(updatedWorkspaceData).length === 0) {
            console.error("[ERROR] No update data provided");
            return res.status(StatusCodes.BAD_REQUEST).json(customErrorResponse({
                message: "No update data provided.",
                statusCode: StatusCodes.BAD_REQUEST,
            }));
        }

        console.log("[DEBUG] Calling updateWorkspaceService...");
        const response = await updateWorkspaceService(workspaceId, updatedWorkspaceData, userId);

        console.log("[SUCCESS] Workspace updated:", response);
        return res.status(StatusCodes.OK).json(successResponse(response, "Workspace updated successfully!"));

    } catch (error) {
        console.error("[ERROR] Exception in updateWorkspaceController:", error);
        return res.status(error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(customErrorResponse({
            message: error?.message || "Internal Server Error",
            statusCode: error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        }));
    }
};
