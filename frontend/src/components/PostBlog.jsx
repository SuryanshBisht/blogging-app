
import React, { useContext, useEffect, useState } from "react";
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import content from "@/components/tiptap-templates/simple/data/content.json";
import {startercontent} from '../data';
import { UserContext } from "@/contexts/UserProvider";
import { useNavigate } from "react-router-dom";

export const PostBlog = () => {
    // console.log(content);
    // const starterContent=content;
    
    const starterTitle="blank title";
    const [blogData, setBlogData] = useState (startercontent);
    const [blogTitle, setBlogTitle] = useState (starterTitle);
    const [showTitleWarning, setShowTitleWarning] = useState(false);
    const {userDetails, setUserDetails} = useContext(UserContext);
    const navigate=useNavigate();
    useEffect(()=>{
        try{
            setBlogTitle(blogData.content[0].content[0].text);
            setShowTitleWarning((blogTitle.length>255));
        }catch(error){
            setShowTitleWarning(true);
            console.log('error in title', error);
        }
    }, [blogData]);

    const postBlog = async () => {
        try{
            const response = await fetch("http://localhost:3000/blogs", {
                method: "POST",
                headers: new Headers({
                    'Content-Type': 'application/json' ,
                    'authorization': 'true',
                }),
                body: JSON.stringify({
                    authorId: userDetails.userid,
                    title: blogTitle,
                    content: blogData
                }),
                credentials: "include",
            });
            // if successful just navigate
            if(response.ok){
                const res=await response.json();
                console.log(res);
                navigate('/');
                console.log('succesfully posted blog'); 
            }
        }catch(error){
            console.log(error);
        }
    }

    const handlePostBlog = async () => {
        console.log('posting your blog with content', blogData, 'and title', blogTitle);
        if(showTitleWarning){
            alert('Error in blog\'s title');
            return;
        }
        console.log('posting your blog with content', blogData, 'and title', blogTitle);
        await postBlog();
    }


    return (
        <>
        <div className="flex flex-col justify-between gap-5 w-[70vw] h-[90vh] mt-10 m-auto items-center"> 
            {showTitleWarning && (
                <div className="absolute w-[80vw] top-0 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-2 rounded-md">
                blog must not be empty and within 255 characters!</div>)}
        <div className="text-4xl ">Post your own blog!</div>
        {/* <SimpleEditor className="max-h-10" content={blogTitle} setContent={setBlogTitle} editable={true} showToolBar={false}/> */}
        <SimpleEditor content={blogData} setContent={setBlogData} editable={true} showToolBar={true}/>
        <button onClick={()=>handlePostBlog()} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 
                        hover:bg-gray-200 transition-color">Post</button>
        </div>
        </>
    )
}