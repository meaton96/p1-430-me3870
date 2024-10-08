import React, { useState, useEffect } from "react";
import "bulma/css/bulma.min.css";
import { fetchJsonEndpoint } from "./utils/ajax";

function Documentation() {
    const [loading, setLoading] = useState(true);
    const [docs, setDocs] = useState({});
    const [error, setError] = useState('');
    const [collapsedSections, setCollapsedSections] = useState({});

    const toggleSection = (section) => {
        setCollapsedSections((prevState) => ({
            ...prevState,
            [section]: !prevState[section], // Toggle the section state
        }));
    };

    useEffect(() => {
        const getDocs = async () => {
            try {
                const docs = await fetchJsonEndpoint('/api/docs');
                setDocs(docs);
            } catch (err) {
                setError(`Failed to load docs: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        getDocs();
    }, []);

    if (loading) {
        return <div id="loading">Loading...</div>;
    }
    if (error) {
        return <div id="error" style={{ color: 'red' }}>{error}</div>;
    }

    // Generate the menu with anchor links
    const menu = (docs) => {
        return Object.keys(docs).map((section) => (
            <React.Fragment key={section}>
                <p className="menu-label">{section}</p>
                <ul className="menu-list">
                    {Object.keys(docs[section].endpoints).map((method) => (
                        <li key={method}>
                            <a>{method}</a>
                            <ul>
                                {docs[section].endpoints[method].map((endpoint) => (
                                    <li key={endpoint.url}>
                                        <a href={`#${endpoint.url}`}>{endpoint.url}</a>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </React.Fragment>
        ));
    };

    // Render the documentation with section ids
    const renderDocs = (docs) => {
        return Object.keys(docs).map((section) => {
            const isCollapsed = collapsedSections[section]; // Get collapsed state for the section
            return (
                <section key={section} className="section">
                    <h2
                        onClick={() => toggleSection(section)}
                        style={{ cursor: 'pointer' }}
                        className="title is-4"
                    >
                        {section} {isCollapsed ? '▲' : '▼'}
                    </h2>
                    {!isCollapsed && (
                        Object.keys(docs[section].endpoints).map((method) => (
                            <div key={`${section}-${method}`} className="mb-4">
                                <h3 className="title is-5">{method}</h3>
                                <div className="pl-4">
                                    {docs[section].endpoints[method].map((endpoint) => (
                                        <div className="block" key={endpoint.url}>
                                            <h4 id={endpoint.url} className="subtitle is-6">
                                                {endpoint.name}
                                            </h4>
                                            <p className="pl-4">{endpoint.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    )}
                </section>
            );
        });
    };

    return (
        <div className="container is-flex mt-4">
            {/* Sidebar Menu */}
            <aside className="menu" style={{ minWidth: "250px", paddingRight: "20px" }}>
                {menu(docs)}
            </aside>

            {/* Content Section */}
            <div style={{ flex: 1 }}>
                <section className="section">
                    <div className="container">
                        <h1 className="title">Documentation</h1>
                        <p className="subtitle">
                            Welcome to the documentation page. Here you can find information
                            on all available API endpoints.
                        </p>
                    </div>
                    {renderDocs(docs)}
                </section>
            </div>
        </div>
    );
}

export default Documentation;
