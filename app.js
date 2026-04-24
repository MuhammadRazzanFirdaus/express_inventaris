const express = require('express')
const app = express()
const port = 3000

const db = require("./models")
db.sequelize.authenticate()
// cek koneksi model - migration - proyek sequelize
.then(() => console.log("Database (model) terkoneksi"))
.catch((error) => console.error(error))

app.get('/', (req, res) => {
  res.send('Hello!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})