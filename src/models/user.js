/* 
    Name: User Model
    Created by: Adolfo Herrera
    Created on: July 6, 2019
    Last Updated: July 16, 2019
    Purpose: File represents the schema for Users data being stored in MongoDB
*/
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true
            
        },
        password: {
            type: String,
            required: true,
            minlength: 7,
            trim: true,
            validate(value) {
                if(value.toLowerCase().includes('password')){
                    throw new Error('Password cannont contain "password"')
                }
            }
        },
        tokens: [{
            token: {
                type: String,
                required: true
            }
        }]
    },
    {
        timestamps: true
    }
)

userSchema.methods.generateAutoToken = async function() {
    const user = this
    const token = jwt.sign({_id: user._id.toString()},process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (username, password) => {
    const user = await User.findOne({username})

    if (!user) {
        throw new Error('Unable to login: Cant locate email')
    }

    const hashPassword = await bcrypt.compare(password,user.password)

    if (!hashPassword) {
        throw new Error('Unable to login: incorrect password')
    }

    return user
}

userSchema.pre('save', async function(next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

const User = mongoose.model('User',userSchema)
module.exports = User