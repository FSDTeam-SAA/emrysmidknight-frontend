import Sidebar from "@/components/common/Sidebar";
import "../globals.css";
import Rightsideber from "@/components/common/Rightsideber";
import Navbar from "@/components/common/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#121212] min-h-screen">
      <Navbar />

      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-4">
          {/* Left Sidebar (Desktop) */}
          <aside className="hidden lg:block lg:col-span-2">
            <Sidebar />
          </aside>

          {/* Main Content */}
          <main className="col-span-1 lg:col-span-6">
            {children}
          </main>

          {/* Right Sidebar (Desktop) */}
          <aside className="hidden lg:block lg:col-span-4">
            <Rightsideber />
          </aside>
        </div>
      </div>
    </div>
  );
}
