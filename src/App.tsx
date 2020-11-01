import React from 'react';
import { Route, Link } from 'react-router-dom';

export function App() {
  const home = '/';
  const about = '/about';

  return (<div>
    <Link to={home}>home</Link>
    <Link to={about}>about</Link>
  <Route exact path={home} component={() => <div>Home {home}</div>} />
    <Route exact path={about} component={() => <div>About {about}</div>} />
  </div>)
}
