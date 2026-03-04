import React from 'react'
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Profile() {
    const {user, isLoading} = useAuth();
    const plan = true;
        if(!user && !isLoading){
            return <Navigate to="/auth/signin" replace/>
        }

        if(plan){
            return <Navigate to="/onboarding" replace/>
        }
  return (
    <div>Profile</div>
  )
}
