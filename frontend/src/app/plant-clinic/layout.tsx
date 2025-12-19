// This layout applies ONLY to the /plant-clinic route.
// It creates a full-height container for our chat interface.
export default function PlantClinicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // The main app background is dark, so we set a light one here for the page
    <div className="h-screen w-screen bg-[#F7F7F7]">
      {children}
    </div>
  );
}