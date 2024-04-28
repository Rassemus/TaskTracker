
import './App.css';
import Tracker from './components/Tracker'
import { PostFromLocaStorage } from './components/Utils';

window.addEventListener('online', async () => {
  PostFromLocaStorage();
})

function App() {
  return (
    <div className="App">
      <Tracker />
    </div>
  );
}

export default App;
