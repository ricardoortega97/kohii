import { useEffect } from "react";
import { supabase } from "../client/supabaseClient";
import { Link } from "react-router-dom";
import '../styles/postForm.css';

const PostCard = (props) => {
    const [post, setPost] = useState(props.post);

    useEffect(() => {
        const fetchPost = async () => {
            const {data, error} = await supabase
                .from("posts")
                .select(`*,
                    user_id (username)`   
                )
                .eq("id", post.id)
                .single();
            if (error) {
                console.error("Error fetching post", error.message);
            } else {
                setPost(data);
            }
        };
        fetchPost();
    }, [props.post]);

    return (
        <div className="post-card">
            <Link to={`/post/${post.id}`} className="link">
                <div>
                    <span>{post.user_id.username}</span>
                    <span>{post.created_at}</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.context}</p>
            </Link>
        </div>
    );

}

export default PostCard;