import PostCard from "../components/PostCard";
import { useOutletContext } from "react-router";

const Home = () => {
    const { allPosts, filteredResults } = useOutletContext();

    const postsToDisplay = filteredResults.length > 0 ? filteredResults : allPosts;

    return (
        <div className="post-list">
            {postsToDisplay.length > 0 ? (
                postsToDisplay.map((post) => (
                    <PostCard key={post.id} 
                        id={post.id} post={post}
                        title={post.title} 
                        context={post.context} 
                        user_id={post.user_id} 
                        created_at={post.created_at} 
                        likes={post.likes}
                    />
                ))
            ) : (
                <h1>No posts found</h1>
            )}
        </div>
    );
}

export default Home;