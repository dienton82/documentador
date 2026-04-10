export default function Hero() {
  return (
    <section className="relative h-[40vh] sm:h-[48vh] min-h-[280px] sm:min-h-[360px] w-full overflow-hidden rounded-xl sm:rounded-2xl shadow-card border border-gray-100">
      <img src="/imagenes/fon_blanco.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="relative z-10 h-full flex items-center px-4 sm:px-6 md:px-10 bg-white/1">
        <div className="max-w-3xl">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold text-[#3a3b3d]">Documentador</h2>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-light leading-snug text-[#5d5e60] max-w-4xl">
            Automatiza flujos documentales con IA.<br />
            Carga, valida y genera documentos en segundos.<br />
            <span className="font-semibold text-[#3a3b3d]">
              Experiencia moderna, limpia y escalable.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
