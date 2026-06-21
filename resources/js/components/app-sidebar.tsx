import { Link } from '@inertiajs/react';
import { FolderTree, Globe, Images, Languages, LayoutGrid, Package } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { index as categories } from '@/routes/categories';
import { index as languages } from '@/routes/languages';
import { index as products } from '@/routes/products';
import { index as sliders } from '@/routes/sliders';
import { index as translations } from '@/routes/translations';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Sliders',
        href: sliders(),
        icon: Images,
    },
    {
        title: 'Categories',
        href: categories(),
        icon: FolderTree,
    },
    {
        title: 'Meals',
        href: products(),
        icon: Package,
    },
    {
        title: 'Languages',
        href: languages(),
        icon: Globe,
    },
    {
        title: 'Translations',
        href: translations(),
        icon: Languages,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
