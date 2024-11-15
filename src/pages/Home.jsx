import { useEffect, useState } from "react";
import { supabase } from "../client/supabaseClient";
import { Link } from "react-router-dom";

const Home = () => {
    const [allPosts, setAllPosts] = useState([]);

    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                const { data, error } = await supabase
                    .from("posts")
                    .select("*, user_id(username)");
                setAllPosts(data);
                if (error) {
                    console.error("Error fetching posts", error.message);
                    throw error;
                }

                console.log("Fetched all posts", allPosts);
                
            } catch (error) {
                    console.error("Unexpected error", error.message); 
            } 
        }
        fetchAllPosts();
    }, []);

    return (
        <div className="post-list">
        {allPosts.map((post) => (
            <div key={post.id} className="post-card">
                <Link to={`/post/${post.id}`}>
                    <h2>{post.title}</h2>
                    <p>{post.context.substring(0, 100)}...</p>
                    <p><strong>Author:</strong> {post.user_id?.username || "Unknown"}</p>
                </Link>
            </div>
        ))}
    </div>
);
}

export default Home;