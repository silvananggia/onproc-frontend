import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from 'react-router-dom';
import Loading from "../components/layouts/loading";

// Use lazy for importing your components
const Login = lazy(() => import('../components/auth/Login'));
const Register = lazy(() => import('../components/auth/Register'));
const Map = lazy(() => import('../components/home/Home'));
const MapComponent = lazy(() => import('../components/map/MapComponent'));

const LandingPage = lazy(() => import('../components/landingPage/LandingPage'));
const Kontak = lazy(() => import('../components/contact/Kontak'));
const AboutUs = lazy(() => import('../components/about/AboutUs'));
const Disclaimer = lazy(() => import('../components/disclaimer/PernyataanPenafian'));
const ModulCatalog = lazy(() => import('../components/modulCatalog/ModulCatalog'));

//const InfoHotspot = lazy(() => import('../components/frame/InfoHotspot'));
const InfoHotspot = lazy(() => import('../components/frame/hotspot/InfoHotspot'));
const InfoDevegetasi = lazy(() => import('../components/frame/InfoDevegetasi'));
const InfoFasePadi = lazy(() => import('../components/frame/InfoFasePadi'));
const InfoZPPI = lazy(() => import('../components/frame/ZPPI/InfoZPPI'));
const InfoTunafinder = lazy(() => import('../components/frame/tunafinder/InfoTunafinder'));
const InfoRawanSawah = lazy(() => import('../components/frame/RawanSawah/InfoRawanSawah'));
const infoDeforestasi = lazy(() => import('../components/frame/deforestasi/Maps'));
const MapWorkspace = lazy(() => import('../components/mapWorkspace/MapWorkspace'));
const IndeksPenanamanPadi = lazy(() => import('../components/frame/indekspertanaman/Maps'));
const Infografis = lazy(() => import('../components/frame/Infografis'));

const PublicRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userRole = user ? user.role : null;
    if (userRole === 'public') {
        return children;
    }
    return <Navigate to="/signin-app" replace />;
};
function MyRouter() {
    return (
        <Routes>
            <Route path='/' element={
                <Suspense fallback={<Loading />}>
                    <LandingPage />
                </Suspense>
            } />

            <Route path='/kontak' element={
                <Suspense fallback={<Loading />}>
                    <Kontak />
                </Suspense>
            } />
            <Route path='/tentang' element={
                <Suspense fallback={<Loading />}>
                    <AboutUs />
                </Suspense>
            } />
            <Route path='/penafian' element={
                <Suspense fallback={<Loading />}>
                    <Disclaimer />
                </Suspense>
            } />
            <Route path='/katalog-modul' element={
                <Suspense fallback={<Loading />}>
                    <ModulCatalog />
                </Suspense>
            } />

            <Route path='/signin-app' element={
                <Suspense fallback={<Loading />}>
                    <Login />
                </Suspense>
            } />

            <Route path='/register' element={
                <Suspense fallback={<Loading />}>
                    <Register />
                </Suspense>
            } />

            <Route path='/map' element={
                <Suspense fallback={<Loading />}>
                    <PublicRoute>
                        <Map />
                    </PublicRoute>
                </Suspense>
            } />

            <Route path='/info-hotspot' element={
                <Suspense fallback={<Loading />}>
                    <InfoHotspot />
                </Suspense>
            } />
            <Route path='/info-devegetasi' element={
                <Suspense fallback={<Loading />}>
                    <InfoDevegetasi />
                </Suspense>
            } />

            <Route path='/info-fase-padi' element={
                <Suspense fallback={<Loading />}>
                    <InfoFasePadi />
                </Suspense>
            } />

            <Route path='/info-rawan-sawah' element={
                <Suspense fallback={<Loading />}>
                    <InfoRawanSawah />
                </Suspense>
            } />

            <Route path='/indeks-penanaman-padi' element={
                <Suspense fallback={<Loading />}>
                    <IndeksPenanamanPadi />
                </Suspense>
            } />
            <Route path='/info-deforestasi' element={
                <Suspense fallback={<Loading />}>
                    <infoDeforestasi />
                </Suspense>
            } />
            <Route path='/info-zppi' element={
                <Suspense fallback={<Loading />}>
                    <InfoZPPI />
                </Suspense>
            } />
            <Route path='/info-tunafinder' element={
                <Suspense fallback={<Loading />}>
                    <InfoTunafinder />
                </Suspense>
            } />
            <Route path='/map-pangan' element={
                <Suspense fallback={<Loading />}>
                    <PublicRoute>
                        <MapWorkspace />
                    </PublicRoute>
                </Suspense>
            } />

            <Route path='/infografis' element={
                <Suspense fallback={<Loading />}>
                    <Infografis />
                </Suspense>
            } />   
        </Routes>
    );
}

export default MyRouter;
