import { Button } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className='flex flex-col gap-8 items-center justify-center w-screen h-screen bg-gray-200'>
        <h1 className='text-6xl font-bold text-center'>404 - Page Not Found</h1>
        <p className='text-center text-gray-500'>The page you're looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
        <Link to="/">
        <Button variant='contained' color='secondary' >Go Back</Button>
        </Link>
    </div>
  )
}

export default NotFound