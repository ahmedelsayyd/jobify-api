const { validationResult } = require('express-validator');
const {BadRequestError} = require('../errors')


const checkValidaty = (validations) =>{

    return async (req,res, next)=>{

        // await Promise.all(validations.map(validation => validation.run(req)))
        // const error = validationResult(req)

        // if(!error.isEmpty()) throw new BadRequestError('username or email is not valid')

        next()
        
    }
}



module.exports ={
    checkValidaty
}