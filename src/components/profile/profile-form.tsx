"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, BadgeCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { updateProfileSchema, type UpdateProfileInput } from "@/lib/validation/user";
import { updateProfileAction } from "@/lib/actions/user";

const memberSinceFormatter = new Intl.DateTimeFormat("en-CA", { month: "long", year: "numeric" });

function initials(name?: string | null, email?: string | null): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
  }
  return email?.[0]?.toUpperCase() ?? "?";
}

interface ProfileFormProps {
  name: string | null;
  email: string;
  image: string | null;
  emailVerified: boolean;
  role: "USER" | "ADMIN";
  memberSince: Date;
}

export function ProfileForm({ name, email, image, emailVerified, role, memberSince }: ProfileFormProps) {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { name: name ?? "", image: image ?? "" },
  });

  const watchedName = watch("name");
  const watchedImage = watch("image");

  async function onSubmit(values: UpdateProfileInput) {
    const result = await updateProfileAction(values);
    if (!result.success) {
      toast.error(result.formError ?? "Couldn't save your profile. Please try again.");
      return;
    }
    toast.success("Profile updated.");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your personal info.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-fib21">
          <div className="flex items-center gap-fib13">
            <Avatar className="h-16 w-16">
              {watchedImage && <AvatarImage src={watchedImage} alt="" />}
              <AvatarFallback className="text-lg">{initials(watchedName, email)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-1 flex-col gap-fib5">
              <Label htmlFor="image">Avatar URL</Label>
              <Input id="image" placeholder="https://…" aria-invalid={!!errors.image} {...register("image")} />
              {errors.image && <p className="text-xs text-destructive">{errors.image.message}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-fib5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" aria-invalid={!!errors.name} {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-fib5">
            <Label htmlFor="email">Email</Label>
            <div className="flex items-center gap-fib8">
              <Input id="email" value={email} disabled readOnly />
              {emailVerified ? (
                <Badge variant="ok">
                  <BadgeCheck className="h-3 w-3" /> Verified
                </Badge>
              ) : (
                <Badge variant="warn">Unverified</Badge>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-fib21 text-sm text-muted-foreground">
            <span>Member since {memberSinceFormatter.format(memberSince)}</span>
            <span>Role: {role}</span>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              Save changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
