const express = require("express")
const app = express()
const server = require('http').Server(app);
const path = require('path')
const router = require('./rotas/rotas')
const mongoose = require('mongoose')
const rotaAluno = require('./rotaAluno/rotasAlunos')
const rotaProf = require('./rotaProfe/routerProfe')
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config();

mongoose.connect('mongodb://localhost/logins',(db)=>{
    console.log('conectado')
})

app.set('views',path.join(__dirname,'publico'))
app.set('view engine','ejs')
router.get('/',express.static(path.join(__dirname,'inicio')))
router.get('/get',express.static(path.join(__dirname,'chat')))

app.use(bodyParser.urlencoded({extended:true}))
app.use('/',express.json(),router)
app.use('/',rotaAluno)
app.use('/',rotaProf)

server.listen(3000)