import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Home from './pages/home.jsx';
import Navigation from './components/shared/Navigation/Navigation.jsx';
import Authenticate from './pages/Athenticate/Authenticate.jsx';
import Activate from './pages/Activate/Activate.jsx';
import Rooms from './pages/Rooms/Rooms.jsx';
import { useSelector } from 'react-redux';

function App() {
  return (
    <Router>
      <Navigation />
      <Routes>
        <Route element={<GuestRoute />}>
          <Route element={<Home />} path="/" exact />
          <Route element={<Authenticate />} path="/authenticate" />
        </Route>
        <Route element={<SemiProtectedRoute />} >
          <Route element={<Activate />} path="/activate" />
        </Route>
        <Route element={<ProtectedRoute />} >
          <Route element={<Rooms />} path="/rooms" />
        </Route>
      </Routes>
    </Router>
  );
}

const GuestRoute = () => {
  const { isAuth } = useSelector((state) => state.auth);
  return (
    isAuth ? (
      <Navigate
        to='/rooms'
      />
    ) : <Outlet />
  );
};


const SemiProtectedRoute = () => {
  const { user, isAuth } = useSelector((state) => state.auth);
  return (
    !isAuth ? (
      <Navigate
        to='/'
      />
    ) : isAuth && !user.activated ? <Outlet /> : (
      <Navigate
        to='/rooms'
      />
    )
  );
};

const ProtectedRoute = () => {
  const { user, isAuth } = useSelector((state) => state.auth);
  return (
    !isAuth ? (
      <Navigate
        to='/'
      />
    ) : isAuth && !user.activated ? (
      <Navigate
        to='/activate'
      />
    ) : <Outlet />
  );
};

export default App;

