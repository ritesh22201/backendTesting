const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    device : {type : String, enum : ['Mobile', 'Tablet', 'Laptop'], required : true},
    no_of_comments : {type : Number, required : true},
    userID : {type : mongoose.Schema.Types.ObjectId, ref : 'user', required : true}
}
)

const PostModel = mongoose.model('post', postSchema);

module.exports = PostModel;