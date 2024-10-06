import './App.css'

function App() {
	return (
		<div id="main-container">
			<h1>Card API</h1>
			<hr />
			<a href="/api/all-cards">
				<h2>All Cards - "/api/all-cards"</h2>
			</a>
			<br />
			<a href="/api/random-card">
				<h2>Random Card- "/api/random-card"</h2>
			</a>
			<br />
			<a href="/api/recent-card">
				<h2>Recent Card - "/api/recent-card"</h2>
			</a>
		</div>
	)
}

export default App
