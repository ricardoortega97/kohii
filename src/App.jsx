import './App.css'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import PostForm from './components/PostForm.jsx'
import Post from './pages/Post.jsx'
import Edit from './components/Edit.jsx'
function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/create" element={<PostForm/>}></Route>
          <Route path='/post/:id' element={<Post/>} />
          <Route path="*" element={<h1>Not Found</h1>} />
          <Route path='/edit/:id' element={<Edit/>}s />

        </Route>
      </Routes>
    </>
  )
}

export default App
