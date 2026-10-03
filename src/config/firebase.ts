import fs from "fs";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { ApiError } from "../utils/api-error";

const serviceAccountPath = "./firebase-service-account.json";

const ensureFirebase = (): void => {
  if (getApps().length) {
    return;
  }

  if (!fs.existsSync(serviceAccountPath)) {
    throw new ApiError(
      500,
      "Firebase is not configured. Add firebase-service-account.json to the project root"
    );
  }

  try {
    initializeApp({
      credential: cert(serviceAccountPath),
    });
  } catch {
    throw new ApiError(500, "Firebase service account file is invalid");
  }
};

export const verifyFirebaseIdToken = async (firebaseToken: string) => {
  ensureFirebase();
  return getAuth().verifyIdToken(firebaseToken);
};
