const app = require('express')
const router = app.Router()
const {body} = require('express-validator')
const {checkValidaty} = require('../middleware/check-validaty')

const {login, register, updateUser} = require('../controllers/auth')


router.post('/register', checkValidaty([body('email').isEmail()]) ,register)
router.post('/login', login)
router.patch('/user/:id', updateUser)


module.exports = router