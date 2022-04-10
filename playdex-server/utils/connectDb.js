const mongoose = require('mongoose')
const MONGO_URI = "mongodb+srv://kalebmd904:kbMongodb2143@cluster0.k2xmz.mongodb.net/dex?retryWrites=true&w=majority"


module.exports = function mongoDbConnect(){
	mongoose.connect(MONGO_URI).then(msg => console.log('connected'))
	.catch(err => console.log('didnt connnect:',err.message))
}

// mongoDbConnect()
// module.exports = mongoDbConnect
// myFirstDatabase