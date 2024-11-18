import '../styles/layout.css';
import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../client/supabaseClient';
import Header from './Header.jsx';
import SideNav from './Sidenav.jsx';

const Layout = () => {
    const [allPosts, setAllPosts] = useState([]);
    const [filteredResults, setFilteredResults] = useState([]);

    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                const { data, error } = await supabase
                    .from("posts")
                    .select("*, user_id(username)");
                if (error) {
                    console.error("Error fetching posts", error.message);
                    throw error;
                }
                setAllPosts(data);
                console.log("Fetched all posts", data);
                
            } catch (error) {
                    console.error("Unexpected error", error.message); 
            } 
        }
        fetchAllPosts();
    }, []);

    return (
        <div className="layout">
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