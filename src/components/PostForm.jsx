import { useEffect, useState } from "react";
import { supabase } from "../client/supabaseClient";
import '../styles/PostForm.css';
import { TextField } from "@mui/material";

const PostForm = () => {

    const [post, setPost] = useState({title: "", context: "", channel_id: 1, user_id: "", image: ""});
    const [currentUser, setCurrentUser] = useState([]);
    const [channels, setChannels] = useState([]);

    useEffect(() => { 
        const fetchCurrentUser = async () => {
            const { 
                data: {user},
                error: authError,
            } = await supabase.auth.getUser();
            
            if (authError) {
                console.error("Not authenticated", authError.message);
                return;
            } 
            if (user) {
                const { data: userData, error: userError } = await supabase
                .from("users")
                .select("id, username")
                .eq("id", user.id)
                .single();

                if (userError) {
                    console.error("Error fetching current user", userError.message);
                    return;
                } else {
                    setCurrentUser(userData);
                    setPost((prevPost) => ({...prevPost,
                        user_id: userData.id}));
                }
            }
        };

        const fetchChannels = async () => {
            const { data } = await supabase.from("channels").select("id, name");
            setChannels(data);
        }
        fetchCurrentUser();
        fetchChannels();
    }, []);

    const createPost = async (event) => {
        event.preventDefault();
        try {
            const { data, error } = await supabase
            .from("posts")
            .insert(
                {
                    title: post.title,
                    context: post.context,
                    channel_id: post.channel_id || 1,
                    user_id: post.user_id
                })
            .select();
            
            if (error) {
                throw error;
            }
            console.log("Post created successfully", data);
        } catch (error) {
            console.error("Error creating post", error.message);
        }
        window.location = "/";
    }

    const handleChange = (event) => {
        setPost({ ...post, [event.target.name]: event.target.value });

    }

    return ( 
        <div className="create-post">

            <form onSubmit={createPost}>
                <label>User</label>
                <p>Username: {currentUser?.username || "Loading..."}</p>
                    
                <TextField
                    id="outlined-helperText"
                    label="Title"
                    name="title"
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
                <label>Context</label>
                <TextField
                id="outlined-multiline-static"
                label="Context"
                multiline
                rows={10}
                name="context"
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
                <label>Channel</label>
                <select name="channel_id" value={post.channel_id} onChange={handleChange}>
                    {channels.map((channel) => (
                        <option key={channel.id} value={channel.id}>
                            {channel.name}
                        </option>
                    ))}
                </select>
                {/* 
                
                <label>Image</label>
                <input type="text" name="image" onChange={handleChange} /> */}
                <button type="submit">Create Post</button> 
            </form>
        </div>
    )
};

export default PostForm;