
import './App.css';
import Card from './components/card';
import { ToastContainer } from 'react-toastify';
function App() {
  return (
    <div className="App">

      <Card/>
      <ToastContainer position="top-center" autoClose={5000}>


      </ToastContainer>


    </div>
  );
}

export default App;
