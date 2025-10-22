import { startercontent } from "@/data";    
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export const Blog = () => {
    const {id}=useParams();
    const [blogContent, setBlogContent] = useState(null);
    console.log('showing blog',id);
    console.log('startercontent', startercontent);
    useEffect(()=> {
        const getBlogContent = async () => {
            try{
                const response = await fetch(`http://localhost:3000/blogs/${id}`, {
                    method: 'GET',
                    headers: new Headers({
                        'authorization': 'true'
                    }),
                    credentials: 'include'
                })
                if(response.ok){
                    const res= await response.json();
                    console.log(typeof(res[0].content));
                    const data=JSON.parse(res[0].content);
                    console.log('blog fetched successfully', data);
                    setBlogContent(data);
                }else{
                    console.log('error in response', response);
                }
            }catch(error){
                console.log(error);
            }
        }
        getBlogContent();
    }, [])
    return (
        <div>
           {blogContent? <SimpleEditor content={blogContent} editable={false} showToolBar={false}/>  : <div>loading blog</div>}   
        </div>
    )
}