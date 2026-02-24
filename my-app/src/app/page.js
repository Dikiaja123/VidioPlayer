import { Sidebar, Appbar, Content, Footer } from "@/component/index";

export default function Home() {
 return (
  <div className="grid grid-rows-[auto_1fr_auto] h-screen">
   {/* Appbar */}
   <div className="h-12 flex items-center">
    <Appbar />
   </div>

   {/* Main Content Area */}
   <div className="grid-cols-12 flex">
    {/* Sidebar */}
    <Sidebar />

    {/* Content */}
    <Content />
   </div>

   {/* Footer */}
   <div className="h-10 bg-gray-200 flex items-center justify-center">
    <Footer />
   </div>
  </div>
 );
}
