const express = require("express")
const router = express.Router()
const User = require('../models/model')
const controler = require('../RouterControler/controler')
const path = require('path')

router.get('/loginProfe',(req,res)=>{
    res.render('loginProfe',{error:false})
})





module.exports = router