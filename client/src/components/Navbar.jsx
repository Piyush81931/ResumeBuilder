import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '../fetaures/authSlice';

// --- CUSTOM THEME DEFINITION ---
const THEME = {
    bg: '#faedcd',    // Creamy background
    text: '#99582a',  // Dark brown/warm primary text
    primary: '#bb9457', // Primary accent (Muted Gold/Brown)
    secondary: '#d4a373', // Secondary accent (Lighter Tan)
    surface: '#f8f1de', // Lighter surface/card background
    border: '#d4a373',  // Border color
};

const Navbar = () => {
    const {user} = useSelector(state=>state.auth)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // LOGIC UNCHANGED
    const logoutUser = ()=>{
        dispatch(logout())
        navigate('/')
    }

  return (
    // Apply surface color and border style
    <div className='shadow' style={{ backgroundColor: THEME.surface, borderBottom: `1px solid ${THEME.border}` }}>
        <nav className='flex items-center justify-between max-w-7xl max-auto px-4 py-3.5
        transition-all' style={{ color: THEME.text }}>
            <Link to='/'>
                <img src="/logo.svg" alt="logo" className='h-11 w-auto' />
            </Link>
            <div className='flex items-center gap-4 text-sm'>
                <p className='max-sm:hidden'>Hi, {user?.name}</p>
                <button 
                    onClick={logoutUser} 
                    className='border px-7 py-1.5 rounded-full active:scale-95 transition-all'
                    // Apply theme colors to the button
                    style={{ 
                        backgroundColor: THEME.primary, 
                        color: 'white', // Ensure high contrast text on the primary button
                        borderColor: THEME.primary,
                        // Custom hover for secondary color
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06)' 
                    }}
                >
                    Logout
                </button>
            </div>
        </nav>
    </div>
  )
}

export default Navbar