const fetch = require('sync-fetch')

function user(user) {
  return fetch('https://api.github.com/users/' + user).json()
}

function repo(user, repo) {
  return fetch(`https://api.github.com/repos/${user}/${repo}`).json()
}

module.exports = {
  user: user,
  repo: repo
}