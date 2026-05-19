import * as admin from "firebase-admin";

let auth: admin.auth.Auth | null = null;

function getAdminAuth(): admin.auth.Auth {
  if (auth) return auth;

  const privateKey = process.env.NEXT_PRIVATE_KEY;
  if (!privateKey) throw new Error('Firebase Admin SDK: NEXT_PRIVATE_KEY is not configured');

  const app = admin.initializeApp(
    {
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PROJECT_ID,
        clientEmail: process.env.NEXT_CLIENT_EMAIL,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    },
    crypto.randomUUID()
  );
  auth = admin.auth(app);
  return auth;
}

export { getAdminAuth as auth };
