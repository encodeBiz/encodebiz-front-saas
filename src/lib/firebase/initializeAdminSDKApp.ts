import * as admin from "firebase-admin";

let auth: admin.auth.Auth | null = null;
if (!auth) {
 
  const app = admin.initializeApp(
    {
      credential: admin.credential.cert({
        projectId: process.env.NEXT_PROJECT_ID,
        clientEmail: process.env.NEXT_CLIENT_EMAIL,
        privateKey: (process.env.NEXT_PRIVATE_KEY as string).replace(/\\n/g, '\n')
      }),
    },
    //"ADMIN_APP"
    crypto.randomUUID()
  );
  auth = admin.auth(app);
}

export { auth };
