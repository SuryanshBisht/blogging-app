import React, { createContext, useEffect, useState } from 'react';

export const UserContext = createContext(undefined);

export const UserProvider = ({ children }) => {
    const [userDetails, setUserDetails] = useState({
        authorization: true,
        userid: 1,
        username: 'John Doe'
    });

    useEffect(()=>{
        const fetchUser=async()=>{
            try{
                const response=await fetch('http://localhost:3000/me',{
                    method: 'GET',
                    headers: new Headers({
                        'authorization': 'true'
                    }),
                    credentials: 'include',
                })
                if(response.ok){
                    const res=await response.json();
                    console.log('updating user as ', res[0]);
                    setUserDetails({
                        authorization: true,
                        userid: res[0].id,
                        username: res[0].username
                    });
                }else{
                    console.log('issue with response', response);
                }
            }catch(error){
                console.log(error);
            }
        }
        fetchUser();
    },[])

    return (
        <UserContext.Provider value={{userDetails, setUserDetails}}>
        {children}
        </UserContext.Provider>
    );
}