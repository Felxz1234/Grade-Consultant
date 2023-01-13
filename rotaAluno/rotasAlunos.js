
const express = require("express")
const router = express.Router()
const jwt = require('jsonwebtoken')
const controler = require('../RouterControler/controler')


router.get('/loginAluno',(req,res)=>{
    res.render('loginAluno',{error:false})
})

router.get('/registerAluno',(req,res)=>{
    res.render('registerAluno',{error:false})
})


module.exports = router