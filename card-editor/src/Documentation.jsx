import React, { useState } from "react";
import "bulma/css/bulma.min.css";

function Documentation() {
  // State to manage which menus are open (true means the dropdown is open)
  const [openMenus, setOpenMenus] = useState({
    frontend: true,
    cards: true,
    assets: true,
  });

  // State to manage the currently selected endpoint
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);

  // Data for endpoints and descriptions
  const endpointsData = {
    "/": {
      title: "GET /",
      description: "This endpoint returns the homepage data.",
    },
    "/docs": {
      title: "GET /docs",
      description: "This endpoint returns the documentation page.",
    },
    "/api/cards": {
      title: "GET /api/cards",
      description: "This endpoint retrieves a list of all cards.",
    },
    "/api/assets": {
      title: "GET /api/assets",
      description: "This endpoint retrieves asset data.",
    },
  };

  // Function to toggle individual menus
  const toggleMenu = (menu) => {
    setOpenMenus((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  // Function to set the selected endpoint
  const handleEndpointClick = (endpoint) => {
    setSelectedEndpoint(endpoint);
  };

  return (
    <div className="container is-flex mt-4">
      {/* Sidebar Menu */}
      <aside className="menu" style={{ minWidth: "250px", paddingRight: "20px" }}>
        <p className="menu-label">Frontend</p>
        <ul className="menu-list">
          <li>
            <a onClick={() => toggleMenu("frontend")}>GET</a>
            {openMenus.frontend && (
              <ul>
                <li>
                  <a onClick={() => handleEndpointClick("/")}>/</a>
                </li>
                <li>
                  <a onClick={() => handleEndpointClick("/docs")}>/docs</a>
                </li>
              </ul>
            )}
          </li>
        </ul>

        <p className="menu-label">Cards</p>
        <ul className="menu-list">
          <li>
            <a onClick={() => toggleMenu("cards")}>GET</a>
            {openMenus.cards && (
              <ul>
                <li>
                  <a onClick={() => handleEndpointClick("/api/cards")}>
                    /api/cards
                  </a>
                </li>
              </ul>
            )}
          </li>
        </ul>

        <p className="menu-label">Assets</p>
        <ul className="menu-list">
          <li>
            <a onClick={() => toggleMenu("assets")}>GET</a>
            {openMenus.assets && (
              <ul>
                <li>
                  <a onClick={() => handleEndpointClick("/api/assets")}>
                    /api/assets
                  </a>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </aside>

      {/* Content Section */}
      <div style={{ flex: 1 }}>
        <section className="section">
          <div className="container">
            {selectedEndpoint ? (
              <>
                <h1 className="title">{endpointsData[selectedEndpoint].title}</h1>
                <p className="subtitle">
                  {endpointsData[selectedEndpoint].description}
                </p>
              </>
            ) : (
              <>
                <h1 className="title">Welcome to the API Documentation</h1>
                <p className="subtitle">
                  Select an endpoint from the menu to view its details.
                </p>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Documentation;
