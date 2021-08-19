import './App.css';
import Main from './components/Views/Main';
import {BrowserRouter} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'primereact/resources/themes/saga-green/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import {io} from 'socket.io-client';
import {domain} from './components/Constant/APIConstant';

const socket = io(domain);
global.socket=socket;
socket.on('connected',()=>{
  let lSocketID = localStorage.getItem('socketID');
  (lSocketID) ? lSocketID = JSON.parse(lSocketID) : lSocketID=[];
  lSocketID.push(socket.id);
  localStorage.setItem('socketID',JSON.stringify(lSocketID));
});


function App() {
  return (
      <BrowserRouter>
        <Main/>
      </BrowserRouter>  
  );
}

export default App;
