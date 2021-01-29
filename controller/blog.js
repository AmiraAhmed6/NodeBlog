const Blog  = require('../model/blog');

const createBlog = ( newBlog )=> Blog.create(newBlog);
const editBlog = ( id , myBlog )=> Blog.findByIdAndUpdate(id,myBlog,{new:true});
const getAll=_=>Blog.find().sort({createdAt: 'desc'});
const deleteBlog =(id) => Blog.findByIdAndDelete(id);
const search=(name)=>Blog.find({$or:[{author:name.author},{title:name.title},{tags:name.tag}]});
const getByUserId=(id)=>Blog.find({author:id}).exec();



module.exports={
    createBlog,
    editBlog,
    getAll,
    deleteBlog,
    search,
    getByUserId
  }

