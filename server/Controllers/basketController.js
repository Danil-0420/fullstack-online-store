const ApiError = require('../error/ApiError')
const {
    Basket,
    Basket_Item,
    Product,
    Product_img
} = require('../models/models')
const sequelize = require('../db')

class BasketController {
    async getUserBasket(req, res, next) {
        try {
            const basket = await Basket.findOne({
                where: {
                    userId: req.user.id
                },
                include: [
                    {
                        model: Basket_Item,
                        include: [
                            {
                                model: Product,
                                as: 'basketProduct',
                                include: [
                                    {
                                        model: Product_img
                                    }
                                ]
                            }
                        ]
                    }
                ]
            })

            if (!basket) {
                return next(ApiError.badRequest('Basket was not found'))
            }

            return res.json({ basket })
        } catch (e) {
            return next(ApiError.badRequest(e.message))
        }
    }

    async addProductToBasket(req, res, next) {
        const { productId, quantity = 1 } = req.body

        try {
            const addedProductToBasket = await sequelize.transaction(async (transaction) => {
                if (!productId) {
                    throw ApiError.badRequest('Product ID is required')
                }

                if (!Number.isSafeInteger(Number(quantity)) || Number(quantity) < 1) {
                    throw ApiError.badRequest('Quantity must be a positive integer')
                }

                const basket = await Basket.findOne({
                    where: {
                        userId: req.user.id
                    },
                    transaction,
                    lock: transaction.LOCK.UPDATE
                })

                if (!basket) {
                    throw ApiError.badRequest('Basket was not found')
                }

                const product = await Product.findByPk(productId, {transaction})

                if (!product) {
                    throw ApiError.badRequest('Product does not exist')
                }

                if(product.stock !== null && Number(quantity) > product.stock) {
                    throw ApiError.badRequest('Not enough products in stock')
                }


                const existingItem = await Basket_Item.findOne({
                    where: {
                        basketId: basket.id,
                        productId
                    },
                    transaction,
                    lock: transaction.LOCK.UPDATE
                })

                if(existingItem) {
                    const newQuantity = existingItem.quantity + Number(quantity)
                    if (product.stock !== null && newQuantity > product.stock) {
                        throw ApiError.badRequest('Not enough products in stock')
                    }
                    existingItem.quantity = newQuantity

                    await existingItem.save({transaction})

                    return existingItem
                }



                const basketItem = await Basket_Item.create({
                    basketId: basket.id,
                    productId,
                    quantity
                }, {transaction})

                return (basketItem)
            })

            return res.json(addedProductToBasket)

        } catch (err) {
            console.error('addProductToBasket error:', err)
            return next(err)
        }
    }

    async removeProductFromBasket(req, res, next) {
        try {
            await sequelize.transaction(async (transaction) => {
            const { id } = req.params

            const basket = await Basket.findOne({
                where: {
                    userId: req.user.id
                },
                transaction,
                lock: transaction.LOCK.UPDATE
            })

            if (!basket) {
                throw ApiError.badRequest('Basket was not found')
            }

            const deletedCount = await Basket_Item.destroy({
                where: {
                    id,
                    basketId: basket.id
                },
                transaction
            })

            if (!deletedCount) {
                throw ApiError.badRequest('Basket item does not exist')
            }

        })
            return res.json({message: 'Product deleted successfully'})

        } catch (err) {
            return next (err)
        }
    }

    async decreaseProductQuantity(req, res, next) {
        try {
            const result =  await sequelize.transaction(async (transaction) => {
                const { id } = req.params

                const basket = await Basket.findOne({
                    where: {
                        userId: req.user.id
                    },
                    transaction,
                    lock: transaction.LOCK.UPDATE
                })

                if (!basket) {
                    throw ApiError.badRequest('Basket was not found')
                }

                const basketItem = await Basket_Item.findOne({
                    where: {
                        id,
                        basketId: basket.id
                    },
                    transaction
                })

                if (!basketItem) {
                    throw  ApiError.badRequest('Basket item does not exist')
                }

                if (basketItem.quantity > 1) {
                    basketItem.quantity -= 1
                    await basketItem.save({transaction})

                    return {
                        message: 'Product quantity decreased',
                        basketItem
                    }
                }

                await basketItem.destroy({transaction})
                return {message: "Product deleted successfully"};
            })

            return res.json(result)
        } catch (err) {
            return next(err)
        }
    }
}

module.exports = new BasketController()