/* 
    Name: User Routes
    Created by: Adolfo Herrera
    Created on: July 6, 2019
    Last Updated: July 16, 2019
    Purpose: Serves as the routes to get,post,update for user User collection

    //TODO: Getting all users from database might not be required. Think of removing.
*/
const express = require('express')
const router = new express.Router
const User = require('../models/user')
const auth = require('../middleware/auth')

// Route to POST a new user to database
router.post('/users', async (req,res) => {
    const user = new User(req.body)
    
    try {
        await user.save()
        const token = await user.generateAutoToken()
        res.status(201).send({user, token})
    } catch (error) {
        res.status(404).send(error)
    }
})

// Route to POST login user
router.post('/users/login', async (req,res) => {
    try{
        const user = await User.findByCredentials(req.body.username,req.body.password)
        const token = await user.generateAutoToken()
        res.send({user , token})
    } catch(e) {
        res.status(401).json({
            error: 'Failed to log in!'
        })
    }
})

// Route to GET all users in database
router.get('/users', auth, async (req,res) => {
    try {
        const users = await User.find()
        res.send(users)

    }catch(error) { 
        res.send({error:'bull'})
    }
})

// Route to POST logout a user
router.post('/users/logout', auth, async (req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch(e){
        res.status(500).send()
    }
})

module.exports = router