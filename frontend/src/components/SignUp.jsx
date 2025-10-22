import {useState} from 'react';
import { useNavigate } from 'react-router-dom';

export const SignUp = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate=useNavigate();

    const handleSignUpClick =async () => {
        console.log('email', email);
        console.log('paswrd', password);
        console.log('clicked login');
        try{
            const response = await fetch("http://localhost:3000/signup", {
                method: "POST",
                headers: new Headers({ 'Content-Type': 'application/json' }) ,
                credentials: "include",
                body: JSON.stringify({  
                    username: username,
                    email: email,
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
            alert(error);
        }
    }
    return (
        <div className="box w-[40vw] h-[60vh] m-auto mt-30 flex flex-col items-center">
            <div className="title text-3xl text-center mb-20">Hi, New user</div>
            <input onChange={(e)=>setUsername(e.target.value)} type="text" className="username w-[30vw] m-5" placeholder="username" />
            <input onChange={(e)=>setEmail(e.target.value)} type="text" className="email w-[30vw] m-5" placeholder="Email"/>
            <input onChange={(e)=>setPassword(e.target.value)} type="password" className="password w-[30vw] m-5 mb-30" placeholder="Password" />
            <button onClick={async()=>{await handleSignUpClick();}}
            className="login mb-5
            flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100  hover:bg-gray-200 transition-color">Sign Up</button>
        </div>
    )
}