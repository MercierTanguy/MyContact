import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import Nav from './pages/nav';

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <AppRoutes />
    </BrowserRouter>
  );
}