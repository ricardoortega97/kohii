import './App.css'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import PostForm from './components/PostForm.jsx'
import Post from './pages/Post.jsx'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/create" element={<PostForm/>}></Route>
          <Route path='/post/:id' element={<Post/>} />

        </Route>
      </Routes>
    </>
  )
}

export default App
