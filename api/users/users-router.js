const express = require('express');
const {
validateUserId,
validateUser,
validatePost,
} = require('../middleware/middleware')
// You will need `users-model.js` and `posts-model.js` both
const User = require('./users-model')
const Post = require('../posts/posts-model')
// The middleware functions also need to be required

const router = express.Router();

router.get('/', (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  User.get()
    .then(users => {
      res.json(users)
    })
    .catch(next)
});

router.get('/:id', validateUserId,(req, res) => {
  // RETURN THE USER OBJECT
  res.json(req.user)

  // this needs a middleware to verify user id
});

router.post('/', validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  User.insert({ name: req.name })
    .then(newUser => {
    
      res.status(201).json(newUser)
    })
    .catch(next)
  // this needs a middleware to check that the request body is valid
  console.log(req.name)
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  User.update(req.params.id, { name: req.name })
    .then(updatedUser => {
      res.json(updatedUser)
    })
    .catch(next)
  // this needs a middleware to verify user id
  console.log(req.user) 
  console.log(req.name)


  // and another middleware to check that the request body is valid
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  try {
    await User.remove(req.params.id)
    res.json(req.user)
  } catch (err) {
    next(err)
  }
  console.log(req.user) 

  // this needs a middleware to verify user id
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
    try { 
      const result = await User.getUserPosts(req.params.id)
      res.json(result)
    } catch (err) {
      next(err)
    }
  // RETURN THE ARRAY OF USER POSTS
  console.log(req.user) 

  // this needs a middleware to verify user id
});

router.post('/:id/posts',
   validateUserId,
    validatePost,
    async (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  try {
    const result = await Post.insert({
      user_id: req.params.id,
      text: req.text,
    })
    res.status(201).json(result)
  } catch (err) {
    next(err) 
  }
  // this needs a middleware to verify user id
  console.log('==>', req.user) 
  console.log('-->', req.text) 
  // and another middleware to check that the request body is valid
});

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    customMessage: 'Something tragic inside posts router happened',
    message: err.message,
    stack: err.stack,
  })
})
// do not forget to export the router
module.exports = router