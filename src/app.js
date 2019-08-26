const express = require('express')
const userRouter = require('./routers/user')

require('./db/mongoose')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)

app.get('/', (req, res) => res.send('Accessed Tile App User Service.'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))