import Workspace from '../schema/workspace.js'
import crudRepository from './crudRepository.js'
import { StatusCodes } from 'http-status-codes'
import {
  customErrorResponse,
  internalErrorResponse
} from '../utils/common/responseObjects.js'
import Channel from '../schema/channel.js'
import mongoose from 'mongoose'

const workspaceRepository = {
  ...crudRepository(Workspace),

  async getWorkspaceByName(name) {
    try {
      const workspace = await Workspace.findOne({ name })
      if (!workspace) {
        throw customErrorResponse({
          message: 'Workspace not found',
          statusCode: StatusCodes.NOT_FOUND
        })
      }

      return workspace
    } catch (error) {
      console.error(
        `[WorkspaceRepository] Error fetching workspace by name: ${error.message}`
      )
      throw internalErrorResponse(error)
    }
  },

  async getWorkspaceByJoinCode(joinCode) {
    try {
      console.log(`[DEBUG] Fetching workspace using join code: ${joinCode}`)
      const workspace = await Workspace.findOne({ joinCode })

      if (!workspace) {
        console.error(`[ERROR] Workspace not found for join code: ${joinCode}`)
        throw customErrorResponse({
          message: 'Workspace not found.',
          statusCode: StatusCodes.NOT_FOUND
        })
      }

      return workspace
    } catch (error) {
      console.error(
        `[ERROR] Exception fetching workspace by join code: ${error.message}`
      )
      throw internalErrorResponse(error)
    }
  },

  async addMemberToWorkspace(memberId, workspaceId, role = 'Member') {
    try {
      const workspace = await Workspace.findById(workspaceId)
      if (!workspace) {
        throw customErrorResponse({
          message: 'Workspace not found',
          statusCode: StatusCodes.NOT_FOUND
        })
      }

      const isMemberAlreadyAdded = workspace.members.some(
        (member) => member.memberId.toString() === memberId
      )

      if (isMemberAlreadyAdded) {
        throw customErrorResponse({
          message: 'User is already a member of this workspace',
          statusCode: StatusCodes.BAD_REQUEST
        })
      }

      workspace.members.push({ memberId, role })
      await workspace.save()
      return workspace
    } catch (error) {
      console.error(
        `[WorkspaceRepository] Error adding member: ${error.message}`
      )
      throw internalErrorResponse(error)
    }
  },

  async addChannelToWorkspace(workspaceId, channelName) {
    try {
      console.log(
        `[DEBUG] Checking for duplicate channel: "${channelName}" in workspace ${workspaceId}`
      )

      // Ensure workspaceId is an ObjectId
      const workspaceObjectId = new mongoose.Types.ObjectId(workspaceId)

      // Check if a channel with the same name already exists in this workspace (case-insensitive)
      const existingChannel = await Channel.findOne({
        name: { $regex: new RegExp(`^${channelName}$`, 'i') },
        workspaceId: workspaceObjectId
      })

      if (existingChannel) {
        console.warn(
          `[WARNING] Channel "${channelName}" already exists in workspace ${workspaceId}`
        )
        throw new Error('Channel already exists in the workspace')
      }

      console.log('[DEBUG] Creating new channel...')
      const channel = await Channel.create({
        name: channelName,
        workspaceId: workspaceObjectId
      })

      console.log('[DEBUG] Adding new channel to workspace...')
      const workspace = await Workspace.findById(workspaceObjectId)
      if (!workspace) {
        throw new Error('Workspace not found')
      }

      workspace.channels.push(channel._id) // Add channel ID to workspace
      await workspace.save() // Save workspace update

      console.log(
        '[SUCCESS] Channel added successfully and linked to workspace:',
        channel
      )
      return workspace // Return the updated workspace
    } catch (error) {
      console.error(
        `[ERROR] Exception in addChannelToWorkspace: ${error.message}`
      )
      throw error
    }
  },

  async fetchAllWorkspaceByMemberId(memberId) {
    try {
      const workspaces = await Workspace.find({
        'members.memberId': memberId
      }).populate('members.memberId', 'username email avatar')

      if (!workspaces || workspaces.length === 0) {
        throw customErrorResponse({
          message: 'No workspaces found for this member',
          statusCode: StatusCodes.NOT_FOUND
        })
      }

      return workspaces
    } catch (error) {
      console.error(
        `[WorkspaceRepository] Error fetching workspaces: ${error.message}`
      )
      throw internalErrorResponse(error)
    }
  }
}

export default workspaceRepository
