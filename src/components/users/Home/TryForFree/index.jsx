import { Link } from 'react-router-dom'

const TryForFree = () => {
    return (
        <div className='try-free-container'>
            <h2>Try us for free</h2>
            <p>Sign up for a free account and start studying.</p>
            <Link to='/signup' className='btn btn-primary'>
            Sign up
            </Link>
        </div>
    )
}

export default TryForFree;