import { driveRepositery } from "./drive.repositery";
import { DRIVE_SCOPES, makeOAuthCLient } from "@/lib/google";
import {
  verifyState,
  googleDecrypt,
  googleEncrypt,
  signState,
} from "@/common/utils/crypto";
import type { DriveCallbackInput } from "./drive.types";
import { env } from "@/config/env";
import { google } from "googleapis";
import { UserStatus } from "@/generated/prisma/enums";

export const driveService = {
  driveConnection: async (userId: string) => {
    const existingAccounts = await driveRepositery.countDrivAccounts(userId);

    if (existingAccounts) {
      throw new Error("LIMIT_REACHED");
    } else {
      const authorizationUrl = makeOAuthCLient().generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: DRIVE_SCOPES,
        state: signState(userId),
      });

      return authorizationUrl;
    }
  },
  driveCallback: async (data: DriveCallbackInput) => {
    const state = verifyState(data.state);

    if (!state) throw new Error("INVALID_STATE");

    const client = makeOAuthCLient();

    const { tokens } = await client.getToken(data.code);

    if (!tokens.refresh_token) throw new Error("NO_REFRESH_TOKEN");

    const scopes = tokens.scope?.split(" ") ?? [];

    const requiredScope = "https://www.googleapis.com/auth/drive.file";

    if (!scopes.includes(requiredScope)) {
      throw new Error("DRIVE_SCOPE_NOT_GRANTED");
    }

    if (!tokens.id_token) {
      throw new Error("INVALID_ID_TOKEN");
    }

    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: env.G_DRIVE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload?.sub || !payload.email) {
      throw new Error("INVALID_GOOGLE_ACCOUNT");
    }

    const { sub, email } = payload;

    const owner = await driveRepositery.findByGoogleSub(sub);

    if (owner && owner.userId !== state.userId)
      throw new Error("DRIVE_LINKED_TO_ANOTHER_USER");

    client.setCredentials(tokens);

    const drive = google.drive({
      version: "v3",
      auth: client,
    });

    const { data: folder } = await drive.files.create({
      requestBody: {
        name: "DriveStore",
        description: "DriveStore created by UNBUILD STUDIO: JAX",
        mimeType: "application/vnd.google-apps.folder",
        appProperties: {
          drivestore: "root",
        },
      },
      fields: "id",
    });

    if (!folder.id) {
      throw new Error("UNABLE_TO_CREATE_DRIVESTORE_FOLDER");
    }

    const refreshTokenEnc = googleEncrypt(tokens.refresh_token);

    const about = await drive.about.get({
      fields: "storageQuota",
    });

    const quota = about.data.storageQuota;

    const quotaTotal = quota?.limit ? BigInt(quota.limit) : null;
    const quotaUsed = quota?.usage ? BigInt(quota.usage) : null;

    try {
      return await driveRepositery.driveDetailsUpsert({
        userId: data.userId,
        googleSub: sub,
        googleEmail: email,
        refreshToken: refreshTokenEnc,
        scopes,
        folderId: folder.id,

        quotaUsed,
        quotaTotal,
        
        status: UserStatus.ACTIVE,
      });
    } catch (error) {
      throw new Error("UNABLE_TO_CREATE_DRIVE_ENTRY", {
        cause: error,
      });
    }
  },
};
