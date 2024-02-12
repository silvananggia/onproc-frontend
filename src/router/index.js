import React, { Suspense, lazy } from "react";
import { Routes, Route } from 'react-router-dom';


// Use lazy for importing your components
const Home = lazy(() => import('../components/Home'));
const MapComponent = lazy(() => import('../components/map/MapComponent'));


function MyRouter() {
    return (
        <Routes>
            <Route path='/' element={
                <Suspense fallback={"Loading .."}>
                    <Home />
                </Suspense>
            } />
            <Route path='/map' element={
                <Suspense fallback={"Loading .."}>
                    <MapComponent />
                </Suspense>
            } />
            
        </Routes>
    );
}

export default MyRouter;
