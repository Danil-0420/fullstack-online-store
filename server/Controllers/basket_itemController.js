const ApiError = require('../error/ApiError');
const {Basket_Item} = require('../models/models');
const {Basket} = require('../models/models')
const {Product} = require('../models/models')


class BasketItemController {
    async addBasketItem(req, res, next){
       try{
           const {productId, quantity} = req.body
           if(!productId){
               return next(ApiError.badRequest('Id is required'))
           }
           const basket = await Basket.findOne({where:{userId: req.user.id}})
           if(!basket){
               return next(ApiError.badRequest('Basket was not found'))
           }



           const existingItem = await Basket_Item.findOne({where:{
               basketId: basket.id,
               productId
           }})

            if(existingItem){
                existingItem.quantity += 1
                await existingItem.save()

                return res.json(existingItem)
            }

            const basket_item = await Basket_Item.create({
                basketId: basket.id,
                productId,
                quantity: quantity || 1
            })


           return res.json({basket_item})

       } catch(e){
           next(ApiError.badRequest(e.message))
       }

    }
    async getAllBasketItems(req, res, next){
        try{
            const basket = await Basket.findOne({where:{userId:req.user.id}})
            if(!basket){
                return next(ApiError.badRequest('Basket was not found'))
            }
            const basket_item = await Basket_Item.findAll({
                where:
                    {basketId: basket.id},
                    include:[Product]
            })

            return res.json({basket_item})
        }catch(e){
            next(ApiError.badRequest(e.message))
        }


    }

    async decreaseItemFromBasket(req, res, next){
        try{
            const {id} = req.params

            const basket = await Basket.findOne({where: {id:req.user.id}})
            if(!basket){
                return next(ApiError.badRequest('Basket was not found'))
            }

            const basket_item = await Basket_Item.findOne({where:{
                    id,
                    basketId: basket.id
                }})
            if(!basket_item){
                return next(ApiError.badRequest('Item was not found in basket'))
            }

            if(basket_item.quantity > 1){
                basket_item.quantity -= 1
                await basket_item.save()
                return res.json({basket_item})
            }

            await basket_item.destroy()

            return res.json('Product was removed from basket')


        }catch(e){
            next(ApiError.badRequest(e.message))
        }
    }


    async removeFromBasketItem(req, res, next) {
        try {
            const {id} = req.params

            const basket = await Basket.findOne({where: {userId: req.user.id}})
            if (!basket) {
                return next(ApiError.badRequest('Basket was not found'))
            }
            const deleted = await Basket_Item.destroy({where: {id: id, basketId: basket.id}})

            if (!deleted) {
                return next(ApiError.badRequest('Product was not found'))
            }

            return res.json('Product was removed')

        } catch (e) {
            next(ApiError.badRequest(e.message))
        }
    }


}

module.exports = new BasketItemController();