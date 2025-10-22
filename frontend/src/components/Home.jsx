import {React, useState, useContext, useEffect} from 'react';
import {BLOGS} from '../data';
import {USER} from '../data';
import { BlogPreview } from './BlogPreview';
import post_icon from '../assets/post_icon.png';
import logout_icon from '../assets/logout_icon.png'
import user_icon from '../assets/user_icon.png';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '@/contexts/UserProvider';

export const Home = () => {
    const [showUser, setShowUser] = useState(false);
    const [blogs, setBlogs]=useState();
    const {userDetails, setUserDetails}=useContext(UserContext);
    const navigate=useNavigate();

    useEffect(()=>{
        const getBlogs = async () => {
            try{
                const response = await fetch("http://localhost:3000/blogs", {
                    method: "GET",
                    headers: new Headers({ 
                        'Content-Type': 'application/json' ,
                        'authorization': 'true'
                    }),
                    credentials: "include",
                });
                const res=await response.json();
                console.log(res);
                // if successful just navigate
                if(response.ok){
                    setBlogs(res);
                }
            }catch(error){
                console.log(error);
            }
        }
        getBlogs();
    }, [])

    const handlUserIconClick = () => {
        console.log('user icon clicked');
        setShowUser(!showUser);
    }

    const handleProfileClick = () => {
        navigate(`/user/${userDetails.userid}`);
    }

    const handlePostClick = () => {
        navigate('/postblog');
    }

    const handleLogoutClick = async () => {
        console.log('logging out');
        try{
            const res = await fetch('http://localhost:3000/logout', {
                method: 'POST',
                headers: {
                    authorization: true
                },
                credentials: 'include', // important for sending cookies
            });

            if (!res.ok) {
            // server returned 4xx or 5xx
                const errorData = await res.json();
                console.error('Logout failed:', errorData);
                return;
            }
            
            const data = await res.json();
            console.log('Logout success:', data);
            navigate('/login');
        }catch(error){
            console.log(error);
        }
    }

    return (
        <>
        <div className="navbar w-full h-30 flex flex-row justify-between items-center">
            <button onClick={() => handlePostClick()} className="post ml-20  ">
                <img src={post_icon} className='w-10 h-10' alt="post blogs" />
            </button>
            <div className="header font-bold text-3xl">Welcome to the Blogging app</div>
            <div onClick={() => handlUserIconClick()} className="userIcon mr-20 relative">
                <img src={user_icon} className='w-10 h-10' alt="user" />
                {
                showUser ? (
                    <div className="absolute flex flex-col gap-2">
                        Hi, {userDetails.username}
                        <button onClick={() => handleProfileClick()} className="w-25 h-5 flex flex-row items-center">
                            <img src={user_icon} className='h-5 mr-3 ' alt="logout" />
                            Profile
                        </button> 
                        <button onClick={async()=>{await handleLogoutClick()}}
                        className="logout w-25 h-5 flex flex-row items-center">
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
            blogs?.length ? (
            blogs.map((data) => (
                <BlogPreview key={data.id} {...data} />
            ))
            ) : (
            <p>No blogs yet</p>
            )
        } 
        </div>
        </>
    )
}