import { useEffect, useState } from "react";
import { supabase } from "../client/supabaseClient";
import PostCard from "../components/PostCard";

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
            {allPosts.length > 0 ? (
                allPosts.map((post) => 
                    <PostCard
                        key={post.id}
                        post={post}
                    />
                )
            ) : (
                <h2>No posts found</h2>
            )}
        </div>
    );
}

export default Home;