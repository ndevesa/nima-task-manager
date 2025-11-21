"use client";
import * as React from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

import { cn } from "@/lib/utils";

function BubbleBackground({
  ref,
  className,
  children,
  interactive = false,
  transition = { stiffness: 100, damping: 20 },

  colors = {
    first: "255,255,255",
    second: "220,220,220",
    third: "180,180,180",
    fourth: "150,150,150",
    fifth: "255,255,255",
    sixth: "120,120,120",
  },

  ...props
}) {
  const containerRef = React.useRef(null);
  React.useImperativeHandle(ref, () => containerRef.current);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, transition);
  const springY = useSpring(mouseY, transition);

  React.useEffect(() => {
    if (!interactive) return;

    const currentContainer = containerRef.current;
    if (!currentContainer) return;

    const handleMouseMove = (e) => {
      const rect = currentContainer.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set(e.clientX - centerX);
      mouseY.set(e.clientY - centerY);
    };

    currentContainer?.addEventListener("mousemove", handleMouseMove);
    return () =>
      currentContainer?.removeEventListener("mousemove", handleMouseMove);
  }, [interactive, mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      data-slot="bubble-background"
      className={cn(
        "relative size-full overflow-hidden bg-gradient-to-b from-[#0f0f0f] to-[#151515]",
        className
      )}
      {...props}
    >
      <style>
        {`
            :root {
              --first-color: ${colors.first};
              --second-color: ${colors.second};
              --third-color: ${colors.third};
              --fourth-color: ${colors.fourth};
              --fifth-color: ${colors.fifth};
              --sixth-color: ${colors.sixth};
            }
          `}
      </style>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="absolute top-0 left-0 w-0 h-0"
      >
        <defs>
          <filter id="goo">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div
        className="absolute inset-0"
        style={{ filter: "url(#goo) blur(60px)" }}
      >
        {/* Bubble principal suave */}
        <motion.div
          className="absolute rounded-full size-[50%] top-[20%] left-[20%] mix-blend-soft-light
               bg-[radial-gradient(circle_at_center,rgba(var(--first-color),0.35)_0%,rgba(var(--first-color),0)_55%)]"
          animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
          transition={{ duration: 30, ease: "easeInOut", repeat: Infinity }}
        />

        {/* Bubble lenta y más opaca */}
        <motion.div
          className="absolute rounded-full size-[40%] bottom-[15%] right-[25%] mix-blend-soft-light
               bg-[radial-gradient(circle_at_center,rgba(var(--second-color),0.25)_0%,rgba(var(--second-color),0)_60%)]"
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 45, ease: "easeInOut", repeat: Infinity }}
        />

        {/* Bubble pequeña para dar profundidad */}
        <motion.div
          className="absolute rounded-full size-[25%] top-[55%] left-[55%] mix-blend-soft-light
               bg-[radial-gradient(circle_at_center,rgba(var(--third-color),0.18)_0%,rgba(var(--third-color),0)_55%)]"
          animate={{ x: [-15, 15, -15] }}
          transition={{ duration: 38, ease: "easeInOut", repeat: Infinity }}
        />

        {/* Interactiva si interactive=true */}
        {interactive && (
          <motion.div
            className="absolute rounded-full size-[35%] mix-blend-soft-light
                 bg-[radial-gradient(circle_at_center,rgba(var(--sixth-color),0.28)_0%,rgba(var(--sixth-color),0)_55%)]"
            style={{
              x: springX,
              y: springY,
            }}
            transition={{ duration: 0.2 }}
          />
        )}
      </div>

      {children}
    </div>
  );
}

export { BubbleBackground };
