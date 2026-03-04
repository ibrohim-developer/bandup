import { ClipboardList } from "lucide-react";

export default function FullMockTestPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center relative min-h-[calc(100vh-80px)] px-4 md:px-0">
      <div className="max-w-2xl w-full text-center space-y-6 md:space-y-8">
        <div className="flex flex-col items-center justify-center">
          <div className="relative w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-primary/20 rounded-full" />
            <div className="absolute inset-2 border-2 border-primary/40 rounded-full" />
            <div className="absolute inset-4 border-2 border-primary/60 rounded-full" />
            <div className="bg-background p-3 md:p-4 rounded-full z-10 shadow-sm border border-border">
              <ClipboardList className="w-10 h-10 md:w-14 md:h-14 text-primary" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        <div className="space-y-3 md:space-y-4">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase leading-tight">
            Full Mock Test is <br />
            Coming Soon
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
            We are building a complete IELTS simulation experience. Get ready to take a full mock test with all four modules in one sitting.
          </p>
        </div>

        <div className="pt-2 md:pt-4">
          <button className="bg-primary text-primary-foreground px-8 py-3 md:px-10 md:py-4 rounded-full font-black text-xs md:text-sm tracking-widest hover:opacity-90 transition-all uppercase shadow-lg shadow-primary/20">
            Notify Me
          </button>
        </div>

        <div className="pt-8 md:pt-12 flex justify-center gap-1.5">
          <div className="w-12 h-1 bg-primary rounded-full" />
          <div className="w-2 h-1 bg-muted rounded-full" />
          <div className="w-2 h-1 bg-muted rounded-full" />
        </div>
      </div>

      <div className="absolute top-0 right-0 p-6 md:p-12 opacity-5 select-none pointer-events-none">
        <span className="text-[100px] md:text-[200px] font-black leading-none">AI</span>
      </div>
    </div>
  );
}
