import { createContext, useContext, useEffect, useState, type ReactNode} from "react";
import type { User, UserProfile } from "../types";
import { authClient } from "../lib/auth";
import { api } from "../lib/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  saveProfile: (profile: Omit<UserProfile, 'userId' | 'updatedAt'>) => Promise<void>
}

const  AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
        async function loadUser(){
            try {
                const result = await authClient.getSession();
                if(result && result.data?.user){
                    setUser(result.data.user);
                }else{
                    setUser(null);
                }
            } catch (error) {
                setUser(null);
            }finally{
                setLoading(false);
            }
        }
        loadUser();
    }, [])

    async function saveProfile(profileData:Omit<UserProfile, 'userId' | 'updatedAt'>) {
        if(!user){
            throw new Error('User must be authenticated to save profile');
        }
        
        await api.saveProfile(user.id, profileData);
        
    }

  return <AuthContext.Provider value={{ user: user, isLoading: loading, saveProfile }}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}