const express = require('express')
// const mongoose = require('mongoose')
const authMiddleware = require('../middlewares/auth')
const Video = require('../model/videoSchema')
require('dotenv').config()
const { User } = require('../model/userSchema')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const db = require('../utils/connectDb')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const supertokens = require("supertokens-node")
const { middleware } = "supertokens-node/framework/express";
const Session = require("supertokens-node/recipe/session")
const ThirdParty = require("supertokens-node/recipe/thirdparty")

const { Google, Github, Apple } = ThirdParty;

supertokens.init({
    framework: "express",
    supertokens: {
        // try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.
        connectionURI: "https://try.supertokens.com",
        // apiKey: "IF YOU HAVE AN API KEY FOR THE CORE, ADD IT HERE",
    },
    appInfo: {
        // learn more about this on https://supertokens.com/docs/session/appinfo
        appName: "dex",
        apiDomain: "http://localhost:7648",
        websiteDomain: "http://localhost:10081",
        apiBasePath: "/auth",
        websiteBasePath: "/user"
    },
    recipeList: [
        ThirdParty.init({
        	signInAndUpFeature: {
                providers: [
                    // We have provided you with development keys which you can use for testsing.
                    // IMPORTANT: Please replace them with your own OAuth keys for production use.
                    Google({
                        clientId: "1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com",
                        clientSecret: "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"
                    }),
                    Github({
                        clientId: "467101b197249757c71f",
                        clientSecret: "e97051221f4b6426e8fe8d51486396703012f5bd"
                    }),
                    Apple({
                        clientId: "4398792-io.supertokens.example.service",
                        clientSecret: {
                            keyId: "7M48Y4RYDL",
                            privateKey:
                                "-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----",
                            teamId: "YWQCXGJRJL",
                        },
                    }),
                    // Facebook({
                    //     clientSecret: "FACEBOOK_CLIENT_SECRET",
                    //     clientId: "FACEBOOK_CLIENT_ID"
                    // })
                ]
            }
        }),
        Session.init() // initializes session features
    ]
});


const { MeiliSearch } = require('meilisearch')

const app = express()
const port = 3037
db()

app.use(cookieParser())
app.use(bodyParser())


// app.use(authMiddleware, function(req, res, next){
// 	next()
// })

app.use(cors({
    origin: "http://localhost:10081",
    allowedHeaders: ["content-type", ...supertokens.getAllCORSHeaders()],
    credentials: true,
}));

// app.use(middleware);




// app.use(cors({credentials: true, origin: 'http://localhost:10081'}))

app.use(function(req, res, next) {
  	res.header('Content-Type', 'application/json;charset=UTF-8')
  	res.header('Access-Control-Allow-Credentials', true)
  	res.header(
    	'Access-Control-Allow-Headers',
    	'Origin, X-Requested-With, Content-Type, Accept'
  	)
	next()
})



app.post('/video_data', authMiddleware, async(req, res) => {
	const {videoId} = req.body
	console.log(req.loginStatus)
	console.log(req.user)

	const videoObj = await Video.findOne({_id: videoId})
	res.json({
		video: videoObj,
		isLoggedIn: req.loginStatus,
		user: req.user
	})
})


//change the schema from ObjectId to type [string]

app.post('/add_comment', async(req, res) => {

	const { user, comment, videoId } = req.body
	const video = await Video.findOne({_id:videoId})
	const commentObj = {
		user_id: user._id.toString(),
		user_name: user.username,
		comment_text:comment
	}
	// video.comment.user = user._id
	// video.comment.comment_text = user._id
	video.comment.push(commentObj)
	const updatedVideo = await video.save()
})



app.get('/search', async(req, res) => {
	const { q } = req.query
	const results = await Video.find({$text: {$search: q.toString()}})
	res.json({resp:results})
})



app.post('/lit', async(req, res) => {

	const { user, videoId } = req.body
	const video = await Video.findOne({_id:videoId})
	const filtered = video.lits.filter(uid => uid === user._id.toString())
	if(filtered.length > 0){
		res.json({
			added: false,
			message: "Already exists"
		})
		console.log("oops already exists")
	}
	else{
		video.lits.push(user._id.toString())
		await video.save()
		res.json({
			added:true,
			litVideo: video._id,
			litCount: video.lits.length
		})
		console.log("added")
	}

})




app.get('/', authMiddleware, async(req, res) => {
	
	const videos = await Video.find()
	res.json({
		user:req.user,
		isLoggedIn: req.loginStatus,
		videos: videos
	})

	res.end()
})

app.post('/u/register', async(req, res) => {
	// console.log('posted')
	// res.cookie("user", "kalzo", {httpOnly:false})
	// res.end()
	const { email, password , username } = req.query
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
	const user = new User({
		username: username,
		email: email,
		password: hashedPassword
	})
	try{
		const userObj = await user.save()
		const token = jwt.sign({id: userObj.id}, process.env.PRIVATE_JWT_KEY, {
            expiresIn: 2 * 60 * 60 * 1000 * 24 * 365
        })
        res.cookie('jwt', token, {
            maxAge:2 * 60 * 60 * 1000 * 24 * 365
        }) //send cookie to client
	    // res.header('x-auth-token', token)
	    res.end()
		console.log(userObj)

	}
	catch(err){
		console.log(err.message)
	}
})



app.post('/u/login', async(req, res) => {
	// const { email, password } = req.body.data //data
	const { email, password } = req.query
	console.log(email, "email")
	console.log(password, "password")
    // res.cookie("user", "kaleb", {httpOnly:false})

	const account = await User.findOne({email: email})
	console.log("account", account)
	if(account == null){
		res.json({message: "failed"})
	}
	else{
		const match = await bcrypt.compare(password, account.password)
		console.log("ismatch", match)
		// console.log(match)
		if(match){
			const token = jwt.sign({id: account.id}, process.env.PRIVATE_JWT_KEY, {
	            expiresIn: 2 * 60 * 60 * 1000 * 24 * 365
	        })
	        console.log("token", token)
	        res.cookie('jwt', token, {
	            maxAge:2 * 60 * 60 * 1000 * 24 * 365,
	            httpOnly:false,

	        })
			// res.json({message: "success"})
			res.end()
		}
		else{
			res.json({message: "failed"})
			res.end()

		}
	}
})



app.post('/video/add/', async(req, res) => {
	const { title, description, tags, metadata, uploaded_by } = req.query
	const uploadedBy = JSON.parse(uploaded_by)
	console.log("title",uploadedBy.username)
	const userDoc = {
		name: uploadedBy.name,
		uploader_id: uploadedBy.userId.toString()
	}
	const video = new Video({
			uploaded_by: userDoc,
			title: title,
			description: description,
			tags: tags,
			video_uri: metadata
		})	
		try{
			const videoMetaData = await video.save()
			console.log(videoMetaData)
		}
		catch(e){
			console.log('video data not saved',e.message)
		}

})



app.listen(port, () => {
	console.log(`http://localhost:${port}`)
})
