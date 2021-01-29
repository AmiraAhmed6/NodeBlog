const express = require('express');
const app =express();
const mongoose = require('mongoose');
const authMiddleware = require('./middleware/auth');
mongoose.connect('mongodb://localhost:27017/Blog',{useNewUrlParser: true, useUnifiedTopology: true});
const blogRouter = require('./routers/blog');
const userRouter = require('./routers/user');
const commentRouter = require('./routers/comment');

app.use(express.json());

app.use('/user',userRouter)
app.use('/blog',blogRouter)
app.use('/comment',authMiddleware,commentRouter)

///testaa

app.use((err, req, res, next) => {
    res.status(503).json({"error":err.message});
  });

app.use((req, res, next) => {
    res.status(404).json({ err: 'page not found' });
 });

app.listen(9000,()=>{
    console.log('App is ready on: ' , 9000);
})