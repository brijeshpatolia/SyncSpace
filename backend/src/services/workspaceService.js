import channelRepository from '../repositories/channelRepository.js'
import workspaceRepository from '../repositories/workspaceRepository.js'
import { v4 as uuidv4 } from 'uuid'
import { customErrorResponse } from '../utils/common/responseObjects.js'
import { StatusCodes } from 'http-status-codes'
import { addEmailtoMailQueue } from '../producers/mailQueueProducer.js'
import mailObjects from '../utils/common/mailObjects.js'
import { getUserById } from '../repositories/userRepository.js'

export const createWorkspaceService = async (workspaceData) => {
  try {
    const joinCode = uuidv4().substring(0, 8)
    const workspace = await workspaceRepository.create({
      name: workspaceData.name,
      description: workspaceData.description,
      joinCode
    })

    await workspaceRepository.addMemberToWorkspace(
      workspaceData.owner.id,
      workspace._id,
      'Admin'
    )

    const updatedWorkspace = await workspaceRepository.addChannelToWorkspace(
      workspace._id,
      'general'
    )

    return updatedWorkspace
  } catch (error) {
    console.error('Error creating workspace:', error)
    throw customErrorResponse({
      message: error.message || 'Error creating workspace.',
      statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    })
  }
}

export const getAllWorkspacesService = async (memberId) => {
  try {
    if (!memberId) {
      throw customErrorResponse({
        message: 'Member ID is required.',
        statusCode: StatusCodes.BAD_REQUEST
      });
    }

    const workspaces = await workspaceRepository.fetchAllWorkspaceByMemberId(memberId);

    // ✅ Return empty array with success instead of throwing an error
    if (!workspaces || workspaces.length === 0) {
      return []; // returning empty instead of throwing error
    }

    return workspaces;
  } catch (error) {
    console.error('Error fetching all workspaces:', error);
    throw customErrorResponse({
      message: error.message || 'Error fetching all workspaces.',
      statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    });
  }
};


export const deleteWorkspaceService = async (workspaceId, userId) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId)
    if (!workspace) {
      throw customErrorResponse({
        message: 'Workspace not found.',
        statusCode: StatusCodes.NOT_FOUND
      })
    }

    // Check if the user is an Admin
    const isAllowed = workspace.members.some(
      (member) =>
        member.memberId.toString() === userId && member.role === 'Admin'
    )

    if (!isAllowed) {
      throw customErrorResponse({
        message: 'You are not authorized to delete this workspace.',
        statusCode: StatusCodes.FORBIDDEN
      })
    }

    // Delete all associated channels before deleting the workspace
    if (workspace.channels?.length > 0) {
      await channelRepository.deleteMany(workspace.channels)
    }

    // Delete the workspace
    await workspaceRepository.delete(workspaceId)

    return {
      message: 'Workspace deleted successfully.',
      workspaceId
    }
  } catch (error) {
    console.error('Error deleting workspace:', error)
    throw customErrorResponse({
      message: error.message || 'Error deleting workspace.',
      statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    })
  }
}

export const getWorkspaceService = async (workspaceId, userId) => {
  try {
    console.log(
      `[DEBUG] Fetching workspace - ID: ${workspaceId}, User ID: ${userId}`
    )

    if (!workspaceId || !userId) {
      console.error('[ERROR] Missing workspace ID or user ID')
      throw customErrorResponse({
        message: 'Workspace ID and User ID are required.',
        statusCode: StatusCodes.BAD_REQUEST
      })
    }
    const workspace = await workspaceRepository.getById(workspaceId)
    console.log('[DEBUG] Workspace fetched:', workspace)

    if (!workspace) {
      console.error(`[ERROR] Workspace not found - ID: ${workspaceId}`)
      throw customErrorResponse({
        message: 'Workspace not found.',
        statusCode: StatusCodes.NOT_FOUND
      })
    }

    console.log('[DEBUG] Checking if user is a member of the workspace...')
    console.log('[DEBUG] Workspace Members:', workspace.members)

    const isAllowed = workspace.members.some(
      (member) => member.memberId.toString() === userId
    )

    if (!isAllowed) {
      console.error(
        `[ERROR] User is not a member of the workspace - User ID: ${userId}`
      )
      throw customErrorResponse({
        message: 'You are not authorized to view this workspace.',
        statusCode: StatusCodes.FORBIDDEN
      })
    }

    console.log('[SUCCESS] User is authorized to access the workspace')
    return workspace
  } catch (error) {
    console.error(
      '[ERROR] Exception in getWorkspaceService:',
      error?.message || error
    )

    throw customErrorResponse({
      message: error?.message || 'Error retrieving workspace.',
      statusCode: error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    })
  }
}

