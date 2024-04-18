import { useRoutes } from 'react-router-dom';
import './App.css';
import {ROUTES} from './routes/routes'


function App() {

  return useRoutes(ROUTES);

}

export default App;