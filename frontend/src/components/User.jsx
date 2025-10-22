import { Navigate, useNavigate } from "react-router-dom";
import { USER } from "../data";
import home_icon  from '../assets/home_icon.png';
import logout_icon from '../assets/logout_icon.png';
import user_icon from '../assets/user_icon.png';
import { useEffect, useContext, useState } from "react";
import { BLOGS } from "../data";
import { BlogPreview } from "./BlogPreview";
import { UserContext } from "@/contexts/UserProvider";

export const User = () => {
    const [showUser, setShowUser] = useState(false);
    const navigate = useNavigate();
    const {userDetails, setUserDetails}=useContext(UserContext);
    const [blogs, setBlogs]=useState(null);

    useEffect(()=>{
        const getUser=async()=>{
            try{
                const response=await fetch(`http://localhost:3000/users/${userDetails.userid}/blogs`, {
                    method: 'GET',
                    credentials: "include",
                    headers: new Headers({
                        'authorization': 'true'
                    })
                });
                if(response.ok){
                    const res=await response.json();
                    console.log(res);
                    setBlogs(res);
                }else{
                    console.log('issue in response', response);
                }
            }catch(error){
                console.log('error in fetch request', error);
            }
        }
        getUser();
    }, [])
    const handleHomeClick = () => {
        navigate('/');
    }
    const handleUserIconClick = () => {
        console.log('user icon clicked');
        setShowUser(!showUser);
    }

    const handleProfileClick = () => {
        navigate(`/user/${userDetails.userid}`);
    }

    return (
        <>
        <div className="navbar w-full h-30 flex flex-row justify-between items-center">
        <button onClick={() => handleHomeClick()} className="post ml-20  ">
            <img src={home_icon} className='w-10 h-10' alt="post blogs" />
        </button>
        <div className="header font-bold text-3xl">{userDetails.username}'s Blogs!</div>
        <div onClick={() => handleUserIconClick()} className="userIcon mr-20 relative">
            <img src={user_icon} className='w-10 h-10' alt="user" />
            {
            showUser ? (
                <div className="absolute flex flex-col gap-2">
                    Hi, {userDetails.username}
                    <button onClick={() => handleProfileClick()} className="w-25 h-5 flex flex-row items-center">
                        <img src={user_icon} className='h-5 mr-3 ' alt="logout" />
                        Profile
                    </button> 
                    <button className="logout w-25 h-5 flex flex-row items-center">
                        <img src={logout_icon} className='h-5 mr-3' alt="logout" />
                        Logout
                    </button>
                </div>
            ):<div></div>
            }
        </div>
        
    </div>
    <div className='max-w-50vw h-80vw flex flex-wrap gap-20 justify-center items-center'>
    {   
        blogs ? 
        blogs.map(
            (data) => {return <BlogPreview key={data.id} {...data}/>}
        )
        :
        <div>loading blogs...</div>
    } 
    </div>
        </>
    )
}