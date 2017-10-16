import React from 'react';
import Spinner from '../images/spinner.png';
import '../styles/loading.scss';

const Loading = (props) => {
    return (
        <img src={ Spinner } alt='This section is loading.' className='Loading' />
    )
}

export default Loading;