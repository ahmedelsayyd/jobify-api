const {UnauthenticatedError} = require('../errors')
const User = require('../models/User')
const jwt = require('jsonwebtoken')


const auth = async (req, res, next)=>{

    const header = req.headers.authorization
    if(!header || !header.startsWith('Bearer')) throw new UnauthenticatedError('Authentication invalid')

    const token = header.split(' ')[1]

    try {
        
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        const user= await User.findById(payload.userId).select('-password -__v')
        req.user = user
        // req.user = {userId: payload.userId, name: payload.name}
        next()
    } catch (error) {
        
        throw new UnauthenticatedError('Authentication invalid')
    }

}

module.exports = auth