import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import UserList from './components/UserList';
import SubscribeForm from './components/SubscribeForm';
import PostForm from './components/PostForm';

function App() {
    return (
            <div className="App">
                <header className="App-header">
                    <h1>Welcome to Reddit Clone</h1>
                    <NavBar />
                </header>
                <Routes>
                    <Route path="/posts" element={<PostList />} />
                    <Route path="/post/:postId" element={<PostDetail />} />
                    <Route path="/users" element={<UserList users={[]} />} />
                    <Route path="/subscribe" element={<SubscribeForm userId="yourUserId" />} />
                    <Route path="/submit" element={<PostForm />} />
                </Routes>
            </div>
    );
}

export default App;
