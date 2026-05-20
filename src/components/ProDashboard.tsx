import { useEffect, useState } from "react";
import { User, Star, Calendar, Award, List, Clock } from "lucide-react";
import { supabase } from "../lib/supabase";
import AvailabilityEditor from "../appointments/components/AvailabilityEditor";
import AppointmentsContainer from "../appointments/components/index";

interface ProDashboardProps {
  profile: any;
}

interface Stats {
  totalCoachings: number;
  declinedAppointments: number;
  averageRating: number;
  totalReviews: number;
}

interface Activity {
  type: "appointment" | "review";
  date: string;
  description: string;
  status?: string;
}

export default function ProDashboard({ profile }: ProDashboardProps) {
  const [stats, setStats] = useState<Stats>({
    totalCoachings: 0,
    declinedAppointments: 0,
    averageRating: 0,
    totalReviews: 0,
  });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"list" | "calendar">("list");
  const [showAvailabilityEditor, setShowAvailabilityEditor] = useState(false);
  const [currentProfile, setCurrentProfile] = useState(profile);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.access_token) return;

        // Fetch all appointments for this professional
        const { data: appointmentsData } = await supabase
          .from("appointments")
          .select("*, user_a:profiles!user_a_id(first_name, last_name)")
          .eq("user_b_id", profile.id);

        // Fetch all reviews for this professional
        const { data: reviews } = await supabase
          .from("reviews")
          .select(
            "*, user_a:profiles!user_a_id(first_name, last_name), appointment:appointments(date)",
          )
          .eq("user_b_id", profile.id)
          .order("created_at", { ascending: false });

        if (appointmentsData && reviews) {
          // Calculate stats dynamically
          const completedCount = appointmentsData.filter(
            (a) => a.status === "COMPLETED",
          ).length;
          const declinedCount = appointmentsData.filter(
            (a) => a.status === "CANCELLED" && a.user_b_id === profile.id,
          ).length;

          const avgRating =
            reviews.length > 0
              ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
              : 0;

          setStats({
            totalCoachings: completedCount,
            declinedAppointments: declinedCount,
            averageRating: avgRating,
            totalReviews: reviews.length,
          });

          // Build recent activity
          const activities: Activity[] = [];

          // Add recent appointments
          appointmentsData
            .filter((a) =>
              ["CONFIRMED", "CANCELLED", "COMPLETED"].includes(a.status),
            )
            .slice(0, 5)
            .forEach((apt) => {
              if (apt.status === "CONFIRMED") {
                activities.push({
                  type: "appointment",
                  date: apt.date,
                  description: `Coaching confirmé`,
                  status: "confirmed",
                });
              } else if (apt.status === "CANCELLED") {
                activities.push({
                  type: "appointment",
                  date: apt.date,
                  description: `Rendez-vous annulé`,
                  status: "cancelled",
                });
              } else if (apt.status === "COMPLETED") {
                activities.push({
                  type: "appointment",
                  date: apt.date,
                  description: `Coaching terminé`,
                  status: "completed",
                });
              }
            });

          // Add recent reviews
          reviews.slice(0, 3).forEach((review) => {
            activities.push({
              type: "review",
              date: review.created_at,
              description: `Nouvel avis ${review.rating} étoiles de ${review.user_a?.first_name || "Utilisateur"}`,
              status: "review",
            });
          });

          // Sort by date and take top 5
          activities.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          );
          setRecentActivity(activities.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [profile.id]);

  const getActivityColor = (status?: string) => {
    switch (status) {
      case "confirmed":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          dot: "bg-green-500",
        };
      case "cancelled":
        return { bg: "bg-red-50", border: "border-red-200", dot: "bg-red-500" };
      case "completed":
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          dot: "bg-blue-500",
        };
      case "review":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          dot: "bg-yellow-500",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          dot: "bg-gray-500",
        };
    }
  };

  const getRelativeTime = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffInMs = now.getTime() - then.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return "Il y a moins d'une heure";
    if (diffInHours < 24)
      return `Il y a ${diffInHours} heure${diffInHours > 1 ? "s" : ""}`;
    if (diffInDays < 7)
      return `Il y a ${diffInDays} jour${diffInDays > 1 ? "s" : ""}`;
    return `Il y a ${Math.floor(diffInDays / 7)} semaine${Math.floor(diffInDays / 7) > 1 ? "s" : ""}`;
  };

  const handleAvailabilitySave = (newAvailability: any) => {
    setCurrentProfile((prev: any) => ({
      ...prev,
      details: {
        ...prev?.details,
        availability: newAvailability,
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="bg-linear-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl overflow-hidden relative">
        <div className="bg-white/10 backdrop-blur-md p-8">
          <div className="flex items-start gap-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-linear-to-br from-white/30 to-white/10 flex items-center justify-center border-4 border-white/50 shadow-2xl">
                <User className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-400 w-8 h-8 rounded-full border-4 border-white shadow-lg"></div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl font-bold mb-2">
                    {currentProfile.first_name} {currentProfile.last_name}
                  </h1>
                  <p className="text-xl text-white/90 mb-2 font-medium">
                    {currentProfile.details?.profession || "Professionnel"}
                    {currentProfile.details?.years_experience && (
                      <span className="text-white/70 ml-2">
                        • {currentProfile.details.years_experience} ans
                        d'expérience
                      </span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => setShowAvailabilityEditor(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-xs transition-all text-sm font-medium border border-white/30"
                >
                  <Clock className="w-4 h-4" />
                  Gérer mes disponibilités
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(stats.averageRating)
                          ? "fill-yellow-300 text-yellow-300"
                          : "text-white/30"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-lg">
                  {stats.averageRating.toFixed(1)}
                </span>
                <span className="text-white/70">
                  ({stats.totalReviews} avis)
                </span>
              </div>

              {/* Bio */}
              {currentProfile.details?.bio && (
                <p className="text-white/90 leading-relaxed max-w-2xl">
                  {currentProfile.details.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex justify-center">
        <div className="bg-gray-100 p-1 rounded-xl inline-flex">
          <button
            onClick={() => setView("list")}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              view === "list"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <List className="w-4 h-4" />
              Vue d'ensemble
            </div>
          </button>
          <button
            onClick={() => setView("calendar")}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              view === "calendar"
                ? "bg-white text-purple-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Calendrier
            </div>
          </button>
        </div>
      </div>

      {view === "calendar" ? (
        <AppointmentsContainer variant="calendar" />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Coachings */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                    Coachings réalisés
                  </p>
                  <p className="text-4xl font-bold text-gray-900 mt-2">
                    {loading ? "..." : stats.totalCoachings}
                  </p>
                </div>
                <div className="bg-indigo-100 p-4 rounded-full">
                  <Award className="w-8 h-8 text-indigo-600" />
                </div>
              </div>
            </div>

            {/* Declined Appointments */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                    RDV déclinés
                  </p>
                  <p className="text-4xl font-bold text-gray-900 mt-2">
                    {loading ? "..." : stats.declinedAppointments}
                  </p>
                </div>
                <div className="bg-red-100 p-4 rounded-full">
                  <Calendar className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </div>

            {/* Average Rating */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">
                    Note moyenne
                  </p>
                  <p className="text-4xl font-bold text-gray-900 mt-2">
                    {loading ? "..." : stats.averageRating.toFixed(1)}
                    <span className="text-xl text-gray-400">/5</span>
                  </p>
                </div>
                <div className="bg-yellow-100 p-4 rounded-full">
                  <Star className="w-8 h-8 text-yellow-600 fill-yellow-600" />
                </div>
              </div>
              <div className="mt-4 text-gray-500 text-sm">
                Basé sur {loading ? "..." : stats.totalReviews} avis
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          {!loading && recentActivity.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Activité récente
              </h2>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => {
                  const colors = getActivityColor(activity.status);
                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-4 p-4 ${colors.bg} rounded-lg border ${colors.border}`}
                    >
                      <div
                        className={`w-2 h-2 ${colors.dot} rounded-full`}
                      ></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {activity.description}
                        </p>
                        <p className="text-sm text-gray-600">
                          {getRelativeTime(activity.date)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      <AvailabilityEditor
        open={showAvailabilityEditor}
        initialAvailability={currentProfile.details?.availability}
        onClose={() => setShowAvailabilityEditor(false)}
        onSave={handleAvailabilitySave}
      />
    </div>
  );
}
