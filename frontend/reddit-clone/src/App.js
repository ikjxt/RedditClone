import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import UserList from './components/UserList';

function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <h1>Welcome to Reddit Clone</h1>
                </header>
                <Routes>
                    <Route path="/posts" element={<PostList />} />
                    <Route path="/post/:postId" element={<PostDetail />} />
                    <Route path="/users" element={<UserList users={[]} />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
