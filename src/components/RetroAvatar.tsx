import React from 'react';

export const RetroAvatar: React.FC<{ size?: number }> = ({ size = 120 }) => {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
            {/* Background */}
            <rect x="0" y="0" width="16" height="16" fill="#000033" />

            {/* Outline (Green) */}
            <rect x="5" y="2" width="6" height="1" fill="#00ff00" />
            <rect x="4" y="3" width="1" height="1" fill="#00ff00" />
            <rect x="11" y="3" width="1" height="1" fill="#00ff00" />
            <rect x="3" y="4" width="1" height="3" fill="#00ff00" />
            <rect x="12" y="4" width="1" height="3" fill="#00ff00" />
            <rect x="2" y="7" width="1" height="4" fill="#00ff00" />
            <rect x="13" y="7" width="1" height="4" fill="#00ff00" />
            <rect x="3" y="11" width="1" height="2" fill="#00ff00" />
            <rect x="12" y="11" width="1" height="2" fill="#00ff00" />
            <rect x="4" y="13" width="1" height="1" fill="#00ff00" />
            <rect x="11" y="13" width="1" height="1" fill="#00ff00" />
            <rect x="5" y="14" width="6" height="1" fill="#00ff00" />

            {/* Face Fill (Dark Green) */}
            <rect x="5" y="3" width="6" height="11" fill="#003300" />
            <rect x="4" y="4" width="8" height="9" fill="#003300" />
            <rect x="3" y="7" width="10" height="4" fill="#003300" />

            {/* Eyes (Glowing Red) */}
            <rect x="4" y="6" width="3" height="2" fill="#ff0000" />
            <rect x="9" y="6" width="3" height="2" fill="#ff0000" />
            {/* Eye Shine */}
            <rect x="4" y="6" width="1" height="1" fill="#ffcccc" />
            <rect x="9" y="6" width="1" height="1" fill="#ffcccc" />


            {/* Mouth */}
            <rect x="6" y="11" width="4" height="1" fill="#00ff00" />
        </svg>
    );
};
