export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex min-h-screen items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: "url('/auth-background.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/30" /> 
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}