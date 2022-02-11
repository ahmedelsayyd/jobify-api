const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError, NotFoundError } = require('../errors')



const register = async (req, res, next)=>{

    const createUser = await User.create({...req.body})
    const  token = await createUser.generateToken()

    const user={
        "name": {
            "firstName": createUser.name.firstName,
            "lastName": createUser.name.lastName,
        },
        "fullName": user.fullName,
        "country": createUser.country,
        "email": createUser.email
    }

    res.status(StatusCodes.CREATED).json({ user, token })

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
    res.status(StatusCodes.OK).json({
        user: {
            "name": {
                "firstName": user.name.firstName,
                "lastName": user.name.lastName,
            },
            "fullName": user.fullName,
            "country": user.country,
            "email": user.email
        }, 
        token })
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