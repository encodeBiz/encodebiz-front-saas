import AdminLayout from '../layouts/AdminLayout';


export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    
    return (
        <AdminLayout>          
            {children}
        </AdminLayout>
    );
}