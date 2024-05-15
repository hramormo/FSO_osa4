require('dotenv').config()
const mongoose = require('mongoose')

/*if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}*/

const password = process.env.PASSWORD

const url =
  `mongodb+srv://sekinviela:${password}@fsocluster.xrv5cqh.mongodb.net/testBloglist?retryWrites=true&w=majority&appName=FSOcluster`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const blogSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
})

const Blog = mongoose.model('Blog', blogSchema)

const blog = new Blog({
  title: "Go To Statement Considered Harmful",
  author: "Edsger W. Dijkstra",
  url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
  likes: 5,
})

blog.save().then(result => {
  console.log('blog saved!')
  mongoose.connection.close()
})

