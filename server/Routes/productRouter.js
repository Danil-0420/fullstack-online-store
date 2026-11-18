const Router = require('express')
const router = new Router
const productController = require('../Controllers/productController')
const authMiddleware = require('../middleware/AuthMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')


router.post('/', authMiddleware,  checkRole('ADMIN'), productController.create)
router.get('/', productController.getAll)
router.get('/:id', productController.getOne)

module.exports = router