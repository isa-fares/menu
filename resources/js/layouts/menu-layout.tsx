/**
 * Layout الواجهة العامة — لا sidebar، لا header لوحة التحكم
 * يُستخدم فقط لصفحات menu/*
 */
export default function MenuLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
