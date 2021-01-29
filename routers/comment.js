const express = require('express');
const { model } = require('mongoose');
const commentController = require('../controller/comment');
const Blog = require('../model/blog')
const router = express.Router();
const upload = require('../middleware/uploadImage');



// add comment with img or not
router.post('/add/:id',(req,res,next)=> {

    upload(req, res,  function (err) {
       Blog.findById(req.params.id).then(async r=>{   
       const {file}=req
       const {id}= req.user;
       req.body.author=id
       req.body.blog=r.id
       if(file){
         req.body.img=file.filename
       }
      try{
        result =await commentController.createComment(req.body);
        res.send(result)
       }
      catch(e){
      next(e);
      }
 }).catch(e=>next(e))})
 })




// edit comment
  
router.patch('/edit/:id',(req,res,next)=>{
    upload(req, res,  function (err) {
       const {id}= req.params
       commentController.getComment(id).then(async r=>{   
        const {file}=req
        if(file){
          req.body.img=file.filename
        }
       try{
         result =await commentController.editComment(r.id,req.body);
         res.send(result)
        }
       catch(e){
       next(e);
       }
  }).catch(e=>next(e))})


})
// delete comment

router.delete('/delete/:id',async(req,res,next)=>{
 
    const {id}= req.params
      try{
        result =await commentController.deleteComment(id);
        if(result!=null){
             res.send(result)
        }else{
            res.json({"msg":"comment not found"})
        }
      }catch(e){
          next(e)
      }

})

// get comments of one blog 
  router.get('/get/:id',(req,res,next)=>{
    const {id}= req.params
    commentController.getComment(id).then(r=>res.send(r)).catch(e=>next(e))
  })


    module.exports=router;
