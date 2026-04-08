import HeroCopy from "../components/HeroCopy";
import Sidebar from "../components/Sidebar";
import { useState } from "react";

export default function Aceleradores() {
  const [showApp, setShowApp] = useState(false);
  const handleSidebarClick = () => setShowApp(true);

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6">
      <Sidebar onDocumentadorClick={handleSidebarClick} />
      <div className="flex-1 space-y-4 sm:space-y-6">
        <HeroCopy showApp={showApp} onHide={() => setShowApp(false)} />
        {!showApp && (
          <section className="card">
            <div className="card-body flex items-center justify-between p-4 sm:p-6">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">GFT ■</h2>
                <p className="text-sm sm:text-base text-gray-700 mt-1">
                  Haz clic en Documentador para iniciar la aplicación.
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
