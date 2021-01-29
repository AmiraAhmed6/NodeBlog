const mongoose  = require('mongoose');
const {Schema}= mongoose
const commentSchema = new Schema({
     text:{
         type:String,
         minlength:1,
     },
     img: String
    ,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },  
     blog: {
        type: Schema.Types.ObjectId,
        ref: 'blog',
      }, 
      createdAt: {
        type: Date,
        default: Date.now(),
      },
});

const Comment = mongoose.model('Comment',commentSchema);
module.exports=Comment;