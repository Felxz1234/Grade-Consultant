const express = require("express")
const router = express.Router()
const controler = require('../RouterControler/controler')


// router.post('/updateTarefa',controler.update)
router.post('/register',controler.register)
router.post('/upload',controler.upload)
router.post('/CriarSala',controler.CriarSala)
router.post('/AddAluno',controler.AddAluno)
router.post('/login',controler.login)
router.post('/loginAdmin',controler.loginAdmin)
router.post('/UpdateNota',controler.update)
router.get('/allAlunos',controler.insertToken,controler.verifyToken,controler.verifyAdmin,controler.mostrar)
router.get('/logout',controler.logout)
router.get('/showlinks',controler.insertToken,controler.verifyToken,controler.showLinks)
router.get('/chat',controler.insertToken,controler.verifyToken,controler.chatBr)
router.post('/deleteSala',controler.DeleteSala)
router.post('/alunNota',controler.AlunNota)
router.post('/linkAula',controler.linkAula)
router.post('/aula',controler.aula)
router.post('/informations',controler.informations)

module.exports = router