import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-display text-[40px]">404</h1>
      <Link to="/" className="text-purple font-bold">
        Retour accueil
      </Link>
    </div>
  );
}
