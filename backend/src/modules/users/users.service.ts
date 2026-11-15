import { getUserDetailsById } from "./users.repository";

interface userTempData {
  userId: string
}

export async function userPofile(
  input: userTempData
) {
  const userId = input.userId;

  return await getUserDetailsById(userId);
}