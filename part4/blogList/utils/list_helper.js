// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}
const totalLikes = (array) => {
  if (array.length === 0) {
    return 0
  }
  let sum = 0
  array.forEach(a => sum += a.likes)
  return sum
}
const favoriteBlog = (array) => {
  if (array.length === 0) {
    return null
  }
  let fav = array[0]
  array.forEach(a => {
    if (a.likes > fav.likes) {
      fav = a
    }
  })
  return {
    title: fav.title,
    author: fav.author,
    likes: fav.likes
  }
}

const mostBlogs = (array) => {
  if (array.length === 0) {
    return null
  }
    
  array.forEach(a => {
    a.count = array.filter(b => b.author === a.author).length
  })

  let temp = array[0]
  array.forEach(a => {
    if (a.count > temp.count) {
      temp = a
    }
  })
  return {
    author: temp.author,
    blogs: temp.count
  }
}

const mostLikes = (array) => {
  if (array.length === 0) {
    return null
  }
  array.forEach(a => {
    const temp = array.filter(b => b.author === a.author)
    a.totalLikes = 0
    temp.forEach(t => a.totalLikes += t.likes)
  })
  let temp = array[0]
  array.forEach(a => {
    if (a.totalLikes > temp.totalLikes) {
      temp = a
    }
  })
  return {
    author: temp.author,
    likes: temp.totalLikes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}