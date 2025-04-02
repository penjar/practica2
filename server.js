//----------------------------------------------------------------- LIBRERIAS -----------------------------------------------------------------
//importamos librerias express y body-parser
//importamos tambien crypto para generar el token
import express from 'express'
import bodyParser from 'body-parser'
import crypto from 'crypto'

//----------------------------------------------------------------- INICIALIZACION -----------------------------------------------------------------
//definimos el puerto
//definimos la aplicacion express
const PORT = 8080
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//si buscamos el recurso por defecto (http://localhost:8080/), el servidor responderá con un Hello World
app.get('/', (req, res) => {
    console.log("Server response")
    res.send('Hello World ')
    //Importante: Ejecutar res.send siempre para poder
    //completar la petición, y no dejar la conexión pendiente,
    //incluso si no se quiere enviar nada de vuelta
})

//mostramos el puerto de escucha
const server = app.listen(PORT, () => console.log("listening at localhost:"+PORT))

//definimos un objeto datos (vacío) que contendrá los recursos, usuarios y reservas. Se inicializa vacío.
let datos = {
    resources: [],
    users: [],
    bookings: []
}

//libreria para guardar los datos en un archivo
import { writeFile } from 'fs/promises'
import { readFile } from 'fs/promises'

//---------------------------------------------------------------- FUNCIONES SAVE Y LOAD-----------------------------------------------------------------
async function save() {
    const str = JSON.stringify(datos, null, 2) // Convierte recursos a JSON con formato legible
    await writeFile('datos.txt', str, 'utf8') // Guarda en datos.txt
}

async function load() {
    try {
        const str = await readFile('datos.txt', 'utf8') // Lee el archivo
        datos = JSON.parse(str) // Convierte el contenido a JSON y lo guarda en data
        //console.log('Datos cargados:', data) // Muestra los datos en consola
    } catch (error) {
        console.error('Error al cargar los datos:', error)
    }
}

const key = 'JorgeUnai' //clave para generar el token
// función para generar el token a partir del uid y la clave, utilizando el algoritmo SHA-256
function generateToken(userId){
    return crypto.createHash('sha256').update(userId+key).digest('hex')
}

function verifyToken(Token){
    const usuarioExist = datos.users.find(usuario => usuario.token === Token)
    if(usuarioExist)
        return true
    console.log("Token recibido: "+Token)
    return false
}

function authenticate(req, res, next) {
    const authorization= req.headers['authorization']
    if(!authorization)
        return res.status(401).send('Token no proporcionado')
    const token = authorization.split(' ')[1] // Extrae el token del encabezado
    if (!token) 
        return res.status(401).send('Token o UID no proporcionados')

    // Verifica el token
    if (!verifyToken(token))
        return res.status(403).send('Token inválido')

    next() // Llama al siguiente middleware o ruta

}

function isValidDate(dateObject){
    return new Date(dateObject).toString() !== 'Invalid Date';
  }


//cargamos los datos al iniciar el servidor
load()

//----------------------------------------------------------------- LOGIN -----------------------------------------------------------------
app.post('/login', (req, res) => {
    const data = req.body

    console.log("Login con uid: "+data.id)

    // Busca el usuario en la lista de usuarios
    let usuarioExist = datos.users.find(usuario => usuario.email === data.email && usuario.password === data.password)
    if(usuarioExist){
        res.send(usuarioExist.token)
    } else{
        res.send("")
    }
})

//----------------------------------------------------------------- RECURSOS -----------------------------------------------------------------

//devuelve la lista de recursos
app.get('/recursos/', (req, res) => {
    res.json(datos.resources)
})

app.put('/recursos/:rid/',authenticate, (req, res) => {
    const rid = req.params.rid
    const data = req.body
    console.log("Put recurso " + rid)
    let recursoExist = datos.resources.find(recurso => recurso.id === rid)
    if (recursoExist) {
        //actualiza el recurso existente
        recursoExist.name = data.name
        res.send("Rid : " + rid + " recurso modificado")
    } else {
        res.send("Rid : " + rid + " recurso no encontrado")
    }
    save()
})


app.post('/recursos/',authenticate, (req, res) => {
    const data = req.body
    const rid = data.rid // id recurso
    // data será un objeto JS, no hace falta parsearlo
    // y tendrá los datos que envió el cliente
    // .... resto de código de la función
    console.log("Post recurso con rid: "+ data.rid)
    let recursoExist = datos.resources.find(recurso => recurso.id === rid);
    if(!recursoExist){
        datos.resources.push({ id: rid, name: data.name })
        res.send("Rid : "+ rid + " recurso añadido")
    }else{
        res.send("Rid : "+ rid +  " recurso existente")
    }
    save()
})


app.delete('/recursos/:rid/',authenticate, (req, res) => {
    const rid = req.params.rid // id recurso
    const data = req.body
    // .... resto de código de la función
    console.log("Delete recurso "+ rid)
    let recursoExist = datos.resources.find(recurso => recurso.id === rid);
    if(recursoExist){
        datos.resources = datos.resources.filter(recurso => recurso.id !== rid)
        res.send("recurso eliminado")
    }else{
        res.send("recurso no encontrado")
    }
    save()
})

//----------------------------------------------------------------- USUARIOS -----------------------------------------------------------------

