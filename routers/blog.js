const express = require('express');
const blogController = require('../controller/blog');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User  = require('../model/user');
const upload = require('../middleware/uploadImage');
const Blog = require('../model/blog');
 
//get all blog 
router.get('/getAll',async(req , res ,next)=>{
    try{
        const result = await   blogController.getAll();
      res.json(result);
      }
       catch(e){
       next(e);
       } 

 });

// add add new blogItem
router.post('/add',authMiddleware,(req,res,next)=> {

  upload(req, res, async function (err) {
     const {file}=req
     const {id}= req.user;
     req.body.author=id
     if(file){
       req.body.img=file.filename
     }
    try{
      result =await blogController.createBlog(req.body).then(post=>{
             res.send({data:post});
              User.findByIdAndUpdate(id,{ $push: { Blogs: post._id } }) });
   }
    catch(e){
    next(e);
    }
    }) 
});



// edit blog
router.patch('/edit/:id',authMiddleware,async(req , res ,next)=>{
  const {id} =req.params; 
     try{
       const MyBlogs = await Blog.find({author: req.user.id});
       const isAllowedForMe  = await MyBlogs.find(e=>e._id==id);
     if(isAllowedForMe!=undefined){
      const editedBlog = await blogController.editBlog(id,req.body);
      res.json({data:editedBlog});
      
       }else{
        res.json({data:"not allowed for you this action"});
       }
       
      }
      catch(e){
        next(e);
      }
  });

// delete Blog
router.delete('/delete/:id',authMiddleware, async (req , res ,next)=>{
    const {id} =req.params; 
    try{

      const MyBlogs = await Blog.find({author: req.user.id});
       const isAllowedForMe  = await MyBlogs.find(e=>e._id==id);
       console.log(isAllowedForMe);
     if(isAllowedForMe!=undefined){
      const deletedBlog = await blogController.deleteBlog(id);
      res.json({data:deletedBlog});
    }else{
       res.json({data:"not allowed for you this action"});
     }
      }
      catch(e){
        next(e);
      }
  });


//search by name , author and tags
router.get('/search',authMiddleware,async(req , res ,next)=>{
   const dataToSearch = req.query;
    try{
        const result = await   blogController.search(dataToSearch);
        res.json({data:result});  
      }
       catch(e){
       next(e);
       } 
 });

 




module.exports=router;
