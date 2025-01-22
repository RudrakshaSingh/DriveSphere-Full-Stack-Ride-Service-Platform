import  { createContext } from 'react'

//context jisse data age age pas ho ske

export const UserDataContext = createContext({})

function UserContext({children}) {

    const user="sar"

  return (
    <div><UserDataContext.Provider value={{user}}>{children}</UserDataContext.Provider></div>
  )
}

export default UserContext