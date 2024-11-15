import { useEffect, useState } from "react";
import { supabase } from "../client/supabaseClient";
import { useNavigate } from "react-router-dom";


const PostForm = () => {

    const [post, setPost] = useState({title: "", context: "", channel_id: "", user_id: "", image: ""});
    const [currentUser, setCurrentUser] = useState([]);
    const [channels, setChannels] = useState([]);

    useEffect(() => { 
        const fetchCurrentUser = async () => {
            const { data } = await supabase.auth.getUser();
            setCurrentUser(data.user);
            setPost({ ...post, user_id: data.user.id });
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
        await supabase
        .from("posts")
        .insert([
            {
                title: post.title,
                context: post.context,
                channel_id: post.channel_id,
                user_id: post.user_id,
                image: post.image,
            },
        ])
        .select();
    }

    const handleChange = (event) => {
        setPost({ ...post, [event.target.name]: event.target.value });
    }

    return ( 
        <div className="create-post">
            <h2>Create Post</h2>
            <form onSubmit={createPost}>
                <label>Title</label>
                <input type="text" name="title" onChange={handleChange} />
                <label>Context</label>
                <input type="text" name="context" onChange={handleChange} />
                <label>Channel</label>
                <select name="channel_id" onChange={handleChange}>
                    {channels.map((channel) => (
                        <option key={channel.id} value={channel.id}>
                            {channel.name}
                        </option>
                    ))}
                </select>
                <label>User</label>
                <p>{currentUser?.username}</p>
                
                <label>Image</label>
                <input type="text" name="image" onChange={handleChange} />
                <button type="submit">Create Post</button>
            </form>
        </div>
    )
};

export default PostForm;