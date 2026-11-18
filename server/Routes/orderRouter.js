const Router = require('express')
const router = new Router()
const orderController = require('../Controllers/orderController')
const authMiddleware = require('../middleware/AuthMiddleware')
const checkRole = require('../middleware/checkRoleMiddleware')
const {Order} = require("../models/models");


// admin routes
router.get('/admin/all', authMiddleware, checkRole('ADMIN'), orderController.getAllOrders)
router.get('/admin/:id', authMiddleware, checkRole('ADMIN'), orderController.getAdminOrder)
router.patch('/update/:id', authMiddleware, checkRole('ADMIN'), orderController.updateOrder)
router.patch('/update/:id/ship', authMiddleware, checkRole('ADMIN'), orderController.shipOrder)

// user routes
router.get('/', authMiddleware, orderController.getOrders)
router.get('/:id', authMiddleware, orderController.getOneOrder)
router.post('/', authMiddleware, orderController.addOrder)
router.patch('/cancel/:id', authMiddleware, orderController.cancelOrder)


module.exports = router