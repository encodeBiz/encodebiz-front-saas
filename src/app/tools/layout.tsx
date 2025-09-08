import ToolLayout from '../layouts/ToolLayout';

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ToolLayout>            
               {children}           
        </ToolLayout>
    );
}