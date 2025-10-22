import {useContext, useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '@/contexts/UserProvider';

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate=useNavigate();
    const {userDetails, setUserDetails}=useContext(UserContext);

    const handleLoginClick =async () => {
        console.log('email', email);
        console.log('paswrd', password);
        console.log('clicked login');
        try{
            const response = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: new Headers({ 'Content-Type': 'application/json' }),
                credentials: "include",
                body: JSON.stringify({  
                    input1: email,
                    password: password
                })
            });
            // console.log(response);
            const res=await response.json();
            console.log(res);
            // if successful just navigate
            if(response.ok && res.authorization){
                console.log('updated user as ', res);
                setUserDetails(res);
                navigate('/');
            }
        }catch(error){
            console.log(error);
        }
    }
    return (
        <div className="box w-[40vw] h-[60vh] m-auto mt-30 flex flex-col items-center">
            <div className="title text-3xl text-center mb-20">Welcome to Blogging app</div>
            <input onChange={(e)=>setEmail(e.target.value)} type="text" className="email w-[30vw] m-5" placeholder="Email"/>
            <input onChange={(e)=>setPassword(e.target.value)} type="password" className="password w-[30vw] m-5 mb-30" placeholder="Password" />
            <button onClick={async()=>{await handleLoginClick();}}
            className="login mb-5
            flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100  hover:bg-gray-200 transition-color">Login</button>
            <div className="sign-in-box text-xs font-light">
                New User? Click 
                <Link to='/signup' className="text-blue-800 underline">here</Link> to sign up
            </div>
        </div>
    )
}