//devuelve la lista de usuarios
app.get('/usuarios/', (req, res) => {
    res.json(datos.users)
})

app.put('/usuarios/:uid',authenticate, (req, res) => {
    const uid = req.params.uid // ID del usuario
    const data = req.body
    // data será un objeto JS, no hace falta parsearlo
    // y tendrá los datos que envió el cliente
    // .... resto de código de la función
    console.log("Put usuario con uid: "+uid)
    let usuarioExist = datos.users.find(usuario => usuario.id === uid);
    if(usuarioExist){
        // Actualiza el recurso existente
        usuarioExist.email = data.email
        usuarioExist.password = data.password
        res.send("Uid : "+ uid + " usuario modificado")
    }else{
        res.send("Uid : "+ uid +  " usuario no encontrado")
    }
    save()
})

app.post('/usuarios/', (req, res) => {
    const data = req.body
    // data será un objeto JS, no hace falta parsearlo
    // y tendrá los datos que envió el cliente
    // .... resto de código de la función
    console.log(" Post usuario con uid: "+data.id)
    let usuarioExist = datos.users.find(usuario => usuario.id === data.id);
    if(!usuarioExist){
        const token = generateToken(data.id)
        datos.users.push({ 
            id: data.id, 
            email: data.email,
            password: data.password,
            token: token
        })
        res.send("Uid : "+ data.id + " usuario añadido")
    }else{
        res.send("Uid : "+ data.id +  " usuario existente")
    }
    save()
})


app.delete('/usuarios/:uid',authenticate, (req, res) => {   
    const uid = req.params.uid; // ID del usuario
    const data = req.body
    console.log("delete usuario: " + uid);

    // Busca si el usuario existe
    let usuarioExist = datos.users.find(usuario => usuario.id === uid);
    if (usuarioExist) {
        // Filtra los usuarios para eliminar el que coincide con el uid
        datos.users = datos.users.filter(usuario => usuario.id !== uid);
        res.send("Usuario " +uid+ " eliminado");
    } else {
        res.send("Usuario "+uid+ " no encontrado");
    }
    save();
})


//----------------------------------------------------------------- RESERVAS -----------------------------------------------------------------

//devuelve la lista de reservas
app.get('/bookings/', (req, res) => {
    res.json(datos.bookings)
})

app.put('/booking/:rid/:uid/:date',authenticate, (req, res) => {
    const uid = req.params.uid // id usuario
    const rid = req.params.rid // id recurso
    const date = req.params.date // fecha de la reserva
    const data = req.body
    // data será un objeto JS, no hace falta parsearlo
    // y tendrá los datos que envió el cliente
    // .... resto de código de la función
    if(!isValidDate(data.date) || !isValidDate(date)){
        res.send("Fecha no válida")
        return
    }
    let bookingExist = datos.bookings.find(booking => booking.resource === rid && booking.user === uid && booking.date === date)
    console.log("Put booking con rid: "+rid+" y uid: "+uid+ " en fecha: "+date)
    if(bookingExist){
        // Actualiza la reserva existente
        bookingExist.resource = data.rid
        bookingExist.user = data.uid
        bookingExist.date = data.date
        bookingExist.hours = data.hours
        res.send("Reserva de " +rid +" para "+uid+" modificada")
    }
    else{
        res.send("Reserva de " +rid +" para "+uid+" no encontrada")
    }
    save()
})
    
app.post('/booking/',authenticate, (req, res) => {
    const data = req.body

    if(!isValidDate(data.date)){
        res.send("Fecha no válida")
        return
    }


    let resourceExist = datos.resources.find(resource => resource.id === data.rid)
    let userVerify = datos.users.find(user => user.id === data.uid)

   if(!userVerify || userVerify.token !== data.token){
        res.send("Usuario no valido")
        return
    }

    if(!resourceExist){
        res.send("Recurso no encontrado")
        return
    }

    let bookingForResource = datos.bookings.filter(booking => booking.resource === data.rid)

    for(let booking of bookingForResource){
        const endOfBooking = booking.date + booking.hours 
        if(endOfBooking - data.date < 0){
            res.send("Reserva ya existente")
            return
        }
    }

    console.log("Post booking con rid: "+data.rid+" y uid: "+data.uid+ " en fecha: "+data.date)

    datos.bookings.push({
        resource: data.rid,
        user: data.uid,
        date: data.date,
        hours: data.hours
    })
    res.send("Reserva de " +data.rid +" para "+data.uid+" añadida")
    save()
})

app.delete('/booking/:rid/:uid/:date',authenticate, (req, res) => {
    const uid = req.params.uid // id usuario
    const rid = req.params.rid // id recurso
    const date = req.params.date // fecha de la reserva
    if(!isValidDate(date)){
        res.send("Fecha no válida")
        return
    }

    console.log("Delete booking con rid: "+rid+" y uid: "+uid+ " en fecha: "+date)
    let bookingExist = datos.bookings.find(booking => booking.resource === rid && booking.user === uid && booking.date === date);
    if(bookingExist){
        datos.bookings = datos.bookings.filter(booking => booking.resource !== rid && booking.user !== uid && booking.date !== date) 
        res.send("Reserva de "+uid+ " por "+uid+ "en fecha "+date+ " eliminado")
    }
    else{
        res.send("Reserva no encontrada")
    }
    save()
})
