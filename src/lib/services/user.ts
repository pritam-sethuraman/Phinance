import { prisma } from "@/lib/db/prisma";
import { NotFoundError } from "@/lib/errors";
import type { UpdateSettingsInput } from "@/lib/validation/user";

export async function getUser(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError("User not found.");
  return user;
}

export async function updateSettings(
  userId: string,
  input: UpdateSettingsInput,
) {
  return prisma.user.update({ where: { id: userId }, data: input });
}

export async function updateProfile(
  userId: string,
  data: { name: string; image: string | null },
) {
  return prisma.user.update({ where: { id: userId }, data });
}
