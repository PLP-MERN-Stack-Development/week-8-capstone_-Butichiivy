import React from "react";
import { useNavigate } from "react-router-dom";

function Header({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <header style={{
      background: '#005fa3',
      color: 'white',
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h2>Chronicare</h2>
      <div>
        {user && <span style={{ marginRight: '15px' }}>Welcome, {user.name}</span>}
        <button onClick={() => {
          onLogout();
          navigate("/login");
        }}>Logout</button>
      </div>
    </header>
  );
}

export default Header;
