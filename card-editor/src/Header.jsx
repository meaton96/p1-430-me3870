import React from 'react';

function Header() {
    return (
        <header style={headerStyle}>
            <h1 style={titleStyle}>Sector Down Card API</h1>
            <nav>
                <ul style={navStyle}>
                    <li style={navItemStyle}><a href="/" style={linkStyle}>Card Viewer</a></li>
                    <li style={navItemStyle}><a href="/docs" style={linkStyle}>Documentation</a></li>
                </ul>
            </nav>
        </header>
    );
}

const headerStyle = {
    backgroundColor: '#333',
    color: '#fff',
    padding: '10px',
    textAlign: 'center',
};

const titleStyle = {
    margin: '0',
    fontSize: '2rem',
};

const navStyle = {
    listStyle: 'none',
    padding: 0,
    margin: '10px 0',
    display: 'flex',
    justifyContent: 'center',
};

const navItemStyle = {
    margin: '0 15px',
};

const linkStyle = {
    color: '#fff',
    textDecoration: 'none',
};

export default Header;