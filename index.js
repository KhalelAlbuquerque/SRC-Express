const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')

const db = require('./db')

const port = 3000
var path = require('path')
const app = express()

const {User} = require('./User')  

app.use(session({secret: 'asdasdasdasd'}))
app.use(bodyParser.urlencoded({ extended: true }))
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, '/views'));

app.post('/', async (req,res) => {

    const {login, password} = req.body

    const foundUser = await User.findOne({where: {login: login}})

    if(!foundUser) return console.log("credenciais incorretas")

    const matchPassword = await bcrypt.compare(password, foundUser.password)

    if(!matchPassword) return console.log("credenciais incorretas")

    req.session.login = login

    res.redirect('/logado')
})

app.get('/logado', (req,res) => {
    if (req.session.login) {
        res.render('logado', {login: login})
    } else {
        res.redirect('/')
        console.log("Logue para acessar!")
    }
})

app.get('/', (req,res) => {
    res.render('index')
})

app.get('/cadastro',(req,res)=>{
    res.render('cadastro')
})

app.post('/cadastro',async (req,res)=>{
    const {login, password} = req.body

    const isUserRegistered = await User.findOne({where:{login: login}})

    if(isUserRegistered) return console.log("Já cadastrado")

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = {
        login, password: hashedPassword
    }

    await User.create(newUser)
    req.session.login = login
    res.redirect('/logado')

})

db.sync().then(()=>{
    app.listen(port, () => {
        console.log('servidor rodando')
    })
})