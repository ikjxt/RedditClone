import React from 'react';

const UserList = ({ users }) => {
    return (
        <div>
            <h2>Users</h2>
            <ul>
                {users.map(user => (
                    <li key={user._id}>
                        <h3>{user.username}</h3>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
