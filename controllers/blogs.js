const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')




blogsRouter.get('/', async (request, response) => {

    const blogs = await Blog.find({}).populate('user', {username:1,name:1})
    
    response.json(blogs)
  })

  blogsRouter.put('/:id', async (request, response) => {
    const body = request.body
  
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    }
  
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(updatedBlog)
  })
  
blogsRouter.post('/', async (request, response) => {
  const body = request.body
  
  const decodedToken = jwt.verify(request.token, process.env.SECRET)

  if (!decodedToken.id) {
    return response.status(401).json({error: 'token invalid'})
  }

  const user = await User.findById(decodedToken.id)

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'missing title or url' })}

    const backupUsers = await User.find({})

  
  const blog = new Blog ({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id || backupUsers[0].id
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
      })

      blogsRouter.get('/:id', async (request, response) => {
        const blog = await Blog.findById(request.params.id)
        if (blog) {
          response.json(blog)
        } else {
          response.status(404).end()
        }
      })
      
      blogsRouter.delete('/:id', async (request, response) => {
        
        const token = jwt.verify(request.token, process.env.SECRET)
        const user = await User.findById(token.id)
        const blog = await Blog.findById(request.params.id)
        console.log('comparing ', blog.user._id.toString(), ' and ', user._id.toString())
        if (blog.user._id.toString() === user._id.toString()){
          console.log('trying to delete ', request.params.id)
          await Blog.findByIdAndDelete(request.params.id)
          response.status(204).end()
        } else {
          return response.status(401).json({error: 'Only the owner can delete this blog'})
        }
      })
      

  

  module.exports = blogsRouter