import { createContext, useContext, useEffect, useState, type ReactNode} from "react";
import type { User } from "../types";
import { authClient } from "../lib/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
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
  return <AuthContext.Provider value={{ user: user, isLoading: loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}