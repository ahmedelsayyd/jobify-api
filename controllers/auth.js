const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../errors')



const register = async (req, res, next)=>{

    const user = await User.create({...req.body})
    const  token = await user.generateToken()
    res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })

}


const login = async (req, res, next)=>{
    const { email, password } = req.body

    if (!email || !password) {
        throw new BadRequestError('Please provide email and password')
    }

    const user = await User.findOne({ email })
    if (!user)  throw new UnauthenticatedError('Invalid Credentials')


    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) throw new UnauthenticatedError('Invalid Credentials')

    const token = user.generateToken()
    res.status(StatusCodes.OK).json({user, token })
}


const updateUser = async(req, res,next)=>{
    const {id: userId} = req.user;
    const user = await User.findOneAndUpdate(userId, req.body, {new: true, runValidators: true}).select('-password')

    if(!user) throw new NotFoundError(`User with id ${userId} not Found`)

    res.status(200).json({ user })
}

module.exports = {
    login, 
    register,
    updateUser
}