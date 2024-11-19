import { useEffect, useState } from "react";
import { supabase } from "../client/supabaseClient";
import { useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import '../styles/post.css';
import more from '../components/more.png';
import heart from '../assets/heart.png';

const Post = () => {
    const { id } = useParams();
    const [count, setCount] = useState(0);
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
                .select("*, user_id (username), likes")  
                .eq("id", id)
                .single();
            if (error) {
                setError(error.message);
            } else {
                setPost(data);
                setCount(data.likes);
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
        const { data, error } = await supabase
            .from("comments")
            .insert([
                {
                    post_id: id,
                    context: newComment,
                    user_id: user ? user.id : null,  // username or returns null from the fetchUser function
                },
            ]);
            console.log("Comment posted successfully");
    
        if (error) {
            console.error("Error posting comment", error.message);
        } else {
            setComments((prevComments) => [...prevComments, ...data]); // Append the new comment
            setNewComment("");
            window.location.reload();
        }
    };

    const updateCount = async () => {
        await supabase
        .from("posts")
        .update({ likes: count + 1 })
        .eq("id", id);
        setCount(count + 1);
    };

    const formatDate = (date) => {
        if (!date) return "";
        return formatDistanceToNow(new Date(date), { addSuffix: true });
    };

    return (
        <div className="post-container">
            {error && <p>Error: {error}</p>}
            {post ? (
                <div className="inner-post">
                    <div className="edit">
                        <Link to={`/edit/${id}`}><img className="moreButton" alt="edit button" src={more} /></Link>
                    </div>
                    <div className="author">
                        <p>Posted by {post.user_id?.username}</p> 
                        <p>• {formatDate(post.created_at)}</p>
                        {/* <small>Posted by {post.user_id.username} {formatDate(post.created_at)}</small> */}
                    </div>
                    <div className="post-context">
                        <h2>{post.title}</h2>
                        <p>{post.context}</p>
                    </div>
                    <div className="like-container">
                    <img src={heart} alt="heart" onClick={updateCount} />
                    <span>{count}</span>
                    </div>
                </div>
            ) : (
                <p>Loading...</p>
            )}

            <div className="comments-container">
            <form onSubmit={(e) => { e.preventDefault(); handleComment(); }}>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault(); // Prevents a new line in the textarea
                                handleComment();
                            }
                        }}
                    ></textarea>
                </form>
                <h3>Comments</h3>
                <ul>
                    {comments.map((comment) => (
                        <li key={comment.id}>
                            <small>
                                {comment.user_id?.username || "Anonymous"}{" "}
                                • {formatDate(comment.created_at)}
                            </small>
                            <p>{comment.context}</p> 
                        </li>
                    ))}
                </ul>

            </div>
        </div>
    );
};

export default Post;
