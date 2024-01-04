import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home.jsx';
import Navigation from './components/shared/Navigation/Navigation.jsx';
import Authenticate from './pages/Athenticate/Authenticate.jsx';
import Activate from './pages/Activate/Activate.jsx';
import Rooms from './pages/Rooms/Rooms.jsx';
import {useSelector} from 'react-redux';

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
        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              <Rooms />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

const GuestRoute = ({ children, ...rest }) => {
  const {isAuth} = useSelector((state)=> state.auth);
   return (
    <Route 
     {...rest}
       render={({location}) => {
        return (
             isAuth ?(
             <Navigate to={{
                      pathname: '/rooms',
                      state: { from: location},
            }}
            />
            ):
             (children) 
        );
       }}>
    </Route>)
};

const SemiProtectedRoute =({children, ...rest}) =>{
  const {user, isAuth} = useSelector((state)=> state.auth);
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

const ProtectedRoute =({children, ...rest}) =>{
  const {user, isAuth} = useSelector((state)=> state.auth);
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
           (<Navigate to ={{
            pathname : '/activate',
            state: { from: location}
        }}/>):
            ( children)
         );
      }}>
   </Route>)
};

export default App;

