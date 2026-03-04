import { Dumbbell } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/Button'
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
    const user = useAuth(); // Replace with actual authentication logic
  return (
    <header className="fixed top-0 left-0 right-0 border-b border-[var(--color-border)] bg-[var(--color-background)]/80 backdrop-blur-md z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-[var(--color-foreground)]">
            <Dumbbell className='w-6 h-6 text-[var(--color-accent)]'/>
            <span className="font-semibold text-lg">Gym AI Planner</span>

        </Link>
        <nav>
            {user ? (
                <>
                 <Link to="/profile" >
                    <Button variant="ghost" className='sm'>My Plan</Button>
                </Link>
                </>
               
            ) : (
                <>
                    <Link to="/auth/signin" >
                        <Button variant="ghost" className='sm'>Sign In</Button>
                    </Link>
                    <Link to="/auth/signup" >
                    <Button className='sm'>Sign Up</Button>
                </Link>
            </>
        )}
        </nav>
      </div>
    </header>
  )
}
