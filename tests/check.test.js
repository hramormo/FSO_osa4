const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const listHelper = require('../utils/list_helper')
const supertest = require('supertest')
const app = require('../app')


test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
})

const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

const noBlogs = []

const blogs = [
    {
      _id: "5a422a851b54a676234d17f7",
      title: "React patterns",
      author: "Michael Chan",
      url: "https://reactpatterns.com/",
      likes: 7,
      __v: 0
    },
    {
      _id: "5a422aa71b54a676234d17f8",
      title: "Go To Statement Considered Harmful",
      author: "Edsger W. Dijkstra",
      url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
      likes: 5,
      __v: 0
    },
    {
      _id: "5a422b3a1b54a676234d17f9",
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
      __v: 0
    },
    {
      _id: "5a422b891b54a676234d17fa",
      title: "First class tests",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
      likes: 10,
      __v: 0
    },
    {
      _id: "5a422ba71b54a676234d17fb",
      title: "TDD harms architecture",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
      likes: 0,
      __v: 0
    },
    {
      _id: "5a422bc61b54a676234d17fc",
      title: "Type wars",
      author: "Robert C. Martin",
      url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
      likes: 2,
      __v: 0
    }  
  ]



describe('total likes', () => {


   
  
    test('when list has only one blog equals the likes of that', () => {
      const result = listHelper.totalLikes(listWithOneBlog)
      assert.strictEqual(result, 5)
    })

    test('of empty list is zero', () => {
        const result = listHelper.totalLikes(noBlogs)
        assert.strictEqual(result, 0)
    })

    test('of a bigger list is calculated correctly', () => {
        const result = listHelper.totalLikes(blogs)
        assert.strictEqual(result, 36)
    })
  })

describe('most liked', () => {
    test('when list has only one blog, return that blog', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        assert.deepStrictEqual(result, {title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra', likes: 5})
    })
    test('of empty list is an error message', () => {
        const result = listHelper.favoriteBlog(noBlogs)
        assert.strictEqual(result, 'array was empty')
    })

    test('of a bigger list results in the most liked blog', () => {
        const result = listHelper.favoriteBlog(blogs)
        assert.deepStrictEqual(result, {title: "Canonical string reduction",
        author: "Edsger W. Dijkstra", likes: 12})
    })
})

describe('most blogs', () => {
  test('when list has only one author, return that author', () => {
  const result = (listHelper.mostBlogs(listWithOneBlog))
  assert.deepStrictEqual(result, { author: 'Edsger W. Dijkstra', blogs: 1 })
})
test('of empty list is an error message', () => {
  const result = (listHelper.mostBlogs(noBlogs))
  assert.strictEqual(result, 'array was empty')
})
test('of a bigger list returns correct author and blogcount', () => {
  const result = (listHelper.mostBlogs(blogs))
  assert.deepStrictEqual(result, { author: 'Robert C. Martin', blogs: 3 })
})
})
describe('most likes', () => {
  test('when list has only one author, return that author and likecount', () => {
    const result = (listHelper.mostLiked(listWithOneBlog))
    assert.deepStrictEqual(result, {author: "Edsger W. Dijkstra", likes: 5 })
  })
  test('of empty list is an error message', () => {
    const result = (listHelper.mostBlogs(noBlogs))
    assert.strictEqual(result, 'array was empty')
  })
  test('of a bigger list returns correct author and their total likes', () => {
    const result = (listHelper.mostLiked(blogs))
    assert.deepStrictEqual(result, {author: "Edsger W. Dijkstra", likes: 17 })
  })
})

after(async () => {
  await mongoose.connection.close()
})
