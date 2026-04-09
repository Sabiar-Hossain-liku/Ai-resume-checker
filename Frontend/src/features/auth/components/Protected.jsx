import { Navigate, useNavigate } from "react-router"
import {useAuth} from "../hooks/useAuth"


const Protected = ({children}) => {
  const {loading,user} = useAuth()
  const navigate = useNavigate()

  if (loading){
    return (<main>Loading....</main>)
  }

  if(!user){
    return <Navigate to={"/login"} />
  }

  return children
}

export default Protected