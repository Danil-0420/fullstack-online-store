const Router = require('express')
const router = new Router()
const deliveryController = require('../Controllers/deliveryController')
const authMiddleware = require('../middleware/AuthMiddleware')
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware')

//admin routes
router.patch('/admin/:orderId', authMiddleware, checkRoleMiddleware('ADMIN'), deliveryController.updateDelivery)

//user routes
// router.get('/', authMiddleware, deliveryController.getAllDeliveries)
// router.post('/', authMiddleware, deliveryController.createDelivery)
// router.get('/:id', authMiddleware, deliveryController.getOneDelivery)

module.exports = router



