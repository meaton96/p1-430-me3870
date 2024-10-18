import React, { useState, useEffect } from "react";
import "bulma/css/bulma.min.css";
import { fetchJsonEndpoint } from "../utils/ajax";
import DocsRenderer from "./DocsRenderer";

function Documentation() {
    const [loading, setLoading] = useState(true);
    const [docs, setDocs] = useState({});
    const [links, setLinks] = useState([]);
    const [frontendCalls, setFrontendCalls] = useState([]);
    const [error, setError] = useState('');
    const [showInfo, setShowInfo] = useState(true);
    const [showApiUsage, setShowApiUsage] = useState(false);
    const [showLinks, setShowLinks] = useState(false);
    const [showAbove, setShowAbove] = useState(true);

    useEffect(() => {
        const getDocs = async () => {
            try {
                const docs = await fetchJsonEndpoint('/api/docs');
                const docsCopy = JSON.parse(JSON.stringify(docs));
                setLinks(docsCopy.Links);
                setFrontendCalls(docsCopy.FrontendCalls);
                delete docsCopy.Links;
                delete docsCopy.FrontendCalls;
                setDocs(docsCopy);
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

    // Generate the nav menu
    const menu = (docs) => {
        return Object.keys(docs).map((section) => (
            <React.Fragment key={section}>
                <p className="menu-label">{section}</p>
                <ul className="menu-list">
                    {Object.keys(docs[section].endpoints).map((method) => (
                        <li key={`${method}-${section}`}>
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
                            Welcome to the documentation page. Below you can find the API endpoint documentation.
                        </p>
                        <div className="block">
                            <section className="section">
                                <h1
                                    className="title is-4"
                                    onClick={() => setShowInfo(!showInfo)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Info {showInfo ? '▼' : '▲'}
                                </h1>

                                {showInfo && (
                                    <>
                                        <p className="content">
                                            This app is a fully functional card editor to create, delete, update, and view all of the cards in the game Sector Down.
                                        </p>
                                        <p className="content">
                                            The frontend was built to be somewhat responsive in React using Bulma, and almost all of the actual data is served via the API and rendered dynamically, including much of this page.
                                        </p>
                                        <p>
                                            ChatGPT was used for advice on frontend code and used to generate some JSX rendering functions. Not used on backend.
                                        </p>
                                    </>
                                )}
                            </section>
                            <section className="section">
                                <h1
                                    className="title is-4"
                                    onClick={() => setShowApiUsage(!showApiUsage)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    API Usage by Frontend {showApiUsage ? '▼' : '▲'}
                                </h1>
                                {showApiUsage && (
                                    <div>
                                        {frontendCalls.map((data) => (
                                            <div key={data.name} className="block">
                                                <span className="has-text-weight-bold">{data.name}</span>
                                                <p className="pl-2">
                                                    {data.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                            <section className="section">
                                <div>
                                    <h1
                                        className="title is-4"
                                        onClick={() => setShowLinks(!showLinks)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Links {showLinks ? '▼' : '▲'}
                                    </h1>
                                    {showLinks && (
                                        <div className="fixed-grid">
                                            <div className="grid">
                                                {links.map((link) => (
                                                    <div key={link.url} className="cell">
                                                        <button className="button" onClick={() => window.open(link.url, '_blank')}>
                                                            {link.name}
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                            <section className="section">
                                <div className="content">
                                <h1
                                        className="title is-4"
                                        onClick={() => setShowAbove(!showAbove)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Above Requirements {showAbove ? '▼' : '▲'}
                                    </h1>
                                    {showAbove && (
                                        <ul>
                                        <li>16 GET Endpoints across 4 sub APIs (Cards, Frontend, Effects, Assets)</li>
                                        <ul>
                                            <li>Including 5 dynamic endpoints that return multiple matches.</li>
                                            <li>2 Cards endpoints support multiple query params including partial name match for search bar</li>
                                        </ul>
                                        <li>9 Filterable card fields that return all matches including partial name match (search box)</li>
                                        <li>Built in React using fully dynamic API data</li>
                                        <ul>
                                            <li>Ex. This page is rendered from a JSON object. Filter menu on main app is rendered from a JSON object sent from cards API</li>
                                        </ul>
                                        <li>
                                            All GET Cards API endpoints support JSON, XML, or CSV headers and return the appropriate data
                                        </li>
                                        <li>All GET endpoints support HEAD requests with the same accept headers</li>
                                        <li>Future Work:</li>
                                        <ul>
                                            <li>Add database</li>
                                            <li>Require Auth for card edit/delete</li>
                                            <li>PUT/POST for assets and effects APIs</li>
                                        </ul>
                                    </ul>
                                    )}
                                    
                                </div>
                            </section>
                        </div>
                    </div>
                    <DocsRenderer docs={docs} />
                </section>
            </div>
        </div>
    );
}

export default Documentation;