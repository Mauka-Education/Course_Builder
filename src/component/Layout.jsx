import React from 'react'
import Navbar from './Navbar/Navbar'

const Layout = ({children}) => {
  return (
    <>
        <Navbar />
        <main style={{marginTop:"2rem"}}>
            {children}
        </main>
    </>
  )
}

export default Layout