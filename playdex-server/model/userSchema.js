const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
	username: {type: String},
	email: {
		type: String,
		min: 2,
		max: 25
	},
	password: {
		type: String,
		min:6,
	},

})

const User = mongoose.model('User', userSchema)


module.exports.userSchema = userSchema
module.exports.User = User
// module.exports = User


// autoUserName = function (email) {
//     var username = email.split('@')[0];
//     return 'g/' + username;
// }
