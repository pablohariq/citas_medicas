const http = require('http')
const url = require('url')
const axios = require('axios')
const {v4: uuidv4} = require('uuid')
const moment = require('moment')
const _ = require('lodash')
const chalk = require('chalk')
const fs = require('fs')

moment.locale('es')

//temas chalk
const citasconsola = chalk.bgWhite.blueBright.bold;
const servidorlevantado = chalk.bgGreen.black;

console.log(uuidv4())
// creacion de usuario
const usuarios = []
const crearUsuarios = (async (n) => { //genera 10 usuarios aleatorios y los inserta en el arreglo usuarios. Se llama al ejecutar el script.
    for (i = 1; i <= n; i++){
        const response = await axios.get("https://randomuser.me/api/")
        const {data: responseData} = response
        const {results: [datosUsuario]}= responseData
        
        const nombre = datosUsuario.name.first
        const apellido = datosUsuario.name.last
        const identificador = uuidv4().slice(0,6)
    
        const registro = {
            nombre: nombre,
            apellido: apellido,
            id: identificador,
            timestamp: moment().format('LLL')
        }
        usuarios.push(registro)
        // const registro = `Nombre: ${nombre} - Apellido: ${apellido} - ID: ${identificador} - Timestamp: ${moment().format('LLL')}\n`
        // fs.appendFile('citas.txt', registro, 'utf-8', () => {console.log("usuario registrado")})
    }
})(10)

http
.createServer((req, res) => {
    if (req.url.includes("/consultar")){
        // fs.readFile('citas.txt', (err, data) => {
        //     res.write(data)
        //     res.end()
        // })
        res.writeHead(200, {'Content-type': 'text/html; charset=utf-8'})
        _.forEach(usuarios, (usuario, indice) => {
            const formatoSalidaUsuario = `${indice + 1}. Nombre: ${usuario.nombre} - Apellido: ${usuario.apellido} - id: ${usuario.id} - Timestamp: ${usuario.timestamp}`
            res.write(`<p>${formatoSalidaUsuario}</p>`)
            console.log(citasconsola(formatoSalidaUsuario))

            
        }) //forEachRight escribirá los resultados en orden de más reciente a menos reciente
        res.end()
    }
    
})
.listen(3000, () => console.log(servidorlevantado("servidor iniciado en el puerto 3000")))