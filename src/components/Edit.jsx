import { supabase } from "../client/supabaseClient";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import React from "react";
import { TextField } from "@mui/material";
import '../styles/PostForm.css';

const Edit = () => {
    const { id } = useParams();
    const [post, setPost] = useState({ title: "", context: "", channel_id: 1, user_id: "" });   
    const [user,setUser] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            const { data } = await supabase
                .from("posts")
                .select("*")
                .eq("id", id)
                .single();
            setPost(data);

            const { data: userData } = await supabase
                .from("users")
                .select("username")
                .eq("id", data.user_id)
                .single();
            
            setUser(userData);

        };
        fetchPost();
    }, [id]);

    const updatePost = async (event) => {
        event.preventDefault();

        await supabase
            .from("posts")
            .update({
                title: post.title,
                context: post.context,
                channel_id: post.channel_id,
            })
            .eq("id", id);
        
        window.location = "/post/" + id;
        console.log("Post updated");
    };

    const deletePost = async () => {
        await supabase
            .from("posts")
            .delete()
            .eq("id", id);

        window.location = "/";
        console.log("Post deleted");
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPost((prevPost) => ({
            ...prevPost,
            [name]: value,
        }));
    }

    return (
        <div className="post-form">
            <h1>Edit Post</h1>
            <p>Username: {user ? user.username : "Loading..."}</p>
            <form onSubmit={updatePost}>
                <TextField
                    id="outlined-helperText"
                    label="Title"
                    name="title"
                    value={post.title}
                    onChange={handleChange}
                    sx={{ width: '100%' }}
                />
                <TextField
                    id="outlined-multiline-static"
                    multiline
                    rows={10}
                    label="Context"
                    name="context"
                    value={post.context}
                    onChange={handleChange}
                    sx={{ width: '100%' }}
                />
                <div>
                    <button type="submit">Update Post</button>
                    <button onClick={deletePost}>Delete Post</button>
                </div>
            </form>
        </div>
    )
    } 
export default Edit;