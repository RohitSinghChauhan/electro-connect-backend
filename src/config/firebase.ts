import fs from "fs";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { ApiError } from "../utils/api-error";

const serviceAccountPath = "./firebase-service-account.json";

const ensureFirebase = (): void => {
  if (getApps().length === 0) {
    try {
      if (process.env.FIREBASE_PRIVATE_KEY) {
        initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
          }),
        });
      } else if (fs.existsSync(serviceAccountPath)) {
        initializeApp({
          credential: cert(serviceAccountPath),
        });
      } else {
        throw new ApiError(
          500,
          "Firebase is not configured. Add firebase-service-account.json to the project root"
        );
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        500,
        "Firebase is not configured. Add firebase-service-account.json to the project root"
      );
    }
  }
};

export const verifyFirebaseIdToken = async (firebaseToken: string) => {
  ensureFirebase();
  return getAuth().verifyIdToken(firebaseToken);
};
