export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-[10px] font-mono uppercase text-muted-foreground">Chargement du formulaire...</p>
      </div>
    </div>
  );
}
