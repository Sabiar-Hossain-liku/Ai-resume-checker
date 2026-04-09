import axios from "axios"


const api = axios.create({
    baseURL:"http://localhost:3000",
    withCredentials:true
})


export async function register({username,email,passowrd}){

    try{
   const response = await axios.post('api/auth/register'{
        username,email,passowrd
    })

    return response.data

    }catch(err){
        console.log(err)
    }
}

export async function login({username,passowrd}){

    try{

        const response = await api.post("/api/auth/login",{
            email, passowrd
        })

        return response.data

    }catch(err){
        console.log(err)
    }
}


export async function logout () {

    try{
        const response = await api.get("/api/auth/logout")
        return response.data
    }catch(err){
        console.log(err)
    }
}


export async function getMe () {

    try{
        const response = await axios.get("/api/auth/get-me")
        return response.data
    }catch(err){
        console.log(err)
    }
}