import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Account from "./pages/Account"
import Auth from "./pages/Auth"
import Onboarding from "./pages/Onboarding"
import Profile from "./pages/Profile"
import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth/react';
import { authClient } from "./lib/auth"
import AuthProvider from "./context/AuthContext"

function App() {

  return (
    <>
    <NeonAuthUIProvider defaultTheme="dark" authClient={authClient}>
      <AuthProvider>
      <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/account" element={<Account />} />
          <Route path="/auth/:pathname" element={<Auth />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/profile/:pathname" element={<Profile />} />
        </Routes>
       </main>
       </div>
      </BrowserRouter>
      </AuthProvider>
      </NeonAuthUIProvider>
    </>
  )
}

export default App
