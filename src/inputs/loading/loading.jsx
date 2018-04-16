import React from 'react'
import Spinner from './spinner.png'
import './loading.scss'

const Loading = () => {
  return (
    <img src={Spinner} alt='This section is loading.' className='Loading' />
  )
}

export default Loading
