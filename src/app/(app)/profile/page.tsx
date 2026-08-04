import { getCurrentUserPrefs } from "@/lib/auth/current-user";
import { ProfileForm } from "@/components/profile/profile-form";

export default async function ProfilePage() {
  const user = await getCurrentUserPrefs();

  return (
    <div className="flex max-w-2xl flex-col gap-fib21">
      <ProfileForm
        name={user.name}
        email={user.email}
        image={user.image}
        emailVerified={!!user.emailVerified}
        role={user.role}
        memberSince={user.createdAt}
      />
    </div>
  );
}
