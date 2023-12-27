import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home.jsx';
import Navigation from './components/shared/Navigation/Navigation.jsx';
import Authenticate from './pages/Athenticate/Authenticate.jsx';
import Activate from './pages/Activate/Activate.jsx';

const isAuth = true;
const user ={
  activated : true,
}


function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route
          path="/"
          element={
            <GuestRoute>
              <Home />
            </GuestRoute>
          }
        />
        <Route
          path="/authenticate"
          element={
            <GuestRoute>
              <Authenticate />
            </GuestRoute>
          }
        />
        <Route
          path="/activate"
          element={
            <SemiProtectedRoute>
              <Activate />
            </SemiProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

const GuestRoute = ({ children }) => {
  return isAuth ? (
    <Navigate to="/rooms" />
  ) : (
    children
  );
};

const SemiProtectedRoute =({children, ...rest}) =>{
   return (
    <Route {...rest}
       render={({location}) => {
        return (
             !isAuth ?(
             <Navigate to={{
                      pathname: '/',
                      state: { from: location}
            }}/>
            ): isAuth && !user.activated ?
             (children) :
             <Navigate to ={{
                 pathname : '/rooms',
                 state: { from: location}
             }}/>
          );
       }}>
    </Route>)
};

export default App;

