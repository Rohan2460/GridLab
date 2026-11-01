import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import App from './App.tsx'
import  Login  from './pages/Login.tsx'
import  Workspace  from './pages/Workspace.tsx'
import  Student  from './pages/Student.tsx'


createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route index element={<App />} />
                <Route path="/login" element={<Login />} />
                <Route path="/workspace" element={<Workspace />} />
                <Route path="/student" element={<Student />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>,
)
