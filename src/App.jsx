import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import CaseStudy from './pages/CaseStudy';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/case-study/book-exchange" element={<CaseStudy />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Router>
      <ToastContainer
        position="bottom-right"
        autoClose={3500}
        hideProgressBar
        newestOnTop
        closeOnClick
        theme="light"
        toastStyle={{ background: '#ffffff', border: '1px solid #e2e8f0', color: '#1e293b', fontSize: '13.5px' }}
      />
    </>
  );
}

export default App;
