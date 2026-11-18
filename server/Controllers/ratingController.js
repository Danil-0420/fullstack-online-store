const {Op} = require('sequelize')
const ApiError = require('../error/ApiError')
const {Rating, Order_item} = require('../models/models')
const {Order} = require('../models/models')




class ratingController {
    async getFeedbacks(req, res, next){
        try{
            const {id} = req.params

            const feedback = await Rating.findAll({where: {id}})

            return res.json({feedback})
        } catch(e){
            next(ApiError.badRequest(e.message))
        }
    }

    async addRating(req, res, next) {
        try {
            const {productId, rate, feedback} = req.body

            if (!rate || !productId) {
                return next(
                    ApiError.badRequest('You have to choose a product and a rating')
                )
            }

            if (rate < 1 || rate > 5) {
                return next(
                    ApiError.badRequest('Rating must be between 1 and 5')
                )
            }

            const orders = await Order.findAll({
                where: {
                    userId: req.user.id,
                    status: 'Delivered'
                },
                attributes: ['id']
            })

            if (!orders.length) {
                return next(
                    ApiError.badRequest(
                        'You must buy and receive the product before rating it'
                    )
                )
            }

            const orderIds = orders.map(order => order.id)

            const boughtProduct = await Order_item.findOne({
                where: {
                    productId,
                    orderId: {
                        [Op.in]: orderIds
                    }
                }
            })

            if (!boughtProduct) {
                return next(
                    ApiError.badRequest(
                        'You must buy and receive the product before rating it'
                    )
                )
            }

            const existingRating = await Rating.findOne({
                where: {
                    userId: req.user.id,
                    productId
                }
            })

            if (existingRating) {
                return next(
                    ApiError.badRequest('You have already rated this product')
                )
            }

            const rating = await Rating.create({
                userId: req.user.id,
                productId,
                rate,
                feedback
            })

            return res.status(201).json(rating)
        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }

    async deleteFeedback(req, res, next){
        const {id} = req.params

        const deleteRating = await Rating.destroy({where: {productId: id, userId: req.user.id}})

        if(!deleteRating){
            return res.json("There is no such feedback")
        }

        return res.json("Feedback deleted")


    }

}

module.exports = new ratingController()