import '../styles/layout.css';
import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../client/supabaseClient';
import Header from './Header.jsx';
import SideNav from './Sidenav.jsx';

const Layout = () => {
    const [allPosts, setAllPosts] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);
    const [sortDirection, setSortDirection] = useState(false);

    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                const { data, error } = await supabase
                    .from("posts")
                    .select("*, user_id(username)")
                    .order("created_at", { ascending: sortDirection === false });
                if (error) {
                    console.error("Error fetching posts", error.message);
                    throw error;
                }
                if (data) {
                    setAllPosts(data);
                    console.log("Fetched all posts", data);
                }
                
            } catch (error) {
                    console.error("Unexpected error", error.message); 
            } 
        }
        fetchAllPosts();
    }, [sortDirection]);

    const handleSort = () => {
        setSortDirection(sortDirection === false ? true : false);
    }

    return (
        <div className="layout">
            <div className="filter-btn">
                <h2>Order by: </h2>
                <button>Votes</button>
                <button onClick={handleSort}>Date</button>
            </div>
            <Header  allPosts={allPosts} setFilteredResults={setFilteredResults}/>
            <div className="inner-layout-container">
                <SideNav />
                <main>
                    <Outlet context={{ allPosts, filteredResults }} />
                </main>
                    
            </div>
        </div>
    );
}

export default Layout;