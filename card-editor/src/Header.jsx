import React, { useState } from 'react';

function Header() {
    const [error, setError] = useState(null);

    const downloadCardData = async (format) => {
        setError(null); 
        let acceptHeader;
        let fileExtension;

        switch (format.toLowerCase()) {
            case 'json':
                acceptHeader = 'application/json';
                fileExtension = 'json';
                break;
            case 'xml':
                acceptHeader = 'application/xml';
                fileExtension = 'xml';
                break;
            case 'csv':
                acceptHeader = 'text/csv';
                fileExtension = 'csv';
                break;
            default:
                setError('Unsupported format selected.');
                return;
        }

        try {
            const response = await fetch('/api/cards/all', {
                method: 'GET',
                headers: {
                    'Accept': acceptHeader,
                },
            });

            if (!response.ok) {
                throw new Error(`Error fetching data: ${response.status} ${response.statusText}`);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `cards.${fileExtension}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download failed:', error);
            setError('Failed to download card data. Please try again later.');
        }
    };

    return (
        <header>
            <div className='has-text-centered pt-2'>
                <h1 className='title'>Sector Down Card API</h1>
            </div>

            <div className='container'>
                <nav className='navbar'>
                    <a href="/" className='navbar-item'>Card Viewer</a>
                    <a href="/docs" className='navbar-item'>Documentation</a>
                    <div className="navbar-item has-dropdown is-hoverable">
                        <a className="navbar-link">
                            Download Card Data
                        </a>
                        <div className="navbar-dropdown">
                            <a
                                href="#!"
                                className="navbar-item"
                                onClick={(e) => {
                                    e.preventDefault();
                                    downloadCardData('json');
                                }}
                            >
                                JSON
                            </a>
                            <a
                                href="#!"
                                className="navbar-item"
                                onClick={(e) => {
                                    e.preventDefault();
                                    downloadCardData('xml');
                                }}
                            >
                                XML
                            </a>
                            <a
                                href="#!"
                                className="navbar-item"
                                onClick={(e) => {
                                    e.preventDefault();
                                    downloadCardData('csv');
                                }}
                            >
                                CSV
                            </a>
                        </div>
                    </div>
                </nav>
                {error && (
                    <div className="notification is-danger">
                        {error}
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;