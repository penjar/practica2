//----------------------------------------------------------------- INICIALIZACION -----------------------------------------------------------------
//librerias
import axios from 'axios'
const server = 'http://localhost:8080'

//funcion de prueba para comprobar que estamos conectados
async function testHelloWorld(){
    const result = await axios.get(server + '/')
    return result.data // el campo data contendrá el resultado
}

//----------------------------------------------------------------- LOGIN -----------------------------------------------------------------

async function loginUsuario(data){
    const resultado = await axios.post(server+'/login', data)
    return resultado.data
}

//----------------------------------------------------------------- RECURSOS -----------------------------------------------------------------

async function putRecurso(rid, data, token){
    const resultado = await axios.put(server+'/recursos/'+rid, data, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    return resultado.data
}

async function postRecurso(data,token){
    const resultado = await axios.post(server+'/recursos/', data, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    return resultado.data
}

async function deleteRecurso(rid,token){
    const resultado = await axios.delete(server+'/recursos/'+rid, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    return resultado.data
}

//----------------------------------------------------------------- USUARIOS -----------------------------------------------------------------

async function putUsuario(uid, data, token){
    const resultado = await axios.put(server+'/usuarios/'+uid, data, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    return resultado.data
}

async function postUsuario(data){
    const resultado = await axios.post(server+'/usuarios/', data)
    return resultado.data
}

async function deleteUsuario(uid,token){
    const resultado = await axios.delete(server+'/usuarios/'+uid, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    return resultado.data
}

//----------------------------------------------------------------- RESERVAS -----------------------------------------------------------------

async function putBooking(rid,uid,date, data, token){
    const resultado = await axios.put(server+'/booking/'+rid+'/'+uid+'/'+date, data, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    return resultado.data
}

async function postBooking(data,token){
    const resultado = await axios.post(server+'/booking/', data, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }
    )
    return resultado.data
}

async function deleteBooking(rid, uid, date, token) {
    const resultado = await axios.delete(server + '/booking/' + rid + '/' + uid + '/' + date, {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    });
    return resultado.data;
}


//----------------------------------------------------------------- ZONA DE PRUEBAS -----------------------------------------------------------------

//usuario de pruebas
const user = {
    id : "u1",
    email : "example@gmail.com",
    password : "123456789"
}

//prueba de conexion
const hello = await testHelloWorld()
console.log('Prueba de conexión, resultado: ' + hello)

//añadimos el usuario (si ya existe, no lo añade)
let post = await postUsuario(user)
console.log(post)

//prueba de login
const token = await loginUsuario(user)
if(!token){
    console.log("Error al iniciar sesión")
} else
    console.log("Login existoso")


//----------------------------------------------------------------- PRUEBAS RECURSOS -----------------------------------------------------------------

//modificamos el recurso r4
let put = await putRecurso("r4",{
    name: "Microwave Engeneering",
},token)
console.log(put)

//borramos el recurso r1
let result = await deleteRecurso("r1",token)
console.log(result)

//añadimos un nuevo recurso r1
post = await postRecurso({
    rid : "r1",
    name: "Calculadoras Cientificas",
},token)
console.log(post)

//----------------------------------------------------------------- PRUEBAS USUARIOS -----------------------------------------------------------------

//modificamos usuario u2
put = await putUsuario("u2",{
    email : "correo@gmail.com",
    password : "contraseña",
},token)
console.log(put)

//borramos usuario u3
result = await deleteUsuario("u3",token)
console.log(result)

//----------------------------------------------------------------- PRUEBAS RESERVAS -----------------------------------------------------------------

/*put = await putBooking("r2","u1","2025-06-20T10:00:00.000Z",{
    rid : "r3",
    uid : "u2",
    date : "2025-06-20T10:00:00.000Z",
    hours : 5, 
},token)
console.log(put)

result = await deleteBooking("r2","u1", "2025-06-16T10:00:00.000Z",token)
console.log(result)

post = await postBooking({
    rid : "r2",
    uid : "u1",
    date : "2025-06-16T10:00:00.000Z",
    hours : 5, 
},token)
console.log(post)*/

post = await postBooking({
    rid : "r4",
    uid : "u1",
    date : "2025-03-12T10:00:00.000Z",
    hours : 3, 
},token)
console.log(post)