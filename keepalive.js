// uses uptime robot
const express = require('express')

const app = express()

app.get('/', (req, res) => {
  res.send('yes')
})

function keepalive(client) {
  app.listen(3000, () => {
    client.login(process.env.token)
  })
}

module.exports = keepalive