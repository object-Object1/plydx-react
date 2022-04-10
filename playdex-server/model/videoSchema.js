const mongoose = require('mongoose')
// import dbConnect from '../utils/dbConnector'
const { userSchema } = require('./userSchema')
// dbConnect()

const videoSchema = mongoose.Schema({
	//uploader
	uploaded_by: { name: String, uploader_id: String },
	title: {
		type: String,
		min: 2,
		max: 50
	},
	description: {
		type: String,
		min:2,
		max: 500,
		reqiured: false
	},
	tags: {type: Array, required: false},
	publication_date: {
		type:Date,
		default: Date.now
	},
	video_uri: {type: String, required: true},
	// lits: [{userId:{type:String}}],
	lits: [String],
	comment : [{
		user_id: {type: String},
		user_name: {type:String},
		comment_text: {type: String, max: 250},
		date: {type: Date, default: Date.now}
	}]

})

let Video = mongoose.model('Video', videoSchema)

//for search purposes
// videoSchema.index({title: "text", tags: "text"})
// Video.createIndexes()





module.exports = mongoose.models.Video || Video
// module.exports = mongoose.models.Video || mongoose.model('Video', videoSchema)