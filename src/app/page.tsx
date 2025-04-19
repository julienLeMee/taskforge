// src/app/page.tsx

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="container flex flex-col items-center justify-center gap-8 px-4">
        <h1 className="text-5xl font-extrabold tracking-tight text-center sm:text-[5rem]">
          Task<span className="text-primary">Forge</span>
        </h1>
        <p className="text-xl text-center max-w-2xl text-muted-foreground">
          Application de gestion de projets personnels pour organiser efficacement vos tâches et projets.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full mt-8">
          <div className="p-6 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors">
            <h2 className="text-xl font-semibold mb-2">Gérez vos projets</h2>
            <p className="text-muted-foreground">Créez, organisez et suivez vos projets personnels en toute simplicité.</p>
          </div>
          <div className="p-6 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors">
            <h2 className="text-xl font-semibold mb-2">Suivez vos tâches</h2>
            <p className="text-muted-foreground">Gardez une vue claire sur vos tâches et leur avancement.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
