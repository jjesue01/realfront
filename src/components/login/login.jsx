import React from 'react'
import { LoginAPI } from '../../api/login';
import { Button } from '../button';
import { Input } from '../input';
import styles from './login.module.sass'

export function Login ({setIsAuth}) {
  const [login, setLogin] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  function handleChangeLogin ({target: {value}}){
    setLogin(value)
  }

  function handleChangePassword({target: {value}}){
    setPassword(value)
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const response = await LoginAPI.login(login, password);
    if (response.status === 200) setIsAuth(true);
    else setError("Incorrect email or password")
  }

  return (
    <form onSubmit={handleSubmit} className={styles.root}>
      <h1>Sign in</h1>
      <Input
        type="email"
        name="email"
        value={login}
        onChange={handleChangeLogin}
        label="Email"
        error={!!error}
        errorText={error}
      />
      <Input
        type="password"
        name="password"
        value={password}
        onChange={handleChangePassword}
        label="Password"
        error={!!error}
      />
      <Button htmlType="submit">
        Sign in
      </Button>
    </form>
  )
}