import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Trails from "./pages/Trails";
import TrailDetailsPage from "./pages/TrailDetailsPage";

export default function App() {
  return (
    <>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trails" element={<Trails />} />
          <Route path="/trails/:id" element={<TrailDetailsPage />} />
        </Routes>
      </main>
    </>
  );
}
