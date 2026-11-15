import { getUserDetailsById, userRepository } from "./users.repository";
import type { UpdateProfileInput } from "./users.schema";

export async function userPofile(userId: string) {
  return await getUserDetailsById(userId);
}

export const userService = {
  updateProfile: async (userId: string, payload: UpdateProfileInput) => {
    const existingUser = await userRepository.findById(userId);

    if (!existingUser) {
      throw new Error("USER_NOT_FOUND");
    }

    if (payload.email && payload.email !== existingUser.email) {
      const emailExists = await userRepository.findByEmail(payload.email);

      if (emailExists) {
        throw new Error("EMAIL_ALREADY_EXISTS");
      }
    }

    const updateData = {
      ...payload,
      ...(payload.email && payload.email !== existingUser.email
        ? { emailVemailVerified: false }
        : {}),
    };

    return userRepository.updateProfile(
      userId,
      updateData
    )
  },
};
