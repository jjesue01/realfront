import React from 'react';
import styles from './app.module.sass'
import { Scheduler } from '../components/scheduler';
import {Login} from '../components/login'

export function AppNavigation() {
  const [isAuth, setIsAuth] = React.useState(false);

  return (
    <main className={styles.main}>
      {isAuth ? <Scheduler/> : <Login setIsAuth={setIsAuth}/>}
    </main>
  )
}