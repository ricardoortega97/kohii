import PostCard from "../components/PostCard";
import { useOutletContext } from "react-router";

const Home = () => {
    const { allPosts, filteredResults } = useOutletContext();

    const postsToDisplay = filteredResults.length > 0 ? filteredResults : allPosts;

    return (
        <div className="post-list">
            {postsToDisplay.length > 0 ? (
                postsToDisplay.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))
            ) : (
                <h1>No posts found</h1>
            )}
        </div>
    );
}

export default Home;