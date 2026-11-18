const { Delivery, Order } = require('../models/models')
const ApiError = require('../error/ApiError')
const sequelize = require('../db')

class DeliveryController {

    async updateDelivery(req, res, next){
        const {orderId} = req.params
        const {tracking_number} = req.body
        try{

            const updatedDelivery = await sequelize.transaction(async (transaction)=>{

                if(typeof tracking_number !== 'string' || !tracking_number.trim()){
                    throw ApiError.badRequest("Invalid tracking number")
                }

                const order = await Order.findOne({
                    where: {id: orderId},
                    transaction,
                    lock: transaction.LOCK.UPDATE})
                if(!order){
                    throw ApiError.badRequest("Order does not exist")
                }
                if(order.status !== 'Processing'){
                    throw ApiError.badRequest("Order status cannot be changed on shipped")
                }

                order.status = "Shipped"

                const delivery = await Delivery.findOne({
                    where: {orderId: orderId},
                    transaction,
                    lock: transaction.LOCK.UPDATE})
                if(!delivery){
                    throw ApiError.badRequest("Delivery does not exist")
                }
                delivery.tracking_number = tracking_number.trim()
                delivery.shipped_at = new Date()

                await order.save({transaction})
                await delivery.save({transaction})

                return ({order, delivery})
            })

            return res.json(updatedDelivery)

        }catch(err){
            return next(err)
        }
    }

}

module.exports = new DeliveryController()