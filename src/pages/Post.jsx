import PostCard from "../components/PostCard";
import { useEffect, useState } from "react";
import { supabase } from "../client/supabaseClient";
import { useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import '../styles/post.css';

const Post = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const fetchPost = async () => {
            const { data, error } = await supabase
                .from("posts")
                .select("*, user_id (username)")  
                .eq("id", id)
                .single();
            if (error) {
                setError(error.message);
            } else {
                setPost(data);
            }
        };

        const fetchComments = async () => {
            const { data, error } = await supabase
                .from("comments")
                .select(`*, user_id(username)`)
                .eq("post_id", id);
            if (error) {
                console.error("Error fetching comments", error.message);
            } else {
                setComments(data);
            }
        };

        fetchPost();
        fetchComments();
    }, [id]);

    const handleComment = async () => {
        if (!newComment.trim()) return; 
        const { error } = await supabase
            .from("comments")
            .insert([
                {
                    post_id: id,
                    context: newComment,
                    user_id: user.id,  // username or returns null from the fetchUser function
                },
            ]);
            console.log("Comment posted successfully");
    
        if (error) {
            console.error("Error posting comment", error.message);
        } else {
            setComments((prevComments) => [
                ...prevComments]);
            setNewComment("");

            window.location.reload();
        }
    };

    const formatDate = (date) => {
        if (!date) return "";
        return formatDistanceToNow(new Date(date), { addSuffix: true });
    };

    return (
        <div className="post-container">
            {error && <p>Error: {error}</p>}
            {post ? (
                <div>
                    <h2>{post.title}</h2>
                    <p>{post.context}</p>
                    <small>Posted by {post.user_id.username} {formatDate(post.created_at)}</small>
                </div>
            ) : (
                <p>Loading...</p>
            )}

            <div className="comments-container">
                <h3>Comments</h3>
                <ul>
                    {comments.map((comment) => (
                        <li key={comment.id}>
                            <p>{comment.context}</p> 
                            <small>{formatDate(comment.created_at)}</small>
                        </li>
                    ))}
                </ul>

                <form onSubmit={(e) => { e.preventDefault(); handleComment(); }}>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment"
                    ></textarea>
                    <button type="submit">Post Comment</button>
                </form>
            </div>
        </div>
    );
};

export default Post;
