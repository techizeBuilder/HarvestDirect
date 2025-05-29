import { Router } from 'express';
import { 
  getAllUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser 
} from '../../controllers/admin/userController.js';
import { authenticate, authorizeAdmin } from '../../middlewares/auth.js';

const router = Router();

// Apply admin authentication to all routes
router.use(authenticate, authorizeAdmin);

// User management routes
router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;