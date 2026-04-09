import React from 'react'
import "../aut.form.scss"
import { Link, useNavigate } from 'react-router'

const Login
 = () => {
        const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
    }

  return (

    <main>
        <div className='form-container'>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
            <div className='input-group'>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" placeholder='email' />
            </div>
            <div className='input-group'>
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" placeholder='password' />
            </div>

            <button className= 'button primary-button'>Login</button>
            </form>
            <p> Dont have a account? <Link to={"/register"}>Register</Link></p>
            
        </div>
    </main>
  )
}

export default Login
