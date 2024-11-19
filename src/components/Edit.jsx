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
        <div className="create-post">
            <h1>Edit Post</h1>
            <p>Username: {user ? user.username : "Loading..."}</p>
            <form onSubmit={updatePost}>
                <TextField
                    id="outlined-helperText"
                    label="Title"
                    name="title"
                    value={post.title}
                    onChange={handleChange}
                    sx={{
                        width: '100%',
                        '& label.Mui-focused': {
                        color: '#A0AAB4', // Label color when focused
                        },
                        '& .MuiInput-underline:after': {
                        borderBottomColor: '#B2BAC2', // Underline color (if applicable)
                        },
                        '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: 'white', // Default border color
                        },
                        '&:hover fieldset': {
                            borderColor: 'white', // Border color on hover
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: 'white', // Border color when focused
                        },
                        },
                    }}
                />
                <TextField
                    id="outlined-multiline-static"
                    multiline
                    rows={10}
                    label="Context"
                    name="context"
                    value={post.context}
                    onChange={handleChange}
                    sx={{width: '100%', 
                        '& label.Mui-focused': {
                            color: '#A0AAB4',
                        },
                        '& .MuiInput-underline:after': {
                            borderBottomColor: '#B2BAC2',
                        },
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                            borderColor: '#E0E3E7',
                            },
                            '&:hover fieldset': {
                            borderColor: '#B2BAC2',
                            },
                            '&.Mui-focused fieldset': {
                            borderColor: '#6F7E8C',
                            },
                        },
                    }}
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