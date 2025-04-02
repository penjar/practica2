import axios from 'axios'
const server = 'http://localhost:8080'
async function testHelloWorld(){
    const result = await axios.get(server + '/')
    return result.data // el campo data contendrá el resultado
}

async function loginUsuario(data){
    const resultado = await axios.post(server+'/login', data)
    return resultado.data
}

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

const user = {
    id : "u1",
    email : "example@gmail.com",
    password : "123456789"
}

const hello = await testHelloWorld()
console.log('Prueba de conexión, resultado: ' + hello)

let post = await postUsuario(user)
console.log(post)

const token = await loginUsuario(user)
if(!token){
    console.log("Error al iniciar sesión")
} else
    console.log("Login existoso")

let put = await putRecurso("r4",{
    name: "Piesdozar trasnoza",
},token)
console.log(put)

let result = await deleteRecurso("r1",token)
console.log(result)

post = await postRecurso({
    rid : "r1",
    name: "senozar",
},token)
console.log(post)

put = await putUsuario("u2",{
    email : "correo@gmail.com",
    password : "contraseña",
},token)
console.log(put)

result = await deleteUsuario("u3",token)
console.log(result)

put = await putBooking("r2","u1","2025-06-20T10:00:00.000Z",{
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
console.log(post)

post = await postBooking({
    rid : "r2",
    uid : "u1",
    date : "2025-06-16T18:00:00.000Z",
    hours : 5, 
},token)
console.log(post)