const Router = require('express')
const router = new Router()
const userRouter = require('./userRouter')
const productRouter = require('./productRouter')
const brandRouter = require('./brandRouter')
const typeRouter = require('./typeRouter')
const basketRouter = require('./basketRouter')
const basket_itemRouter = require('./basket_itemRouter')
const ratingRouter = require('./ratingRouter')
const orderRouter = require('./orderRouter')
const deliveryRouter = require('./deliveryRouter')



router.use('/user', userRouter)
router.use('/product',productRouter)
router.use('/brand', brandRouter)
router.use('/type', typeRouter)
router.use('/basket', basketRouter)
router.use('/basket_item', basket_itemRouter)
router.use('/rating', ratingRouter)
router.use('/order', orderRouter)
router.use('/delivery', deliveryRouter)



module.exports = router