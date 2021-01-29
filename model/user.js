const mongoose  = require('mongoose');
const bcrypt = require('bcrypt');
const {Schema}= mongoose
const userSchema = new Schema({
     username:{
         type:String,
         unique:true,
         minlength:3,
         maxlength:10,
         required: [true, 'username is required']
     },
      Name:{
        type:String,
        required: [true, 'your name is required'],
        minlength:3,
         maxlength:10,
      }
     ,
     password:{
        type:String,
        required:true,
        minlength:8,
        maxlength:15,
        validate: {
            validator: function(v) {
              return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
            },
            message: props => `${props.value} it is weak password`
          },
      required: [true, 'password is required'] 
    },
    img: String,
    email:{
        type:String,
        validate: {
            validator: function(v) {
              return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
            },
            message: props => `${props.value} is not a valid email!`
          },
        required: [true, 'email is required']
    },
    following:[{
        type: Schema.Types.ObjectId,
        ref: 'user',
      
    }],
    followers:[{
      type: Schema.Types.ObjectId,
      ref: 'user',
     
  }],
    createdAt: {
        type: Date,
        default: Date.now(),
      },
},
{toJSON:{
  transform:(doc,ret,options)=>{
    delete ret.password;
     return ret;
  }
}
});


userSchema.pre('save',function(next){
  this.password = bcrypt.hashSync(this.password, 8);
  next();
});

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User',userSchema);
module.exports=User;
