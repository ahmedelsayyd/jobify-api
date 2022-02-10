const mongoos = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoos.Schema({

    name:{
        firstName:{
            type: String,
            required: [true, 'please provide first name'],
            maxlength: 50,
            minlength: 3,
        },
        lastName:{
            type: String,
            required: [true, 'please provide last name'],
            maxlength: 50,
            minlength: 3,
        }
    },

    country:{
        type: String,
        required: [true, 'please provide your country']
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        match: [
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          'Please provide a valid email',
        ],
        unique: true,
    },

    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
    }
})


UserSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.generateToken = function(){
    return jwt.sign({userId: this._id, name: this.name}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME})
}

UserSchema.methods.comparePassword = async function(canditatePassword){
    const isMatch =  await bcrypt.compare(canditatePassword, this.password)
    return isMatch
}








module.exports = mongoos.model('User', UserSchema)