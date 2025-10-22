import {useEffect, useState, useContext} from 'react';
import like_img from "../assets/like_icon.png"; 
import liked_img from "../assets/liked_icon.png"
import { useNavigate } from 'react-router-dom';
import { UserContext } from '@/contexts/UserProvider';



export const BlogPreview = (props) => {
    const navigate = useNavigate();
    const [userLiked, setUserLiked]=useState(false);
    const {userDetails, setUserDetails}=useContext(UserContext);
    const [likeCount, setLikeCount]=useState(Number(props.likes));

    useEffect(()=>{
        const getUserLiked=async()=>{
            const userid=userDetails.userid;
            try{
                const response=await fetch(`http://localhost:3000/blogs/${props.id}/likes/${userid}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: new Headers({
                        'authorization': 'true'
                    })
                })
                if(response.ok){
                    const res=await response.json();
                    console.log('fetched', res);
                    setUserLiked(res.length);
                }else{
                    console.log('problem in respones', response);
                }
            }catch(error){
                console.log(error);
            }
        }
        getUserLiked();
    }, [])

    const handleBlogViewClick = (id) => {
        navigate(`/blog/${id}`)
    }

    const handleLikeClick = async () => {
        console.log('liked');
        const userid=userDetails.userid;
        if(!userLiked){
            try{
                const response=await fetch(`http://localhost:3000/blogs/${props.id}/likes/${userid}`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: new Headers({
                        'authorization': 'true'
                    })
                })
                if(response.ok){
                    const res=await response.json();
                    console.log('fetched', res);
                    setUserLiked(true);
                    setLikeCount(likeCount+1);
                }else{
                    console.log('problem in respones', response);
                }
            }catch(error){
                console.log(error);
            }
        }else{
            try{
                const response=await fetch(`http://localhost:3000/blogs/${props.id}/likes/${userid}`, {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: new Headers({
                        'authorization': 'true'
                    })
                })
                if(response.ok){
                    const res=await response.json();
                    console.log('fetched', res);
                    setUserLiked(false);
                    setLikeCount(likeCount-1);
                }else{
                    console.log('problem in respones', response);
                }
            }catch(error){
                console.log(error);
            }
        }
    }
    

    return (
        <div className="w-50 flex items-center justify-between p-4 mb-3 rounded-xl shadow-md bg-white hover:shadow-lg transition-shadow">
            <div  onClick={() => handleBlogViewClick(props.id)}  className="text-xl font-semibold text-gray-800">
                {props.title}
            </div>

            <button onClick={() => handleLikeClick()}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 
                        hover:bg-gray-200 transition-colors"
            >
                <img 
                src={userLiked?liked_img:like_img}
                alt="likes" 
                className="w-5 h-5"
                />
                <span className="text-gray-700 font-medium">{likeCount}</span>
            </button>
        </div>

    )
}