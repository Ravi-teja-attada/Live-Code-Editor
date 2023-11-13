import React from 'react'

function LoginPage() {
  return (
    <div className='login_card'>
      <h1>Login</h1>
      <div className='form_wrapper'>
        <input placeholder='Username' />
        <input placeholder='Password'/>
        <button>Join</button>
        <h4>Don't have an account? &nbsp; <a href='#'>register</a></h4>
      </div>
    </div>
  )
}

export default LoginPage