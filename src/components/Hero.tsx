export default function Hero() {
  return (
    <section className="relative h-[40vh] sm:h-[48vh] min-h-[280px] sm:min-h-[360px] w-full overflow-hidden rounded-xl sm:rounded-2xl shadow-card border border-gray-100">
      <video className="absolute inset-0 h-full w-full object-cover" autoPlay muted loop playsInline
        src="https://www.gft.com/img/motion_loop_home.mp4" />
      <div className="absolute inset-0 bg-white/70" />
      <div className="relative z-10 h-full flex items-center px-4 sm:px-6 md:px-10 bg-white/1">
        <div className="max-w-3xl">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-semibold text-gray-900">GFT ■</h2>
          <p className="text-2xl sm:text-3xl lg:text-4xl font-light leading-snug text-slate-800 max-w-4xl">
            Socio global en IA y banca.<br />
            Creamos impacto real con tecnología y datos.<br />
            <span className="font-semibold text-slate-900">
              Transformamos tu negocio con resultados medibles.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
