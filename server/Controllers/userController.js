const ApiError = require('../error/ApiError')
const {User} = require('../models/models')
const {Basket} = require('../models/models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const generateJWT = (id, role, email) =>{
    return jwt.sign(
        {id, role, email},
        process.env.SECRET_KEY,
        {expiresIn: '5h'}
    )
}

class userController {
    async login(req, res, next){
        const {email, password} = req.body
        const user = await User.findOne({where: {email}})
        if(!user){
            return next(ApiError.badRequest('There is no user with this email'))
        }
        const comparePassword = await bcrypt.compare(password, user.password)
        if(!comparePassword){
            return next(ApiError.badRequest('Wrong password'))
        }
        const token = generateJWT(user.id, user.role, user.email)
        console.log('NEW LOGIN TOKEN:', token)
        console.log('DECODED NEW TOKEN:', jwt.decode(token))
        return res.json({token})
    }

    async registration(req, res, next) {
        const {email, password} = req.body
        if (
            !email || !password) {
            return next(
                ApiError.badRequest(
                    'Email and password are required'
                )
            )
        }
        const candidate = await User.findOne({where: {email}})
        if(candidate){
            return next(ApiError.badRequest('There is already a user with this email'))
        }
        const hashPassword = await bcrypt.hash(password, 5)
        console.log('1. Before User.create')

        const user = await User.create({email, password: hashPassword})

        console.log('2. User created', user.id)

        await Basket.create({userId: user.id})

        console.log('3. Basket created')

        const token = generateJWT(user.id, user.role, user.email)

        console.log('4. Token created')

        return res.json({token})

    }

    async check(req, res, next) {
        try{
            const token = generateJWT(req.user.id, req.user.role, req.user.email)
            return res.json({token})
        }catch(e){
            next(ApiError.badRequest(e.message))
        }
    }
}

module.exports = new userController()