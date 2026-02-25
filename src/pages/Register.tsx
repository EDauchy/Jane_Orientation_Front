import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AvailabilityEditor from "../components/AvailabilityEditor";
import JaneButton from "../components/JaneButton";

export default function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "user_reconversion", // Default
    birthDate: "",
    gender: "PREFER_NOT_SAY",
    cityPreference: "",
    profession: "",
    experienceVerified: false,
    bio: "",
    yearsExperience: "",
  });
  const [availability, setAvailability] = useState<Record<string, string[]>>(
    {}
  );
  const [showAvailabilityEditor, setShowAvailabilityEditor] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role,
          birthDate: formData.birthDate || undefined,
          gender: formData.gender,
          cityPreference:
            formData.role === "user_reconversion"
              ? formData.cityPreference
              : undefined,
          profession:
            formData.role === "user_pro" ? formData.profession : undefined,
          experienceVerified:
            formData.role === "user_pro"
              ? formData.experienceVerified
              : undefined,
          availability:
            formData.role === "user_pro" && Object.keys(availability).length > 0
              ? availability
              : undefined,
          bio: formData.role === "user_pro" ? formData.bio : undefined,
          yearsExperience:
            formData.role === "user_pro" && formData.yearsExperience
              ? parseInt(formData.yearsExperience, 10)
              : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle validation errors (array) or single error message
        if (Array.isArray(data.error)) {
          const errorMessages = data.error
            .map((e: { path?: string[]; message: string }) => {
              const field = e.path?.join(".") || "champ";
              return `${field}: ${e.message}`;
            })
            .join(", ");
          throw new Error(`Erreur de validation: ${errorMessages}`);
        }

        // Check if it's a duplicate email error and enhance the message
        const errorMsg =
          data.error || "Échec de l'inscription. Veuillez réessayer.";
        if (
          errorMsg.toLowerCase().includes("existe déjà") ||
          errorMsg.toLowerCase().includes("already") ||
          errorMsg.toLowerCase().includes("déjà")
        ) {
          throw new Error(
            errorMsg + " Si vous avez déjà un compte, veuillez vous connecter."
          );
        }

        throw new Error(errorMsg);
      }

      navigate("/login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  };

  const getAvailabilitySummary = () => {
    if (Object.keys(availability).length === 0) {
      return "Non configurées (7j/7 7h-20h par défaut)";
    }
    const dayLabels: Record<string, string> = {
      monday: "Lun",
      tuesday: "Mar",
      wednesday: "Mer",
      thursday: "Jeu",
      friday: "Ven",
      saturday: "Sam",
      sunday: "Dim",
    };
    const days = Object.keys(availability)
      .map((day) => dayLabels[day])
      .filter(Boolean)
      .join(", ");
    return `Configurées: ${days}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer un compte
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Je suis...
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="user_reconversion">En reconversion</option>
              <option value="user_pro">Professionnel</option>
            </select>
          </div>

          {/* Common Fields */}
          <div className="rounded-md shadow-xs -space-y-px">
            <input
              name="firstName"
              type="text"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-hidden focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Prénom"
              value={formData.firstName}
              onChange={handleChange}
            />
            <input
              name="lastName"
              type="text"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-hidden focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Nom"
              value={formData.lastName}
              onChange={handleChange}
            />
            <input
              name="email"
              type="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-hidden focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              name="password"
              type="password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-hidden focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
            />
            <input
              name="confirmPassword"
              type="password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-hidden focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Confirmer mot de passe"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          {/* Birth Date & Gender */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date de naissance
              </label>
              <input
                name="birthDate"
                type="date"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs focus:outline-hidden focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.birthDate}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Genre
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-xs focus:outline-hidden focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="PREFER_NOT_SAY">Je préfère ne pas dire</option>
                <option value="M">Homme</option>
                <option value="F">Femme</option>
              </select>
            </div>
          </div>

          {/* User A Specific */}
          {formData.role === "user_reconversion" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ville préférée
              </label>
              <input
                name="cityPreference"
                type="text"
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs placeholder-gray-400 focus:outline-hidden focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.cityPreference}
                onChange={handleChange}
              />
            </div>
          )}

          {/* User B Specific */}
          {formData.role === "user_pro" && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Profession
                </label>
                <input
                  name="profession"
                  type="text"
                  required
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs placeholder-gray-400 focus:outline-hidden focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={formData.profession}
                  onChange={handleChange}
                />
              </div>

              {/* Availability Section */}
              <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mes disponibilités
                </label>
                <p className="text-xs text-gray-600 mb-3">
                  📅 Si vous ne configurez pas vos disponibilités, vous serez
                  considéré comme disponible 7j/7 de 7h à 20h. Vous pourrez
                  toujours proposer une autre date ou annuler un rendez-vous qui
                  ne vous convient pas.
                </p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    {getAvailabilitySummary()}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowAvailabilityEditor(true)}
                    className="px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Définir mes horaires
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Biographie
                </label>
                <textarea
                  name="bio"
                  rows={4}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs placeholder-gray-400 focus:outline-hidden focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Décrivez votre parcours, vos compétences et votre approche..."
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Années d'expérience
                </label>
                <input
                  name="yearsExperience"
                  type="number"
                  min="0"
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-xs placeholder-gray-400 focus:outline-hidden focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Ex: 5"
                  value={formData.yearsExperience}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center">
                <input
                  id="experienceVerified"
                  name="experienceVerified"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded-sm"
                  checked={formData.experienceVerified}
                  onChange={handleChange}
                />
                <label
                  htmlFor="experienceVerified"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Je certifie que j'exerce ce métier au moins depuis 3 ans
                </label>
              </div>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <div>
            <JaneButton type="submit" size="sm" className="w-full">
              S'inscrire
            </JaneButton>
          </div>
          <div className="pt-2 text-center">
            <JaneButton to="/login" size="xl">
              Déjà un compte ? Se connecter
            </JaneButton>
          </div>
        </form>

        {/* Availability Editor Modal */}
        {showAvailabilityEditor && (
          <AvailabilityEditor
            initialAvailability={availability}
            onClose={() => setShowAvailabilityEditor(false)}
            onSave={(newAvailability) => setAvailability(newAvailability)}
            isRegistration={true}
          />
        )}
      </div>
    </div>
  );
}
