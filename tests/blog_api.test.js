const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const User = require('../models/user')
const Blog = require('../models/blog')


beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
  
    await Blog.insertMany(helper.initialBlogs)
  })
  

describe('correct amount of blogs are returned in json', () => {



    test('blog info is JSON', async () => {
      await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      })
    
    test('there are 6 blogs', async () => {
        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body.length, 6)
      })
    })
  test('identifying field is called id', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.every(blog => blog.hasOwnProperty('id')), true)
})
describe('adding blogs works correctly', async () => {



test('a blog can be added', async () => {
     const newBlog = {
        title: 'testing if a new blog can be added',
         author: 'Test User',
         url: 'testurl',
         likes: 0
        }
        await User.deleteMany({})

        await api
        .post('/api/users')
        .send(helper.testUser)
        .expect(201)
    
        const token = await api
        .post('/api/login')
        .send(helper.testUser)
        .expect(200)
    
        const authHeader = {'Authorization': `Bearer ${token.body.token}`}


        
        await api
        .post('/api/blogs')
        .send(newBlog)
        .set(authHeader)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')

        const titles = response.body.map(r => r.title)

        assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
        assert(titles.includes('testing if a new blog can be added'))
    })

test('if an added blogs likes are not set, default to zero', async () => {
    const newBlog = {
        title: 'testing if likes default to zero if not set',
         author: 'Test User',
         url: 'testurl',

        }

        await User.deleteMany({})

        await api
        .post('/api/users')
        .send(helper.testUser)
        .expect(201)
    
        const token = await api
        .post('/api/login')
        .send(helper.testUser)
        .expect(200)
    
        const authHeader = {'Authorization': `Bearer ${token.body.token}`}

        await api
        .post('/api/blogs')
        .send(newBlog)
        .set(authHeader)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const result = await api.get('/api/blogs')

        assert(result.body.every(blog => 'likes' in blog))
})
})
describe('if a blog entry is missing critical fields, respond 400', async () => {
    let authHeader
    beforeEach(async () => {
     

        await User.deleteMany({})

        await api
        .post('/api/users')
        .send(helper.testUser)
        .expect(201)
    
        const token = await api
        .post('/api/login')
        .send(helper.testUser)
        .expect(200)
    
        authHeader = {'Authorization': `Bearer ${token.body.token}`}
    })
    test('if a blog has no title field, respond 400', async () => {
        const newBlog = {
            author: 'Testerman',
            url: 'testurl',
            likes: 0  
        }


        await api
        .post('/api/blogs')
        .send(newBlog)
        .set(authHeader)
        .expect(400)
    })
    test('if a blog has no url field, respond 400', async () => {
        const newBlog = {
            title: 'Not A Real Blog',
            author: 'Testerman',
            likes: 0  
        }

        await api
        .post('/api/blogs')
        .send(newBlog)
        .set(authHeader)
        .expect(400)
    })
})

describe('deletion of a blog', () => {

    let authHeader
    beforeEach(async () => {
     

        await User.deleteMany({})

        await api
        .post('/api/users')
        .send(helper.testUser)
        .expect(201)
    
        const token = await api
        .post('/api/login')
        .send(helper.testUser)
        .expect(200)
    
        authHeader = {'Authorization': `Bearer ${token.body.token}`}
    })

    test('succeeds with a status code 204 if id is valid', async () => {
        const dummyBlog = {
            title: "Dummy Title",
            author: "Dummy Author",
            url: "dummyurl",
            likes: 0
        }


      
      await api
      .post('/api/blogs')
      .send(dummyBlog)
      .set(authHeader)
      .expect(201)
      .expect('Content-Type', /application\/json/)
        
      const blogs = await helper.blogsInDb()
      const blogToDelete= blogs.find(blog => blog.title === dummyBlog.title)

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set(authHeader)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

      const titles = blogsAtEnd.map(r => r.title)
      assert(!titles.includes(blogToDelete.content))
    })

    test('returns 400 if id is not valid', async () => {
        const invalidId = '5a3d5da59070081a82a3445'
        await api
        .delete(`/api/blogs/${invalidId}`)
        .set(authHeader)
        .expect(400)
    })

    test('returns 401 Unauthorized if request is valid but no token is found', async () => {
        const blogs = await helper.blogsInDb()
        const blogToDelete = blogs[0]

        await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(401)
    })
})
describe('updating a blog', () => {
test('returns 200 if update successful', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const newLikes = 42
    await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send({likes: newLikes})
    .expect(200)

})
test('returns 400 if id is not valid', async () => {
    const invalidId = '5a3d5da59070081a82a3445'
    const newLikes = 42
    await api
    .put(`/api/blogs/${invalidId}`)
    .send({likes: newLikes})
    .expect(400)
})
})

    after(async () => {
        await mongoose.connection.close()
      })

