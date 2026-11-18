const uuid = require('uuid');
const path = require('path');
const {Product, Product_info, Product_img} = require('../models/models')
const ApiError = require('../error/ApiError')


class productController {
    async create(req, res, next) {
        try {
            let {name, price, brandId, typeId, stock, info} = req.body

            if (!req.files || !req.files.img) {
                return next(ApiError.badRequest('Images are required'))
            }

            const images = Array.isArray(req.files.img)
                ? req.files.img
                : [req.files.img]

            const product = await Product.create({
                name,
                price,
                brandId,
                typeId,
                stock
            })

            for (const img of images) {
                const fileName = uuid.v4() + path.extname(img.name).toLowerCase()

                await img.mv(
                    path.resolve(__dirname, '..', 'static', fileName)
                )

                await Product_img.create({
                    img: fileName,
                    productId: product.id
                })
            }

            if (info) {
                info = JSON.parse(info)

                for (const i of info) {
                    await Product_info.create({
                        title: i.title,
                        description: i.description,
                        productId: product.id
                    })
                }
            }

            return res.json(product)

        } catch (err) {
            next(ApiError.badRequest(err.message))
        }
    }

    async getAll(req, res) {

        let {brandId, typeId, limit, page} = req.query
        let products
        limit = limit || 10
        page = page || 1
        let offset = limit * page - limit
            if(!brandId && !typeId){
                 products = await Product.findAndCountAll({limit, offset, distinct: true, include: [
                         {model: Product_info, as: 'info'},
                         {model: Product_img}
                     ]})
            }
            if(!brandId && typeId){
                 products = await Product.findAndCountAll({where: {typeId}, limit, offset, distinct: true, include: [
                         {model: Product_info, as: 'info'},
                         {model: Product_img}
                     ]})
            }
            if(brandId && !typeId){
                 products = await Product.findAndCountAll({where: {brandId}, limit, offset, distinct: true, include: [
                         {model: Product_info, as: 'info'},
                         {model: Product_img}
                     ]})
            }
            if(brandId && typeId){
                 products = await Product.findAndCountAll({where: {brandId, typeId}, limit, offset, distinct: true, include: [
                         {model: Product_info, as: 'info'},
                         {model: Product_img}
                     ]})
            }

        return res.json(products)

    }

    async getOne(req, res) {
        const {id} = req.params

        const product = await Product.findOne({
            where: {id},
            include: [
                {model: Product_info, as: 'info'},
                {model: Product_img}
            ]
        })

        return res.json(product)
    }

}

module.exports = new productController();