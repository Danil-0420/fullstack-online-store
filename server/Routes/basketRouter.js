const Router = require('express')
const router = Router()
const basketController = require('../Controllers/basketController')
const authMiddleware = require('../middleware/AuthMiddleware')


router.get('/', authMiddleware, basketController.getUserBasket)
router.post('/', authMiddleware, basketController.addProductToBasket)
router.delete('/:id', authMiddleware, basketController.removeProductFromBasket)
router.patch('/decrease/:id', authMiddleware, basketController.decreaseProductQuantity)

module.exports = router