import { Route, Routes } from 'react-router-dom'
import { routes } from './routes/routes'
import LayOut from './components/LayOut'
import TenantRegistrationPage from './pages/TenantRegistrationPage'
import './App.css'

function App() {

  return (
    <Routes>
      <Route path="/register-tenant" element={<TenantRegistrationPage />} />
      <Route element={<LayOut />}>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={<route.element />} />
        ))}
      </Route>
    </Routes>
  )
}

export default App
