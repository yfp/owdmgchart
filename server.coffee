express = require 'express'
app = express()

app.use '/', express.static('public')

do (port = 8808) ->
  app.listen port, () ->
    console.log('Listening on port %d', port)