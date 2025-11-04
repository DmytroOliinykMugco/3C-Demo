import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import Profile from "@/pages/Profile";
import Family from "@/pages/Family";
import Information from "@/pages/Information";
import Balance from "@/pages/Balance";
import Wallet from "@/pages/Wallet";
import Cemetery from "@/pages/Cemetery";
import Funeral from "@/pages/Funeral";
import Property from "@/pages/Property";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/profile" replace />} />
          <Route path="profile" element={<Profile />} />
          <Route path="family" element={<Family />} />
          <Route path="information" element={<Information />} />
          <Route path="balance" element={<Balance />} />
          <Route path="wallet" element={<Wallet />} />
          <Route path="cemetery" element={<Cemetery />} />
          <Route path="funeral" element={<Funeral />} />
          <Route path="property/:id" element={<Property />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
