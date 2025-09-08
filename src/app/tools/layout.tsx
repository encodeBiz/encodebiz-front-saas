import { CommonModalProvider } from '@/contexts/commonModalContext';
import { EntityProvider } from '@/contexts/entityContext';
import { LayoutProvider } from '@/contexts/layoutContext';
import ToolLayout from '../layouts/ToolLayout';

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ToolLayout>
            <EntityProvider>
                <LayoutProvider>
                    <CommonModalProvider>
                        {children}
                    </CommonModalProvider>
                </LayoutProvider>
            </EntityProvider>
        </ToolLayout>
    );
}