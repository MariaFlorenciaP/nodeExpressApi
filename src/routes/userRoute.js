const fs  = require('fs')  // módulo File System
const { join } = require('path')       //destructuring assignment  

const filePath = join(__dirname, 'users.json')

const getUsers = () => {
    const data = fs.existsSync(filePath)  // verifica se o arquivo existe filePath
    ? fs.readFileSync(filePath)             //  se existe lee esse arquivo de maneira assincrona
    : []                                    // senao retorna o objeto vazio

    try{
        return JSON.parse(data)
    }catch(error){
        return []
    }
}

const saveUser = (users) => fs.writeFileSync(filePath, JSON.stringify(users, null, '\t'))

const userRoute = (app) =>{
    app.route('/users/:id?')
        .get((req, res) => {
            const users = getUsers()

            res.send({ users })
        })
        .post((req, res) => {
            const users = getUsers()

            users.push(req.body)  // corpo da requisicao // para pegar lo tem que usar outro middleware, o body parse
            saveUser(users)

            res.status(201).send('Ok')
        })
        .put((req, res) => {
            const users = getUsers()

            saveUser(users.map(user =>{
                if(user.id === req.params.id){
                    return {
                        ...user,
                        ...req.body
                    }
                }

                return user
            }))
            res.status(200).send('Ok')
        })
        .delete((req, res) => {
            const users = getUsers()

            saveUser(users.filter(user => user.id !== req.params.id))

            res.status(200).send('Ok')
        })
}

module.exports = userRoute
