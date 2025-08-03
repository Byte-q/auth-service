import Router from 'express';
import { AuthController } from '../controllers/auth-controller.js';
import { verifyJWT } from '../middleware/verifyJWT-middleware.js';
import { ROLES_LIST } from '../config/rolesList.js';
import { verifyRoles } from '../middleware/verifyRoles.js';

const router = Router();

const authController = new AuthController();

router.get('/', async (req, res) => {
    await authController.listAll(req, res)
})
router.get('/refresh', async (req, res) => {
    await authController.refresh(req, res)
})
router.get('/logout', async (req, res) => {
    await authController.logout(req, res)
})
router.get('/:id', verifyJWT, async (req, res) => {
    await authController.getById(req, res)
})
router.get('/name/:name', verifyJWT, async (req, res) => {
    await authController.getByName(req, res)
})
router.get('/email/:email', verifyJWT, async (req, res) => {
    await authController.getByEmail(req, res)
})
router.post('/login', async (req, res) => {
    await authController.login(req, res)
})
router.post('/register', async (req, res) => {
    await authController.create(req, res)
})
router.patch('/:id', verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), verifyJWT, async (req, res) => {
    await authController.update(req, res)
})
router.delete('/:id', verifyRoles(ROLES_LIST.Admin), verifyJWT, async (req, res) => {
    await authController.delete(req, res)
})

export default router;