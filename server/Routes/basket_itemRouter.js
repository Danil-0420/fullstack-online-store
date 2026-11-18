const Router = require('express')
const router = Router()
const authMiddleware = require('../middleware/AuthMiddleware')
const Basket_itemController = require('../Controllers/basket_itemController')
const checkRole = require("../middleware/checkRoleMiddleware");

router.post('/', authMiddleware, checkRole('ADMIN'), Basket_itemController.addBasketItem)
router.get('/', authMiddleware, checkRole('ADMIN'), Basket_itemController.getAllBasketItems)
router.patch('/:id', authMiddleware, checkRole('ADMIN'), Basket_itemController.decreaseItemFromBasket)
router.delete('/:id', authMiddleware, checkRole('ADMIN'), Basket_itemController.removeFromBasketItem)

module.exports = router