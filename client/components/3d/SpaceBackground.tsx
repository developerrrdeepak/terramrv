import { useTheme } from "@/context/theme";

export function SpaceBackground() {
  const { theme } = useTheme();
  
  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {/* Dynamic gradient based on theme */}
      <div 
        className="absolute inset-0"
        style={{
          background: theme === 'dark'
            ? 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)'
            : 'linear-gradient(135deg, #0a2626 0%, #061e1e 50%, #0d2929 100%)'
        }}
      />
      
      {/* Animated stars */}
      <div className="absolute inset-0">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              backgroundColor: theme === 'dark' ? '#ffffff' : '#c8f259',
              borderRadius: '50%',
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 2}s`,
              opacity: Math.random() * 0.8 + 0.2
            }}
          />
        ))}
      </div>
      
      {/* Nebula effects */}
      <div 
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{
          background: theme === 'dark'
            ? 'radial-gradient(circle, #10b981 0%, transparent 70%)'
            : 'radial-gradient(circle, #c8f259 0%, transparent 70%)'
        }}
      />
      
      <div 
        className="absolute bottom-1/3 left-1/3 w-80 h-80 rounded-full blur-3xl opacity-15"
        style={{
          background: theme === 'dark'
            ? 'radial-gradient(circle, #22c55e 0%, transparent 70%)'
            : 'radial-gradient(circle, #b8e638 0%, transparent 70%)'
        }}
      />
    </div>
  );
}
