import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import Home from "./pages/Home";
import Aceleradores from "./pages/Aceleradores";

export default function App() {
  return (
    <>
      <Header />
      <main className="pt-[var(--header-h)]">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 py-4 sm:py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/aceleradores" element={<Aceleradores />} />
          </Routes>
        </div>
      </main>
    </>
  );
}
