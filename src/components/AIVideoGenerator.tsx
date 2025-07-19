import { Sparkles } from "lucide-react";

export const AIVideoGenerator = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="relative w-full max-w-4xl mx-auto">
        {/* Frosted glass container */}
        <div className="relative rounded-3xl border border-white/20 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10"></div>
          
          {/* Content */}
          <div className="relative z-10 p-16 text-center space-y-8">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="p-6 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                <Sparkles className="h-16 w-16 text-primary" />
              </div>
            </div>
            
            {/* Coming Soon Text */}
            <div className="space-y-4">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Coming Soon
              </h1>
              <p className="text-xl text-muted-foreground/80 max-w-2xl mx-auto">
                AI Video Generator is currently in development. 
                Our decentralized AI network will soon bring your ideas to life.
              </p>
            </div>
            
            {/* Decorative elements */}
            <div className="flex items-center justify-center gap-8 pt-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/50"></div>
              <div className="h-2 w-2 rounded-full bg-primary/60 animate-pulse"></div>
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/50"></div>
            </div>
          </div>
          
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 h-32 w-32 rounded-full bg-primary/20 blur-xl"></div>
            <div className="absolute bottom-10 right-10 h-48 w-48 rounded-full bg-accent/20 blur-xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-primary/10 blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};