const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((likes, blog) => {
        return likes + blog.likes}, 0)
}

const favoriteBlog = (blogs) => {
    if(blogs.length === 0) {
        return 'array was empty'
    }
    return blogs.reduce((favorite, blog) => {
        if (blog.likes > favorite.likes){
            return {
                title: blog.title,
                author: blog.author,
                likes: blog.likes
            }
        } else { return favorite }
    }, { title: "", author: "", likes: 0})


}

const mostBlogs = (blogs) => {
    if(blogs.length === 0) {
        return 'array was empty'
    }
    const blogAmount = lodash.countBy(blogs, 'author')
    const bloggiestAuthor = lodash.maxBy(Object.keys(blogAmount), author => blogAmount[author])
    
    return {
        author: bloggiestAuthor,
        blogs: blogAmount[bloggiestAuthor]
    }
}

const mostLiked = (blogs) => {
    if(blogs.length === 0) {
        return 'array was empty'
    }
    const likesByAuthor = lodash.groupBy(blogs, 'author')
    const authorLikes = lodash.mapValues(likesByAuthor, blogs => lodash.sumBy(blogs, 'likes'))
    const mostLikedAuthor = lodash.maxBy(Object.keys(authorLikes), author => authorLikes[author])
    
    return {author: mostLikedAuthor, likes: authorLikes[mostLikedAuthor]}
}



module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLiked
}