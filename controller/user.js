const User  = require('../model/user');
const Blog  = require('../model/blog');

const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const asyncSign = promisify(jwt.sign)

const createUser = newUser =>User.create(newUser);
const getUserPosts=(id)=> {
    rr=  Blog.find({author:id}).populate('blog').exec()
    return rr;
};

const getOne=id=>User.findById(id);
const login = async ({username,password})=>{
    user =await User.findOne({username}).exec()
    if (!user) {
       throw Error('UserName not exist');
    } else{
       const isVaildPass = user.validatePassword(password);
        if (!isVaildPass) {
          throw Error('UN_AUTHENTICATED');
        }
      else{
         const token = await asyncSign({
        username: user.username,
         id: user.id,
         }, 'SECRET_MUST_BE_COMPLEX', { expiresIn: '1d' });
        return {...user.toJSON(), token };
    }
   }
}

const follow = (myId,id)=>User.findByIdAndUpdate(myId,{$push:{following:id},new:true})
const getAll=_=>User.find();
module.exports={
    createUser,
    login,
    follow,
    getAll,
    getUserPosts,
    getOne,
}