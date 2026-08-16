
export interface NavItem {
    icon: string;
    label: string;
    href: string;
    active?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
    { icon: '🏠', label: 'Home', href: '/' },
    { icon: '🌳', label: 'Albero Genealogico', href: '/albero' },
];

export const NAV_BRAND = {
    initials: 'MB',
    namePrefix: 'Memory',
    nameAccent: 'Bridge',
};