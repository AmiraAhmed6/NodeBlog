const userController = require('../controller/user');
const express=require('express');
const Blog  = require('../model/blog');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../model/user');
const upload = require('../middleware/uploadImage');

// register new user
router.post('/register',(req,res,next)=>{
  upload(req, res, async function (err) {
    const {file}=req
    if(file){
      req.body.img=file.filename
    }
    try{
      const result=  await userController.createUser(req.body);
      res.json(result)
  }catch(e){
      next(e);
  }
   })
});

// login

router.post('/login',async(req,res,next)=>{
    const userData = req.body;
    try{
        const data=  await userController.login(userData);
       // const posts= await userController.getUserPosts(result._id);
        res.json({data})
    }catch(e){
        next(e);
    }
});
 
 

  // follow
 router.post('/follow',authMiddleware,async (req,res,next) => {
    const {id}= req.body
  try{
      if(id==null){
          return res.json({'msg':"No Id choosen"})
      }
      if (req.user._id == id) {
           return res.status(400).json({ alreadyfollow : "You cannot follow yourself"})
        } 
         const isFollow = await User.findById(req.user.id).then(currentUser=>
         currentUser.following.find(rr=>rr._id==id));
         if(isFollow){
           return res.json({"msg":"you are already follow this"})}
         else{
         
          await  User.findByIdAndUpdate(req.user._id,{$push:{following:id}}).then(
              User.findByIdAndUpdate(id,{$push:{followers:req.user._id}}).then( res.json({"data":'follow success'})) 
            )
        }   
   }
      catch(e){
          next(e);
        }
})

  // unfollow
  router.post('/unfollow',authMiddleware,async (req,res,next) => {
    const {id}= req.body
  try{
      if (req.user._id == id) {
           return res.status(400).json({msg:"you can't make this action for your self"})
        } 
         const isFollow = await User.findById(req.user.id).then(currentUser=>
         currentUser.following.find(rr=>rr._id==id));
         if(!isFollow){
           return res.json({"msg":"you aren't follow this so action not valid "})}
         else{
         
          await  User.findByIdAndUpdate(req.user._id,{$pull:{following:id}}).then( 
           await   User.findByIdAndUpdate(id,{$pull:{followers:req.user._id}})).then( res.json({"data":'unfollow success'}))
        }   
   }
      catch(e){
          next(e);
        }
})



// get users  
router.get('/getAll',authMiddleware,async(req , res ,next)=>{
    try{
        const result = await   userController.getAll();
        
        res.json({data:result});  
      }
       catch(e){
       next(e);
       } 

 });

 // get one by id  (see other profiles)
router.get('/get/:id',authMiddleware,async(req , res ,next)=>{
 const {id}=req.params;
    try{
        const found    = await User.findById(id);
        if(found){
        const result = await userController.getOne(id);
        const Blogs= await userController.getUserPosts(id);
        res.json({result,Blogs})
        }
        return res.json({'msg':'id is invalid'})
      }
       catch(e){
       next(e);
       } 
 });


 // get author Blogs that i follow 

 router.get('/getfollowed',authMiddleware,async(req,res,next)=>{
     
        userId = req.user.id;
       try{
         
        const {following} =   await  User.findById(userId);
        
        const Blogs =await Blog.find({author:{$in:following}});
        
        res.json({"data":Blogs});
       }
      catch(e){
        next(e)
      }
 })

// search by name of user    
router.get('/getUsers',authMiddleware,async(req,res,next)=>{
 
  try{
    const users =   await  User.find({Name:req.query.name});
    res.json({"data":users});
  }catch(e){
   next(e);
  }
})

module.exports=router;