import express from 'express';
import { validate } from '../../validators/zodValidator.js';
import { createWorkspaceSchema } from '../../validators/workspaceSchema.js';
import { addChannelToWorkspaceController, addMemberToWorkspaceController, createWorkspaceController,  deleteWorkspaceController, getAllWorkspacesController, getWorkspaceByJoinCodeController, getWorkspaceController, updateWorkspaceController } from '../../controllers/workspaceController.js';
import { isAuthenticated } from '../../middlewares/authMiddleware.js';



const router = express.Router();

router.post('/create' ,isAuthenticated, validate(createWorkspaceSchema) , createWorkspaceController );
router.get('/list', isAuthenticated, getAllWorkspacesController);
router.delete('/:workspaceId', isAuthenticated, deleteWorkspaceController);
router.get('/:workspaceId', isAuthenticated, getWorkspaceController);
router.post('/joincode', isAuthenticated, getWorkspaceByJoinCodeController);
router.post('/:workspaceId/add-member', isAuthenticated, addMemberToWorkspaceController);
router.post('/:workspaceId/add-channel', isAuthenticated, addChannelToWorkspaceController);
router.put('/:workspaceId/update', isAuthenticated, updateWorkspaceController);

export default router;

