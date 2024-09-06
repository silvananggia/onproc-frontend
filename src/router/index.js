import React, { Suspense, lazy } from "react";
import { Routes, Route } from 'react-router-dom';


// Use lazy for importing your components
const Login = lazy(() => import('../components/auth/Login'));
const Register = lazy(() => import('../components/auth/Register'));
const Home = lazy(() => import('../components/home/Home'));
const MapComponent = lazy(() => import('../components/map/MapComponent'));


function MyRouter() {
    return (
        <Routes>
            <Route path='/' element={
                <Suspense fallback={"Loading .."}>
                    <Login />
                </Suspense>
            } />

              <Route path='/register' element={
                <Suspense fallback={"Loading .."}>
                    <Register />
                </Suspense>
            } />

            <Route path='/map' element={
                <Suspense fallback={"Loading .."}>
                    <Home />
                </Suspense>
            } />
            
        </Routes>
    );
}

export default MyRouter;
