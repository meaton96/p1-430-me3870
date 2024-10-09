import './App.css'
import CardContainer from './CardContainer'
import Header from './Header'
import Documentation from './docs/Documentation'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import CardViewer from './CardViewer';


function App() {
	return (
		<>
			<Router basename='/'>
				<Header />
				<Routes>
					<Route path='/' element={<CardViewer />} />
					<Route path='/docs' element={<Documentation />} />
				</Routes>
			</Router>
		</>
	)
}

export default App
