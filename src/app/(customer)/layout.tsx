import HeaderCustomer from "@/components/HeaderCustomer";
import FooterCustomer from "@/components/FooterCustomer";
import ChatWidget from "@/components/chat/ChatWidget";

export default function CustomerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <HeaderCustomer />
            <main className=" container mx-auto">{children}</main>
            <FooterCustomer />
            <ChatWidget />
        </div>
    );
}
