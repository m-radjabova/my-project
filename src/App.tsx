import { Route, Routes } from "react-router-dom"

import MainLayout from "./layout/MainLayout"
import DebtorList from "./components/debtor/DebtorList"
import DebtorPage from "./components/debtor/DebtorPage"

function App() {

  return (
    <div>
      <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<DebtorList />} />
            <Route path="/debtor/:id" element={<DebtorPage />} />
          </Route>
      </Routes>
    </div>
  )
}

export default App