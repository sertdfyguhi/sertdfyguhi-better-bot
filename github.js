const fetch = require('node-fetch')

async function user(user) {
  const res = await fetch('https://api.github.com/users/' + user)
  return res
}

async function repo(user, repo) {
  const res = await fetch(`https://api.github.com/repos/${user}/${repo}`)
  return res
}

module.exports = {
  user: user,
  repo: repo
}