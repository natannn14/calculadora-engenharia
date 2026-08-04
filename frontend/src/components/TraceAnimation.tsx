import { useEffect, useState } from "react";

interface TraceAnimationProps {
  theme: string;
  triggerKey: string;
}

export function TraceAnimation({ theme, triggerKey }: TraceAnimationProps) {
  const [active, setActive] = useState(false);
  const [pathData, setPathData] = useState("");

  useEffect(() => {
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    // Use requestAnimationFrame to ensure DOM is updated after tab change
    requestAnimationFrame(() => {
      const navBtn = document.getElementById(`nav-${triggerKey}`);
      const header = document.querySelector('h1');
      
      let startX = 200, startY = 300, endX = 400, endY = 100;
      
      if (navBtn && header) {
        const navRect = navBtn.getBoundingClientRect();
        const headerRect = header.getBoundingClientRect();
        
        startX = navRect.right;
        startY = navRect.top + navRect.height / 2;
        endX = headerRect.left - 10;
        endY = headerRect.top + headerRect.height / 2;
      }

      // Generate path based on coordinates
      let path = "";
      const midX = startX + (endX - startX) / 2;

      if (theme === "theme-omnitrix") {
        // Hexagonal trace - jagged steps
        path = `M ${startX},${startY} L ${startX + 20},${startY - 20} L ${midX - 20},${startY - 20} L ${midX + 20},${endY} L ${endX - 20},${endY} L ${endX},${endY}`;
      } else if (theme === "theme-shinobi") {
        // Spiral trace approximation
        path = `M ${startX},${startY} C ${midX},${startY + 100} ${midX},${endY - 100} ${endX},${endY}`;
      } else if (theme === "theme-miles") {
        // Staccato glitch
        path = `M ${startX},${startY} L ${startX + 30},${startY + 20} L ${midX - 10},${startY - 30} L ${midX + 10},${endY + 20} L ${endX},${endY}`;
      } else {
        // Default / Saiyan / PCB - 45 degree bends
        path = `M ${startX},${startY} L ${midX},${startY} L ${midX},${endY} L ${endX},${endY}`;
      }
      
      setPathData(path);
      setActive(true);
      
      const timer = setTimeout(() => {
        setActive(false);
      }, 1000); // 1s animation duration
      
      return () => clearTimeout(timer);
    });
  }, [triggerKey, theme]);

  if (!active || !pathData) return null;

  let animationStyle: React.CSSProperties = {
    animation: "traceDash 1s ease-in-out forwards",
  };

  if (theme === "theme-saiyan") {
    animationStyle.animation = "traceDash 1s ease-in-out forwards, saiyanPulse 0.5s infinite alternate";
  } else if (theme === "theme-miles") {
    animationStyle.animation = "traceDash 1s steps(10, end) forwards";
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <svg className="w-full h-full" preserveAspectRatio="none">
        <path
          d={pathData}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: "2000",
            strokeDashoffset: "2000",
            filter: "drop-shadow(0 0 8px var(--color-primary))",
            ...animationStyle
          }}
        />
      </svg>
    </div>
  );
}
