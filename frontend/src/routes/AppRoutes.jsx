import { Home } from '../components/Home';
import { User } from '../components/User';
import { Blog } from '../components/Blog';
import { PostBlog } from '../components/PostBlog';
import { Login } from '../components/Login';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { SignUp } from '@/components/SignUp';

export const AppRoutes = () => {    
    return (
        <BrowserRouter>
        <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/user/:id" element={<User/>} />
        <Route path="/blog/:id" element={<Blog/>} />
        <Route path="/postblog" element={<PostBlog/>} />
        </Routes>
        </BrowserRouter>
    )
}