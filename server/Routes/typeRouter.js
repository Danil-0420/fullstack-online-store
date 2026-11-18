const Router = require('express')
const router = new Router()
const typeController = require('../Controllers/typeController')
const authMiddleware = require('../middleware/AuthMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')

router.post('/', authMiddleware, checkRole('ADMIN'), typeController.create)
router.get('/', typeController.getAll)

module.exports = router