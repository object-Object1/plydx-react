// const EmailValidator = require('isemail')
const express = require('express')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const { User } = require('../model/userSchema')
require('dotenv').config()
const app = express()
app.use(cookieParser())


function authMiddleware(req, res, next){
    //user lodash for faster manipulation
    // console.log(req)
    const cookie = req.cookies
    console.log("cookie", cookie)
    if(Object.keys(cookie).length > 0){
        const token = cookie.jwt
        console.log("token",token)
        if(token){
            jwt.verify(token, process.env.PRIVATE_JWT_KEY , async(err, decoded) => {
                const user = await User.findOne({_id: decoded.id})
                console.log("user", user)
                req.user = user
                req.loginStatus = true
                next()
            })
        }
        
        else{
            // next()
            res.status(401).send('Unauthenticated credential')
        }
        // console.log(token)
    }
    else{
        next()
        // res.redirect('/login')
        //should ideally be a login
    }
}


// module.exports = validation
module.exports = authMiddleware
// authMiddleware()