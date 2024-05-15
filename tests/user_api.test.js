const { test, after, describe, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const helper = require('./test_helper')
const bcryptjs = require('bcryptjs')
const User = require('../models/user')



describe('when there is initially one user at db', () => {

  beforeEach(async () => {
    await User.deleteMany({})
  
    const passwordHash = await bcryptjs.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'toot', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()
    console.log('users at start ', usersAtStart)
    const newUser = {
      username: 'tejngolu',
      name: 'Toni Ngo-Lundell',
      password: 'salaisempi',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    console.log('users at end ', usersAtEnd)
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()
    console.log('users before duplicate ', usersAtStart)

    const duplicateUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(duplicateUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)


    const usersAtEnd = await helper.usersInDb()
    console.log('users after adding duplicate ', usersAtEnd)
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

describe('creation of invalid users should fail', () => {
  test('return 400 and an appropriate error if username is less than 3 characters', async () => {
    const newUser = {
      username: 'cu',
      name: 'Cool User',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

      assert(result.body.error.includes('must be atleast 3'))
  })
  test('return 400 and an appropriate error if password is less than 3 characters', async () => {
    const newUser = {
      username: 'cooluser69',
      name: 'Cool User',
      password: '69',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

      assert(result.body.error.includes('must be at least 3'))
  })
})

after(async () => {
    await mongoose.connection.close()
  })