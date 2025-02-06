/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useState } from 'react'

export const UserDataContext = createContext()


const UserContext = ({ children }) => {

    const [ user, setUser ] = useState(null)
    const values={
        user,
        setUser
    }

    return (
        <div>
            <UserDataContext.Provider value={values}>
                {children}
            </UserDataContext.Provider>
        </div>
    )
}

export default UserContext