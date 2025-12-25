import Header from "@/components/layout/Header";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-green-950">
      {/* 1. Navigation Header */}
      <Header />

      {/* 2. Main Content Area */}
      <main 
        className="flex-grow flex items-center justify-center p-4 bg-cover bg-center relative"
        style={{ backgroundImage: "url('/auth-background.jpg')" }}
      >
        {/* Professional Dark Overlay with slight blur for focus */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[3px]" /> 
        
        {/* The Login/Register Form */}
        <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}