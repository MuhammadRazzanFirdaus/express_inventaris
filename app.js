const express = require('express')
const app = express()
const port = 3000

const db = require("./models")
const methodOverride = require('method-override')
const itemRoutes = require('./routes/item.routes')
const loanRoutes = require('./routes/loan.routes')
const loginRoutes = require('./routes/login.routes')
const { checkToken } = require('./middlewares/auth')
db.sequelize.authenticate()
// cek koneksi model - migration - proyek sequelize
.then(() => console.log("Database (model) terkoneksi"))
.catch((error) => console.error(error))

// app.use : mendaftarkan routing atau config header lain , urutannya sebelum app.get
app.use(express.json()); // mengizinkan req.body format json
app.use(methodOverride("_method")); // menggunakan _method PUR PATCH DELETE
app.use('/uploads', express.static('uploads')); // agar gambar yang disimpan di folder uploads dibolehkan untuk diambil/dimunculkan dibrowser (FE)
app.use('/items', checkToken, itemRoutes); // mendaftarkan routes dan prefixnya
app.use('/loans', checkToken, loanRoutes); 
app.use('/', loginRoutes)


app.get('/', (req, res) => {
  res.send('Hello!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})