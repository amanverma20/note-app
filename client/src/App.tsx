import './App.css'
import { Routes, Route } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import { Toaster } from 'sonner';
import RedirectIfAuthenticated from './components/auth/RedirectIfAuthenticated';
import RequireAuth from './components/auth/RequireAuth';

function App() {
  return (
    <>
      <Routes>
        <Route path="/sign-up" element={
          <RedirectIfAuthenticated>
            <Signup />
          </RedirectIfAuthenticated>} />
        <Route path="/sign-in" element={
          <RedirectIfAuthenticated>
            <Signin />
          </RedirectIfAuthenticated>
        } />
        <Route path="/" element={<Signup />} />
        <Route path="/dashboard" element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        } />
      </Routes>
      <Toaster richColors position="top-center" />
    </>

  );
}

export default App;

