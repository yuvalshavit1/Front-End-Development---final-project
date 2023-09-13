import Navbar from './navbar';
import Home from './home';
import Reports from "./reports";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

/*
This function defines a React component named "App."
 It returns a Router component containing a Navbar and a `<div>` container with a "content" class.
 */
function App() {
  return (
      <Router>
        <div className="App">
          <Navbar/>
          <div className="content">
            <Switch>
              <Route exact path="/">
                <Home/>
              </Route>
              <Route path="/report">
                <Reports/>
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
  )
}

export default App;