export const getWorkspaceByJoinCodeService = async (joinCode) => {
  try {
    console.log(`[DEBUG] Searching for workspace with join code: ${joinCode}`)

    if (!joinCode) {
      console.error('[ERROR] Join code is missing.')
      throw customErrorResponse({
        message: 'Join code is required.',
        statusCode: StatusCodes.BAD_REQUEST
      })
    }

    const workspace = await workspaceRepository.getWorkspaceByJoinCode(joinCode)
    console.log('[DEBUG] Workspace fetched from repository:', workspace)

    if (!workspace) {
      console.error(`[ERROR] No workspace found for join code: ${joinCode}`)
      throw customErrorResponse({
        message: 'Workspace not found.',
        statusCode: StatusCodes.NOT_FOUND
      })
    }

    console.log('[SUCCESS] Workspace found:', workspace)
    return workspace
  } catch (error) {
    console.error('[ERROR] Exception in getWorkspaceByJoinCodeService:', error)

    throw customErrorResponse({
      message: error.message || 'Error retrieving workspace by join code.',
      statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    })
  }
}

export const updateWorkspaceService = async (
  workspaceId,
  updatedWorkspaceData,
  userId
) => {
  try {
    console.log(
      `[DEBUG] Fetching workspace ${workspaceId} to update by user ${userId}`
    )

    const workspace = await workspaceRepository.getById(workspaceId)
    console.log('[DEBUG] Retrieved workspace:', workspace)

    if (!workspace) {
      console.error(`[ERROR] Workspace ${workspaceId} not found`)
      throw customErrorResponse({
        message: 'Workspace not found.',
        statusCode: StatusCodes.NOT_FOUND
      })
    }

    console.log('[DEBUG] Checking if user is an Admin...')
    const user = workspace.members.find(
      (member) => member.memberId.toString() === userId
    )

    if (!user) {
      console.error(`[ERROR] User ${userId} is not a member of this workspace`)
      throw customErrorResponse({
        message: 'You are not a member of this workspace.',
        statusCode: StatusCodes.FORBIDDEN
      })
    }

    if (user.role !== 'Admin') {
      console.warn(`[WARNING] User ${userId} is not an Admin.`)
      throw customErrorResponse({
        message: 'Only Admins can update this workspace.',
        statusCode: StatusCodes.FORBIDDEN
      })
    }

    console.log('[DEBUG] Admin verified. Updating workspace...')
    console.log('[DEBUG] Update Data:', updatedWorkspaceData)

    const updatedWorkspace = await workspaceRepository.update(
      workspaceId,
      updatedWorkspaceData
    )

    console.log('[SUCCESS] Workspace updated successfully:', updatedWorkspace)
    return updatedWorkspace
  } catch (error) {
    console.error('[ERROR] Exception in updateWorkspaceService:', error)
    throw customErrorResponse({
      message: error.message || 'Error updating workspace.',
      statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    })
  }
}

export const addMemberToWorkspaceService = async (
  workspaceId,
  userId,
  role = 'Member'
) => {
  try {
    const workspace = await workspaceRepository.getById(workspaceId);
    if (!workspace) {
      throw customErrorResponse({
        message: 'Workspace not found.',
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    const updatedWorkspace = await workspaceRepository.addMemberToWorkspace(
      userId,
      workspaceId,
      role
    );

    const user = await getUserById(userId);
    if (!user || !user.email) {
      throw customErrorResponse({
        message: 'User email not found for email notification.',
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    await addEmailtoMailQueue({
      from: mailObjects.from,
      to: user.email,
      subject: 'You have been added to a workspace!',
      text: `Hello ${user.username},\n\nYou have been successfully added to the workspace "${updatedWorkspace.name}".\n\nRegards,\nTeam`,
    });

    console.log(`[SUCCESS] Email queued for notification to user: ${user.email}`);

    return updatedWorkspace;
  } catch (error) {
    console.error('Error adding member to workspace:', error);
    throw customErrorResponse({
      message: error.message || 'Error adding member to workspace.',
      statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
};


export const addChannelToWorkspaceService = async (
  workspaceId,
  userId,
  channelName
) => {
  try {
    console.log(
      `[DEBUG] Fetching workspace ${workspaceId} to add channel "${channelName}" by user ${userId}`
    )

    const workspace = await workspaceRepository.getById(workspaceId)
    console.log('[DEBUG] Retrieved workspace:', workspace)

    if (!workspace) {
      console.error(`[ERROR] Workspace ${workspaceId} not found`)
      throw customErrorResponse({
        message: 'Workspace not found.',
        statusCode: StatusCodes.NOT_FOUND
      })
    }

    console.log('[DEBUG] Checking if user is an admin of the workspace...')
    const isAdmin = workspace.members.some(
      (member) =>
        member.memberId.toString() === userId && member.role === 'Admin'
    )

    if (!isAdmin) {
      console.error(
        `[ERROR] User ${userId} is not authorized to add a channel (not an Admin)`
      )
      throw customErrorResponse({
        message: 'Only Admins can add channels to this workspace.',
        statusCode: StatusCodes.FORBIDDEN
      })
    }

    console.log('[DEBUG] Admin verified. Adding channel to workspace...')
    const updatedWorkspace = await workspaceRepository.addChannelToWorkspace(
      workspaceId,
      channelName
    )

    console.log('[SUCCESS] Channel added to workspace:', updatedWorkspace)
    return updatedWorkspace
  } catch (error) {
    console.error('[ERROR] Exception in addChannelToWorkspaceService:', error)
    throw customErrorResponse({
      message: error.message || 'Error adding channel to workspace.',
      statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    })
  }
}
