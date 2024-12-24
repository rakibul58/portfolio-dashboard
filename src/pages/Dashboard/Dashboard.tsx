import Loading from "@/components/shared/Loading";
import { useState } from "react";

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-background to-secondary/30">
      {isLoading && (
        <Loading />
      )}

      <iframe
        src="https://rakibul-developer-portfolio.vercel.app/"
        className="w-full h-full border-none"
        onLoad={() => {
          // Add a small delay to make the loading animation visible
          setTimeout(() => setIsLoading(false), 1000);
        }}
        title="Rakibul's Portfolio"
      />
    </div>
  );
}
