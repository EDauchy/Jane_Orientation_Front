import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, ChevronLeft } from "lucide-react";
import { supabase } from "../lib/supabase";
import JaneButton from "./JaneButton";
import FormError, { FieldError } from "./ui/FormError";
import {
  loginSchema,
  registerReconversionSchema,
  registerProSchema,
  type LoginFormData,
  type RegisterFormData,
} from "../schemas/auth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalMode = "login" | "register";

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [mode, setMode] = useState<ModalMode>("login");
  const [registerStep, setRegisterStep] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Login form with react-hook-form + Zod
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Register form state (using manual state for multi-step compatibility)
  const [formData, setFormData] = useState<RegisterFormData>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    role: "",
    profession: "",
    experienceVerified: false,
  });
  const [registerErrors, setRegisterErrors] = useState<Record<string, string>>({});

  // Handle login submit
  const handleLogin = async (data: LoginFormData) => {
    setServerError(null);

    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

      if (authError) {
        // Translate common Supabase errors
        if (authError.message.includes("Invalid login credentials")) {
          setServerError("Email ou mot de passe incorrect");
        } else if (authError.message.includes("Email not confirmed")) {
          setServerError("Veuillez confirmer votre email avant de vous connecter");
        } else {
          setServerError(authError.message);
        }
        return;
      }

      if (authData.session) {
        onClose();
        navigate("/dashboard");
      }
    } catch {
      setServerError("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  // Validate register form based on role
  const validateRegisterForm = (): boolean => {
    const schema =
      formData.role === "user_pro"
        ? registerProSchema
        : registerReconversionSchema;

    const result = schema.safeParse(formData);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        errors[path] = issue.message;
      });
      setRegisterErrors(errors);
      return false;
    }

    setRegisterErrors({});
    return true;
  };

  const handleRegisterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear field error when user types
    if (registerErrors[name]) {
      setRegisterErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // Validate with Zod
    if (!validateRegisterForm()) {
      return;
    }

    setIsLoading(true);

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
          profession:
            formData.role === "user_pro" ? formData.profession : undefined,
          experienceVerified:
            formData.role === "user_pro" ? formData.experienceVerified : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (Array.isArray(data.error)) {
          const errorMessages = data.error
            .map((e: { path?: string[]; message: string }) => e.message)
            .join(". ");
          throw new Error(errorMessages);
        }
        throw new Error(data.error || "Échec de l'inscription. Veuillez réessayer.");
      }

      // Success - switch to login mode
      setMode("login");
      loginForm.setValue("email", formData.email);
      loginForm.setValue("password", "");
      setRegisterStep(0);
      setServerError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setServerError(err.message);
      } else {
        setServerError("Une erreur est survenue");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const canSubmit = () => {
    if (formData.role === "user_pro") {
      return formData.profession && formData.experienceVerified;
    }
    return true;
  };

  const switchToRegister = () => {
    setMode("register");
    setServerError(null);
    setRegisterStep(0);
    setFormData((prev) => ({ ...prev, role: "" }));
    setRegisterErrors({});
  };

  const switchToLogin = () => {
    setMode("login");
    setServerError(null);
    loginForm.clearErrors();
  };

  // Boutons réutilisables pour mobile et desktop
  const renderButtons = () => (
    <>
      {mode === "login" && (
        <>
          <JaneButton type="button" onClick={switchToRegister} size="xs" className="w-max">
            Inscrivez-vous
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 17L17 7M17 7H7M17 7v10"
              />
            </svg>
          </JaneButton>

          <JaneButton type="submit" form="login-form" size="xl">
            Connexion
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 -rotate-90"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 7L7 17M7 17h10M7 17V7"
              />
            </svg>
          </JaneButton>
        </>
      )}

      {mode === "register" && registerStep === 0 && (
        <JaneButton type="button" onClick={switchToLogin} size="md">
          Deja un compte ?
        </JaneButton>
      )}

      {mode === "register" && registerStep === 1 && (
        <>
          <JaneButton
            type="button"
            onClick={() => setRegisterStep(0)}
            size="xs"
            className="w-fit"
          >
            <ChevronLeft className="h-4 w-4" />
            Retour
          </JaneButton>

          <JaneButton
            type="submit"
            form="register-form"
            disabled={isLoading || !canSubmit()}
            size="xl"
          >
            {isLoading ? "Inscription..." : "S'inscrire"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3.5 w-3.5 -rotate-90"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 7L7 17M7 17h10M7 17V7"
              />
            </svg>
          </JaneButton>
        </>
      )}
    </>
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/20 backdrop-blur-sm overflow-y-auto py-6 sm:py-4"
      onClick={onClose}
    >
      <div
        className="relative mx-6 sm:mx-4 max-w-4xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Container - simple on mobile, clip-path on desktop */}
        <div
          className="bg-primary px-6 py-8 sm:px-8 sm:pt-8 sm:pb-32 w-full sm:min-h-[515px] flex flex-col justify-center items-center rounded-4xl sm:rounded-3xl modal-cutout"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile close button - simple, top right */}
          <button
            onClick={onClose}
            className="flex sm:hidden self-end -mt-2 -mr-2 mb-4 w-10 h-10 rounded-full bg-white/20 items-center justify-center text-white"
          >
            <X className="h-5 w-5" strokeWidth={3} />
          </button>

          {/* ============ LOGIN MODE ============ */}
          {mode === "login" && (
            <>
              <h2 className="font-montserrat text-center text-3xl md:text-4xl font-black text-white mb-8 uppercase sm:mt-16">
                Connecte toi !
              </h2>

              <form
                id="login-form"
                onSubmit={loginForm.handleSubmit(handleLogin)}
                className="space-y-6 w-full max-w-md"
              >
                <div className="flex flex-col gap-4">
                  {/* Email Input */}
                  <div className="flex flex-col gap-1 w-full">
                    <label className="text-white text-sm font-medium ml-1">
                      Email
                    </label>
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-1.5 flex items-center pointer-events-none">
                        <div className="w-12 h-12 rounded-[10px] bg-primary flex items-center justify-center">
                          <span className="text-white text-2xl font-bold">@</span>
                        </div>
                      </div>
                      <input
                        {...loginForm.register("email")}
                        type="email"
                        autoComplete="email"
                        className={`w-full pl-16 pr-4 h-14 rounded-xl bg-white text-gray-700 placeholder-gray-400 text-md focus:outline-none focus:ring-2 ${
                          loginForm.formState.errors.email
                            ? "ring-2 ring-red-400"
                            : "focus:ring-white"
                        }`}
                        placeholder="email@email.fr"
                      />
                    </div>
                    <FieldError message={loginForm.formState.errors.email?.message} />
                  </div>

                  {/* Password Input */}
                  <div className="flex flex-col gap-1 w-full">
                    <label className="text-white text-sm font-medium ml-1">
                      Mot de passe
                    </label>
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-1.5 flex items-center pointer-events-none">
                        <div className="w-12 h-12 rounded-[10px] bg-primary flex items-center justify-center">
                          <img src="key.png" className="h-5 w-5 -rotate-45 text-white" alt="" />
                        </div>
                      </div>
                      <input
                        {...loginForm.register("password")}
                        type="password"
                        autoComplete="current-password"
                        className={`w-full pl-16 pr-24 h-14 rounded-xl bg-white text-gray-700 placeholder-gray-400 text-md focus:outline-none focus:ring-2 ${
                          loginForm.formState.errors.password
                            ? "ring-2 ring-red-400"
                            : "focus:ring-white"
                        }`}
                        placeholder="Mot de passe"
                      />
                      <button
                        type="button"
                        className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[9px] font-bold bg-primary text-white px-2 py-3 rounded uppercase tracking-tight"
                      >
                        J'ai oublie
                      </button>
                    </div>
                    <FieldError message={loginForm.formState.errors.password?.message} />
                  </div>
                </div>

                {/* Server error at bottom */}
                {serverError && <FormError message={serverError} />}
              </form>
            </>
          )}

          {/* ============ REGISTER MODE ============ */}
          {mode === "register" && (
            <>
              <h2 className="font-montserrat text-center text-2xl md:text-3xl font-black text-white mb-4 uppercase mt-4">
                Inscrivez-vous !
              </h2>

              <form
                id="register-form"
                onSubmit={handleRegisterSubmit}
                className="space-y-4 w-full max-w-2xl"
              >
                {/* Step 0: Role Selection */}
                {registerStep === 0 && (
                  <div className="flex flex-col items-center gap-6 py-8 w-full">
                    <p className="text-white text-center text-lg mb-2">Je cherche...</p>
                    <div className="flex flex-col gap-4 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, role: "user_reconversion" }));
                          setRegisterStep(1);
                        }}
                        className="px-8 py-4 rounded-2xl bg-white text-jane-purple font-bold text-lg uppercase transition-all hover:scale-105 hover:shadow-lg w-full sm:min-w-[300px]"
                      >
                        A m'orienter
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({ ...prev, role: "user_pro" }));
                          setRegisterStep(1);
                        }}
                        className="px-8 py-4 rounded-2xl bg-white/20 text-white font-bold text-lg uppercase transition-all hover:bg-white/30 hover:scale-105 w-full sm:min-w-[300px] border-2 border-white/50"
                      >
                        A aider ceux qui cherchent
                      </button>
                    </div>
                  </div>
                )}

                {registerStep === 1 && (
                  <>
                    {/* Name Fields */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center w-full">
                      <div className="flex flex-col gap-1 w-full sm:w-auto">
                        <label className="text-white text-sm font-medium ml-1">Prenom</label>
                        <input
                          name="firstName"
                          type="text"
                          className={`w-full sm:w-80 px-4 h-12 rounded-xl bg-white text-gray-700 placeholder-gray-400 text-md focus:outline-none focus:ring-2 ${
                            registerErrors.firstName ? "ring-2 ring-red-400" : "focus:ring-white"
                          }`}
                          placeholder="Votre prenom"
                          value={formData.firstName}
                          onChange={handleRegisterChange}
                        />
                        <FieldError message={registerErrors.firstName} />
                      </div>
                      <div className="flex flex-col gap-1 w-full sm:w-auto">
                        <label className="text-white text-sm font-medium ml-1">Nom</label>
                        <input
                          name="lastName"
                          type="text"
                          className={`w-full sm:w-80 px-4 h-12 rounded-xl bg-white text-gray-700 placeholder-gray-400 text-md focus:outline-none focus:ring-2 ${
                            registerErrors.lastName ? "ring-2 ring-red-400" : "focus:ring-white"
                          }`}
                          placeholder="Votre nom"
                          value={formData.lastName}
                          onChange={handleRegisterChange}
                        />
                        <FieldError message={registerErrors.lastName} />
                      </div>
                    </div>

                    {/* Email - Full Width */}
                    <div className="flex flex-col gap-1 w-full">
                      <label className="text-white text-sm font-medium ml-1">Email</label>
                      <div className="relative w-full">
                        <div className="absolute inset-y-0 left-1.5 flex items-center pointer-events-none">
                          <div className="w-10 h-10 rounded-[10px] bg-primary flex items-center justify-center">
                            <span className="text-white text-xl font-bold">@</span>
                          </div>
                        </div>
                        <input
                          name="email"
                          type="email"
                          className={`w-full pl-14 h-12 rounded-xl bg-white text-gray-700 placeholder-gray-400 text-md focus:outline-none focus:ring-2 ${
                            registerErrors.email ? "ring-2 ring-red-400" : "focus:ring-white"
                          }`}
                          placeholder="email@email.fr"
                          value={formData.email}
                          onChange={handleRegisterChange}
                        />
                      </div>
                      <FieldError message={registerErrors.email} />
                    </div>

                    {/* Password & Confirm Password */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center w-full">
                      <div className="flex flex-col gap-1 w-full sm:w-auto">
                        <label className="text-white text-sm font-medium ml-1">Mot de passe</label>
                        <input
                          name="password"
                          type="password"
                          className={`w-full sm:w-80 px-4 h-12 rounded-xl bg-white text-gray-700 placeholder-gray-400 text-md focus:outline-none focus:ring-2 ${
                            registerErrors.password ? "ring-2 ring-red-400" : "focus:ring-white"
                          }`}
                          placeholder="Votre mot de passe"
                          value={formData.password}
                          onChange={handleRegisterChange}
                        />
                        <FieldError message={registerErrors.password} />
                      </div>
                      <div className="flex flex-col gap-1 w-full sm:w-auto">
                        <label className="text-white text-sm font-medium ml-1">Confirmation</label>
                        <input
                          name="confirmPassword"
                          type="password"
                          className={`w-full sm:w-80 px-4 h-12 rounded-xl bg-white text-gray-700 placeholder-gray-400 text-md focus:outline-none focus:ring-2 ${
                            registerErrors.confirmPassword ? "ring-2 ring-red-400" : "focus:ring-white"
                          }`}
                          placeholder="Confirmer mot de passe"
                          value={formData.confirmPassword}
                          onChange={handleRegisterChange}
                        />
                        <FieldError message={registerErrors.confirmPassword} />
                      </div>
                    </div>

                    {/* User Pro specific fields */}
                    {formData.role === "user_pro" && (
                      <>
                        <div className="flex flex-col gap-1 w-full">
                          <label className="text-white text-sm font-medium ml-1">Profession</label>
                          <input
                            name="profession"
                            type="text"
                            className={`w-full px-4 h-12 rounded-xl bg-white text-gray-700 placeholder-gray-400 text-md focus:outline-none focus:ring-2 ${
                              registerErrors.profession ? "ring-2 ring-red-400" : "focus:ring-white"
                            }`}
                            placeholder="Votre profession"
                            value={formData.profession}
                            onChange={handleRegisterChange}
                          />
                          <FieldError message={registerErrors.profession} />
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <label className="flex items-center gap-4 cursor-pointer group">
                            <div className="relative">
                              <input
                                type="checkbox"
                                name="experienceVerified"
                                checked={formData.experienceVerified}
                                onChange={handleRegisterChange}
                                className="sr-only peer"
                              />
                              <div
                                className={`w-6 h-6 rounded-md border-2 bg-white/10 peer-checked:bg-white peer-checked:border-white transition-all flex items-center justify-center ${
                                  registerErrors.experienceVerified
                                    ? "border-red-400"
                                    : "border-white"
                                }`}
                              >
                                <svg
                                  className={`w-4 h-4 text-jane-purple transition-opacity ${
                                    formData.experienceVerified ? "opacity-100" : "opacity-0"
                                  }`}
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  strokeWidth={3}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                            </div>
                            <span className="text-white text-sm font-medium">
                              Je certifie exercer ce metier depuis 3 ans+
                            </span>
                          </label>
                          <FieldError message={registerErrors.experienceVerified} />
                        </div>
                      </>
                    )}
                  </>
                )}

                {/* Server error at bottom */}
                {serverError && <FormError message={serverError} />}
              </form>
            </>
          )}

          {/* MOBILE BUTTONS - inside the container */}
          <div className="flex sm:hidden flex-col gap-3 justify-center mt-6">
            {renderButtons()}
          </div>
        </div>

        {/* Close button - desktop only, floats in cutout */}
        <button
          onClick={onClose}
          className="hidden sm:flex absolute top-3 right-3 w-14 h-14 rounded-full bg-primary-light items-center justify-center text-white hover:bg-pink transition-colors z-10"
        >
          <X className="h-7 w-7" strokeWidth={3} />
        </button>

        {/* DESKTOP BUTTONS - floating in the cutout area */}
        <div className="hidden sm:flex flex-row gap-3 justify-center absolute bottom-3 left-[72%] -translate-x-1/2">
          {renderButtons()}
        </div>
      </div>
    </div>
  );
}
