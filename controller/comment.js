
const Comment  = require('../model/comment');

const createComment = ( newComment )=> Comment.create(newComment);
const editComment = ( id , myComment )=> Comment.findByIdAndUpdate(id,myComment,{new:true});
const deleteComment =(id) => Comment.findByIdAndDelete(id);
const getComment=(id)=>Comment.find({blog:id}).exec();


module.exports={
    createComment,
    editComment,
    deleteComment,
    getComment
  }

