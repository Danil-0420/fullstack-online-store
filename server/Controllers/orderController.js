const ApiError = require('../error/ApiError')
const sequelize = require('../db')

const {
    Order,
    Order_item,
    Basket,
    Basket_Item,
    Product,
    Delivery, Product_img
} = require('../models/models')
const err = require("../error/ApiError");

class OrderController {

    //good
    async getOrders(req, res, next) {
        try {
            const orders = await Order.findAll({
                where: {
                    userId: req.user.id
                },
                include: [
                    {
                        model: Order_item,
                        include: [
                            {
                                model: Product,
                                include: [
                                    {
                                        model: Product_img,
                                        attributes: ['id', 'img'],
                                        separate: true,
                                        limit: 1,
                                        order: [['id', 'ASC']]
                                    }
                                ]
                            }
                        ]
                    }
                ],
                order: [['createdAt', 'DESC']]
            })

            return res.json(orders)
        } catch (err) {
            return next(ApiError.badRequest(err.message))
        }
    }

    //good
    async getOneOrder(req, res, next) {
        try {
            const { id } = req.params

            const order = await Order.findOne({
                where: {
                    id,
                    userId: req.user.id
                },
                include: [
                    {
                        model: Order_item,
                        include: [
                            {
                                model: Product,
                                include: [
                                    {
                                        model: Product_img,
                                        attributes: ['id', 'img'],
                                        separate: true,
                                        limit: 1,
                                        order: [['id', 'ASC']]
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        model: Delivery
                    }
                ]
            })

            if (!order) {
                throw ApiError.badRequest('This order does not exist')
            }

            return res.json(order)
        } catch (err) {
            return next(err)
        }
    }

    async getAllOrders(req, res, next) {
        try{
            const orders = await Order.findAll({
                attributes: ['id', 'first_name', 'last_name', 'status', 'total_price'],
                order: [['creation_date', 'DESC'],
                    ['id', 'DESC']
                ]
            })
            return res.json(orders)
        } catch(err){
            return next(err)
        }
    }

    async getAdminOrder(req, res, next){
        try{
            const {id} = req.params
            const order = await Order.findByPk(id, {
                include: [{
                    model: Order_item,
                    attributes: ['id', 'quantity', 'price'],
                    include: [{
                        model: Product,
                        attributes: ['id', 'name'],
                        include: [
                            {
                                model: Product_img,
                                attributes: ['id', 'img'],
                                separate: true,
                                limit: 1,
                                order: [['id', 'ASC']]
                            }
                        ]
                    }]
                },
                    {
                        model: Delivery,
                        attributes: ['company_name', 'delivery_method', 'delivery_price', 'delivery_address', 'tracking_number', 'shipped_at'],
                    }
                ]})
            if(!order){
                return next(ApiError.notFound('This order does not exist'))
            }
            return res.json(order)
        }catch(err){
            return next(err)
        }

    }

    async addOrder(req, res, next) {
        try{
            const {firstName, lastName, email, phone, payment_method, company_name, delivery_address, delivery_method} = req.body
            if ( typeof firstName !== 'string' ||
                !firstName.trim() ||
                typeof lastName !== 'string' ||
                !lastName.trim() ||
                typeof email !== 'string' ||
                !email.trim() ||
                typeof phone !== 'string' ||
                !phone.trim() ||
                typeof payment_method !== 'string' ||
                !payment_method.trim() ||
                typeof company_name !== 'string' ||
                !company_name.trim() ||
                typeof delivery_address !== 'string' ||
                !delivery_address.trim() ||
                typeof delivery_method !== 'string' ||
                !delivery_method.trim()
            ) {
                throw ApiError.badRequest(
                    'Not all fields were filled properly.'
                )
            }

            const deliveryPrices = {
                Inpost: {
                    'Parcel': 15.99,
                    'Courier': 19.99
                },
                DHL: {
                    'Courier': 24.99
                },
                "Poczta Polska": {
                    'Courier': 17.99
                }
            }


            const allowedPaymentMethods = ["Card", "BLIK", "Bank transfer"]
            if(!allowedPaymentMethods.includes(payment_method.trim())){
                throw ApiError.badRequest('Invalid payment method')
            }

            const allowedDeliveryCompany = ["DHL", "Inpost", "Poczta Polska"]
            if(!allowedDeliveryCompany.includes(company_name.trim())){
                throw ApiError.badRequest('Invalid delivery company')
            }

            const deliveryCompany = company_name.trim()
            const deliveryMethod = delivery_method.trim()

            if(deliveryPrices?.[deliveryCompany]?.[deliveryMethod] === undefined){
                throw ApiError.badRequest("The company does not provide that delivery method")
            }


            const newOrder = await sequelize.transaction(async (transaction) => {
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

                const basketItems = await Basket_Item.findAll({
                    where: {
                        basketId: basket.id
                    },
                    include: [
                        {
                            model: Product,
                            as: 'basketProduct'
                        }
                    ],
                    transaction
                })

                if (!basketItems.length) {
                    throw ApiError.badRequest("You don't have any items in basket")

                }

                const lockedProducts = new Map()

                const sortedProducts = [...basketItems].sort((a, b) => a.productId - b.productId)

                for(const item  of sortedProducts) {
                    const product = await Product.findByPk(item.productId,
                        {
                            transaction,
                            lock: transaction.LOCK.UPDATE
                        }
                    )
                    if(!product){
                        throw ApiError.badRequest(`Product ${item.productId} does not exist`)
                    }
                    if(item.quantity > product.stock){
                        throw ApiError.badRequest(`Not enough stock for ${product.name}`)
                    }
                    lockedProducts.set(product.id, product)
                }


                const subTotal = basketItems.reduce((sum, item) => {
                    const product = lockedProducts.get(item.productId)
                    return (
                        sum +
                        Number(product.price) * item.quantity
                    )
                }, 0)

                const deliveryPrice = deliveryPrices[deliveryCompany][deliveryMethod]

                const totalPrice = Number((subTotal + deliveryPrice).toFixed(2))

                const order = await Order.create(
                    {
                        userId: req.user.id,
                        status: 'Created',
                        first_name: firstName.trim(),
                        last_name: lastName.trim(),
                        email: email.trim(),
                        phone: phone.trim(),
                        payment_method: payment_method.trim(),
                        payment_status: 'Unpaid',
                        creation_date: new Date(),
                        total_price: totalPrice
                    },
                    { transaction }
                )

                const delivery = await Delivery.create(
                    {
                        company_name: company_name.trim(),
                        delivery_address: delivery_address.trim(),
                        delivery_method: delivery_method.trim(),
                        delivery_price: deliveryPrice,
                        orderId: order.id
                    },
                    { transaction }
                )

                const orderItems = basketItems.map(item => {
                    const product = lockedProducts.get(item.productId)
                    return{
                        orderId: order.id,
                        productId: item.productId,
                        quantity: item.quantity,
                        price: product.price
                    }
                })

                await Order_item.bulkCreate(orderItems, {
                    transaction
                })

                for (const item of basketItems) {
                    const product = lockedProducts.get(item.productId)

                    await product.decrement('stock', {
                        by: item.quantity,
                        transaction
                    })
                }

                await Basket_Item.destroy({
                    where: {
                        basketId: basket.id
                    },
                    transaction
                })


                return {
                    order,
                    orderItems,
                    delivery
                }
            })



                return res.status(201).json({
                    message: 'Order created',
                    ...newOrder
                })
            } catch (err) {
                return next(err)
            }

    }


    async updateOrder(req, res, next) {
        try {
            const {id} = req.params
            const {status} = req.body

            if (!status) {
                return next(ApiError.badRequest('Choose order status'))
            }

            const allowedStatuses = [
                'Created',
                'Processing',
                'Shipped',
                'Delivered',
                'Cancelled'
            ]

            if (!allowedStatuses.includes(status)) {
                return next(ApiError.badRequest('That status is not allowed'))
            }

            const updatedOrder = await sequelize.transaction(async (transaction) => {
                const order = await Order.findByPk(id, {
                    transaction,
                    lock: transaction.LOCK.UPDATE
                })

                if (!order) {
                    throw ApiError.notFound('Order was not found')
                }

                if (order.status === status) {
                    throw ApiError.badRequest('Order already has this status')
                }

                if (['Cancelled', 'Delivered'].includes(order.status)) {
                    throw ApiError.badRequest('Order status cannot be changed')
                }

                const allowedTransitions = {
                    Created: ['Processing', 'Cancelled'],
                    Processing: ['Cancelled'],
                    Shipped: ['Delivered']
                }

                if (!allowedTransitions[order.status]?.includes(status)) {
                    throw ApiError.badRequest('Invalid status transition')
                }

                if (status === 'Cancelled') {
                    const orderItems = await Order_item.findAll({
                        where: {orderId: order.id},
                        transaction,
                        order: [['productId', 'ASC']]
                    })

                    for (const item of orderItems) {
                        await Product.increment('stock', {
                            by: item.quantity,
                            where: {id: item.productId},
                            transaction
                        })
                    }
                }

                order.status = status
                await order.save({transaction})

                return order
            })

            return res.json(updatedOrder)

        } catch (err) {
            return next(err)
        }
    }

    async cancelOrder (req, res, next){
        const {id} = req.params

        try{
            const cancelledOrder = await sequelize.transaction(async (transaction) => {
                const order = await Order.findByPk(id, {
                    transaction,
                    lock: transaction.LOCK.UPDATE
                })
                if(!order){
                    throw ApiError.badRequest("Order was not found")
                }
                if(order.userId !== req.user.id){
                    throw ApiError.forbidden("You cannot cancel this order")
                }

                if (!["Created", "Processing"].includes(order.status)) {
                    throw ApiError.badRequest("Order cannot be cancelled")
                }


                order.status = "Cancelled"

                const orderItems = await Order_item.findAll({
                    where: {orderId: order.id},
                    transaction,
                    order: [["productId", "ASC"]]
                })


                for( const item of orderItems){
                    await Product.increment('stock', {
                        by: item.quantity,
                        where: {id: item.productId},
                        transaction
                    })
                }

                await order.save({transaction})

                return order

            })

            return res.json(cancelledOrder)

        }catch(err){
            return next(err)
        }
    }

    async shipOrder (req, res, next) {
        try{
            const {id} = req.params
            const {tracking_number} = req.body

            if(typeof tracking_number !== "string" || !tracking_number.trim()){
                throw ApiError.badRequest("Tracking number is required")
            }

            const normalizedTrackingNumber = tracking_number.trim()
            if(normalizedTrackingNumber > 50){
                throw ApiError.badRequest("Tracking number must not exceed 50 characters")
            }
            const shippedOrder = await sequelize.transaction(async (transaction) => {

                const order = await Order.findByPk(id, {
                    transaction,
                    lock: transaction.LOCK.UPDATE
                })
                if(!order){
                    throw ApiError.notFound("Order was not found")
                }
                if(order.status !== "Processing"){
                    throw ApiError.badRequest('Incorrect order status')
                }
                const deliveryOrder = await Delivery.findOne({
                    where: {orderId: order.id},
                    transaction,
                    lock: transaction.LOCK.UPDATE
                })
                if(!deliveryOrder){
                    throw ApiError.notFound("Information about delivery was not found")
                }

                order.status = "Shipped"
                deliveryOrder.tracking_number = normalizedTrackingNumber

                await order.save({transaction})
                await deliveryOrder.save({transaction})

                return {
                    order,
                    deliveryOrder
                }

            })

            return res.json(shippedOrder)

        }catch(err){
            return next(err)
        }

    }

}

module.exports = new OrderController()