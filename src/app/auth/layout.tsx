import { GoogleOAuthProvider } from '@react-oauth/google';
import PublicLayout from '../layouts/PublicLayout';


export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <PublicLayout>
            <GoogleOAuthProvider  clientId={process.env.NEXT_CLIENT_ID as string} >
               {children}
            </GoogleOAuthProvider>
        </PublicLayout>
    );
}