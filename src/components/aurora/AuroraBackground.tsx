import React from 'react';

interface AuroraBackgroundProps {
  intensified?: boolean;
}

const AuroraBackground: React.FC<AuroraBackgroundProps> = ({ intensified = false }) => {
  const baseOpacity = intensified ? 0.5 : 0.3;
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
      {/* Blob 1 - Cyan */}
      <div
        className="absolute animate-aurora-1"
        style={{
          width: '800px',
          height: '800px',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(0, 212, 255, ${baseOpacity}) 0%, transparent 70%)`,
          filter: 'blur(120px)',
          top: '-20%',
          left: '-10%',
        }}
      />
      {/* Blob 2 - Violet */}
      <div
        className="absolute animate-aurora-2"
        style={{
          width: '700px',
          height: '700px',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(123, 92, 255, ${baseOpacity * 0.85}) 0%, transparent 70%)`,
          filter: 'blur(120px)',
          top: '20%',
          right: '-15%',
        }}
      />
      {/* Blob 3 - Pink */}
      <div
        className="absolute animate-aurora-3"
        style={{
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255, 107, 157, ${baseOpacity * 0.7}) 0%, transparent 70%)`,
          filter: 'blur(120px)',
          bottom: '-10%',
          left: '20%',
        }}
      />
      {/* Noise overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  );
};

export default React.memo(AuroraBackground);
