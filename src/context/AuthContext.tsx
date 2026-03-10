import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode} from "react";
import type { User, UserProfile, TrainingPlan } from "../types";
import { authClient } from "../lib/auth";
import { api } from "../lib/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  plan: TrainingPlan | null;
  saveProfile: (profile: Omit<UserProfile, 'userId' | 'updatedAt'>) => Promise<void>
  generatePlan: () => Promise<void>
  refreshData: () => Promise<void>;
}

const  AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [plan, setPlan] = useState<TrainingPlan | null>(null);
    const isRefreshingRef = useRef(false);
    

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

    useEffect(() => {
    if (!loading) {
      if (user?.id) {
        refreshData();
      } else {
        setPlan(null);
      }
      setLoading(false);
    }
  }, [user?.id, loading]);

    const refreshData = useCallback(async() => {
        if(!user || isRefreshingRef.current){
            return;
        }

        isRefreshingRef.current = true;

        try {
            const planData = await api.getCurrentPlan(user.id).catch(() => null);
            if (planData) {
                setPlan({
                id: planData.id,
                userId: planData.userId,
                overview: planData.planJson.overview,
                weeklySchedule: planData.planJson.weeklySchedule,
                progression: planData.planJson.progression,
                version: planData.version,
                createdAt: planData.createdAt,
                });
            }
        } catch (error) {
            console.error("Error refreshing data: ", error)
        }finally{
            isRefreshingRef.current = false;
        }
    }, [user?.id])

    async function saveProfile(profileData:Omit<UserProfile, 'userId' | 'updatedAt'>) {
        if(!user){
            throw new Error('User must be authenticated to save profile');
        }
        
        await api.saveProfile(user.id, profileData);
        await refreshData();
        
        
    }

    async function generatePlan() {
        if(!user){
            throw new Error('User must be authenticated to generate plan');
        }
        
        await api.generatePlan(user.id);
        await refreshData();
        
    }

  return <AuthContext.Provider value={{ user: user, isLoading: loading, plan, saveProfile, generatePlan, refreshData }}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}