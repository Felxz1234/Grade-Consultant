const User = require('../models/model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Link = require('../models/model2')
var nome  = ''
var token = ''



const informations = async (req,res)=>{

    let nomeSala = req.body.nome

    let aluno = await User.findOne({nome:nome})

    let nomeProf = aluno.profe

    let Prof = await User.findOne({nome:nomeProf})

    let link = ''

    for(let v of Prof.video){
        if(v.NomeVideo == nomeSala){
            link = v.sala
        }
        
    }

    res.render('aula',{link:link})

}

const linkAula = async (req,res)=>{

    let nomeL = req.body.nome
    let link = req.body.link


    let nl = {NomeVideo:nomeL,sala:link}
    

    let updateLink = await User.updateOne({nome:nome},{$push:{video:nl}})

    res.render('video',{nome:nomeL})

}

const aula = async (req,res)=>{
    let nomeS = req.body.nome
    res.render('video',{nome:nomeS})
    
}

const chatBr = async (req,res)=>{

    let prof = await User.findOne({nome:nome})

    let pf = prof.salas

    let peoples = {}

    res.render('chat',{nome:nome})
}

let DeleteSala = async (req,res)=>{
    
    const prof = await User.findOne({nome:nome})
    
    let update = await User.updateOne({nome:nome},{$set:{salas:Array}})

    for(let a of prof.salas){
       for(let sa of a.sala){
        let update = await User.updateOne({nome:sa.nome},{$set:{salas:Array}})
       }
           
    }

    for(let s of prof.salas){

        for(let sa of s.sala){
            if(s.NomeDaSala == req.body.NomeSala){
                let update2 = await User.updateOne({nome:sa.nome},{$push:{salas:Array}})
            }else{
                let sala1 = {NomeDaSala:s.NomeDaSala,sala:[{}]}
                sala1.sala.push(s.sala)
                let update2 = await User.updateOne({nome:sa.nome},{$push:{salas:sala1}})

            }
        }

        if(s.NomeDaSala == req.body.NomeSala){
             let update2 = await User.updateOne({nome:nome},{$push:{salas:Array}})

        }else{
            let sala1 = {NomeDaSala:s.NomeDaSala,sala:[{}]}
            sala1.sala.push(s.sala)
            let update2 = await User.updateOne({nome:nome},{$push:{salas:sala1}})

        }
       
    }
   
    res.render('areaProfessor',{alunos:prof.alunos,salas:prof.salas})
    
}

let CriarSala = async (req,res)=>{

    let nomes = [req.body.name]



    try {

        let nomeSala = req.body.salas

        let sala1 = {NomeDaSala:nomeSala,sala:[{}]}

        for(let n of nomes){
        
            let IdUser = await User.findOne({nome:n})
        
            sala1.sala.push(IdUser)
        
        }

        for(let n of nomes){
            
            console.log(n)
            let upas = await User.updateOne({nome:n},{$push:{salas:sala1}})
            console.log(upas)
        }

        let updateProf = await User.updateOne({nome:nome},{$push:{salas:sala1}})
        let prof2 = await User.findOne({nome:nome})
        res.render('areaProfessor',{alunos:prof2.alunos,salas:prof2.salas})

    } catch (error) {
        if(error){
            res.send('digite um nome para a sua sala ou selecione pelo menos um aluno')
            console.log(error)
        }
    }
    
   
    
    
    
}

let AddAluno = async (req,res)=>{

         try {
            const IdUser = await User.findOne({_id:req.body.alunos})
            const IdUser2=  await User.updateOne({_id:req.body.alunos},{$set:{profe:nome}})

            let prof = await User.find({nome:nome})

            let alunos = prof[0].alunos

            let salas = prof[0].salas

            for(let a of alunos){
                if(a._id == req.body.alunos){
                    IdUser = ''  
                }
            }
        
            let prof2 = await User.updateOne({nome:nome},  {$push:{alunos:IdUser}})
            res.render('areaProfessor',{alunos:alunos,salas:salas})
            
         } catch (error) {
            res.send('insira um id correto e verifique se o campo esta vazio, ou verifique se voce nao repitiu o id')
         }
    
}

const showLinks = async (req,res)=>{
    try{
        let links = await Link.find({})
        res.render('atividades',{links:links})
    }catch(error){
        res.send(error)
    }
}

let upload = async (req,res)=>{
    const link = new Link({
        link: req.body.link
    })
    try {
        const savedLink = await link.save()
        res.render('areaProfessor',)
    } catch (error) {
        res.send(error)
    }
}


let register = async (req,res)=>{
    const EmailUser = await User.findOne({email:req.body.email})
    if(EmailUser){
       return res.status('400').render('registerAluno',{error:'email já existente'})
    }

    let adminAcces = req.body.admin

    if(adminAcces == 'professor'){
        adminAcces = true
    }else if(adminAcces == "aluno"){
        adminAcces = false
    }else{
        res.send('digite professor ou aluno')
    }

    const user = new User({
        nome: req.body.nome,
        sobrenome:req.body.sobrenome,
        email:req.body.email,
        senha: bcrypt.hashSync(req.body.senha),
        senha2: bcrypt.hashSync(req.body.senha2),
        admin: adminAcces
    })
    if(req.body.senha == req.body.senha2){
            try {
                if(adminAcces == true){
                    let SavedUser = await user.save()
                    res.render('loginProfe',{error:{}})
                }else if(adminAcces == false){
                    let SavedUser = await user.save()
                    res.render('loginAluno',{error:'insira suas credenciais'})
                }
               
            } catch (error) {
                res.status(400).render('registerAluno',{error:'insira todos os campos'})
            }

    }else{
        res.status(400).render('registerAluno',{error:'coloque a mesma senha '})
    }
   
}

let login = async (req,res)=>{
    const EmailUser = await User.findOne({email:req.body.email})
    if(!EmailUser){
      return res.status(400).render('loginAluno',{error:'email ou senha incorreto'})
    } 

    if(EmailUser.admin == true){
        return res.status(401).render('loginAluno',{error:'professores não podem entrar na area dos alunos'})
    }

    const match = bcrypt.compareSync(req.body.senha,EmailUser.senha)
    

    if(!match){
        return res.status(400).render('loginAluno',{error:'email ou senha incoreto'})
    } 
    
    token = jwt.sign({_id:EmailUser._id,admin:EmailUser.admin},process.env.SECRET)
    nome = EmailUser.nome
    res.header('authentication',token)

    let salas = EmailUser.salas

    res.render('logged',{aluno:EmailUser,salas:salas})
   

}


let loginAdmin = async (req,res)=>{

    

    const EmailUser = await User.findOne({email:req.body.email})


    if(!EmailUser){
        return res.status(400).render('loginProfe',{error:'email ou senha incorreto'})
    } 

    if(EmailUser.admin == false){
        return res.status(400).render('loginProfe',{error:'alunos não podem entrar na area do professor'})
    }

    const match = bcrypt.compareSync(req.body.senha,EmailUser.senha)

    if(!match){
        return res.status(400).render('loginProfe',{error:'email ou senha incorreto'})
    } 
   
    token = jwt.sign({_id:EmailUser._id,admin:EmailUser.admin},process.env.SECRET)
    nome = EmailUser.nome
    nomeProf = EmailUser.nome

    res.header('authentication',token)

    let professor = await User.find({nome:nome})

    let salas = EmailUser.salas

    let alunos = EmailUser.alunos

    res.render('areaProfessor',{alunos:alunos,salas:salas})

}

let mostrar = async (req,res)=>{
    try {
        let professor = await User.findOne({nome:nome})

        let alunos = professor.alunos

        res.render('mostrar',{alunos:alunos})
       
    } catch (error) {
        res.send(error)
    }
}

let update = async (req,res)=>{

    let aluno = {}
    aluno.portugues = req.body.portugues
    aluno.matematica = req.body.matematica
    aluno.ciencias = req.body.ciencias
    aluno.filosofia = req.body.filosofia

    if(!aluno) return res.status(400).send('erro')

    try {
        let Aluno = await User.updateOne({nome:req.body.nome},aluno)
        res.redirect('/allAlunos')
    } catch (error) {
        return res.status(400).send(error)
    }
}

const insertToken = (req,res,next)=>{
    try {
        if (token == '') return res.status(401).send('Acesso Negado, faça o login')
        res.header('authentication',token)
        next()
    } catch (error) {
        console.log(error)
    }
    
}


let verifyToken = (req,res,next)=>{
    // const token = req.header('authentication')
    if(!token) return res.status(400).send("logue com sua conta do professor")

    try {
        const userVerified = jwt.verify(token,process.env.SECRET)
        req.user = userVerified
        next()
    } catch (error) {
        response.status(401).send('access denied')
    }
}

let verifyAdmin = async (req,res,next)=>{
    if(req.user.admin == false){
        res.send('esse dado só pode ser visto pelo professor')
    }
    next()
}

let logout = (req,res)=>{
    try {
        token = ''
        res.redirect('/')
    } catch (error) {
        res.send(error)
    }
}


let AlunNota = async (req,res)=>{
    
    let nome = req.body.nome

    let Aluno = await User.findOne({nome:nome})

    res.render('notaAluno',{aluno:Aluno})

}

module.exports = {
    AlunNota,
    register,
    linkAula,
    CriarSala
    ,DeleteSala
    ,AddAluno,
    upload,login,
    showLinks,
    loginAdmin,
    mostrar,
    update,
    chatBr,
    verifyToken,
    insertToken,
    verifyAdmin,
    logout,
    aula,
    informations
    }