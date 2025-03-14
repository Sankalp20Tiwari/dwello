import React ,{ createContext, ReactNode, useContext } from "react";
import { useAppwrite } from "./useAppwrite";
import { getUser } from "./appwrite";


interface User{
    $id: string;
    name: string;
    email:string;
    avatar: string;
}


interface GloblContextType{
    isLoggedIn :boolean;
    user: User |null;
    loading : boolean;
    refetch: (newParams: Record<string, string | number>) => Promise<void>
}

interface GlobalProviderProps {
    children : ReactNode
}

const GlobalContext = createContext<GloblContextType | undefined>(undefined)


export const GlobalProvider = ({children}: GlobalProviderProps)=> {

    const {
        data: user,
        loading,
        refetch
    } = useAppwrite({
        fn: getUser,
    })

    const isLoggedIn = !!user


    return (
        <GlobalContext.Provider value= {{
            isLoggedIn,
            user,
            loading,
            refetch,
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () : GloblContextType => {
    const context = useContext(GlobalContext)

    if(!context){
        throw new Error("useGlobalContext must be used within a GlobalProvider")
    }
    return context
}

export default GlobalProvider;