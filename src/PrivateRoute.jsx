import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

function PrivateRoute({ children, role }) {
const { user } = useAuth()
const location = useLocation()

if (!user) {
return <Navigate to="/login" state={{ from: location.pathname }} replace />
}

if (role && user.role !== role) {
return <Navigate to="/" replace />
}

return children
}

export default PrivateRoute
