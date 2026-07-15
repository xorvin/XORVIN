// Framer Motion animation variants for page transitions and element animations

export const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit:    { opacity: 0, y: -10, transition: { duration: 0.3 } },
};

export const fadeInUp = {
  initial:   { opacity: 0, y: 40 },
  animate:   { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export const fadeIn = {
  initial:   { opacity: 0 },
  animate:   { opacity: 1 },
  transition: { duration: 0.5 },
};

export const scaleIn = {
  initial:   { opacity: 0, scale: 0.92 },
  animate:   { opacity: 1, scale: 1 },
  transition: { duration: 0.4 },
};

export const staggerContainer = {
  animate: {
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

export const staggerContainerFast = {
  animate: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const slideInLeft = {
  initial:   { opacity: 0, x: -50 },
  animate:   { opacity: 1, x: 0 },
  transition: { duration: 0.6 },
};

export const slideInRight = {
  initial:   { opacity: 0, x: 50 },
  animate:   { opacity: 1, x: 0 },
  transition: { duration: 0.6 },
};

export const cardHover = {
  rest:  { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -4, transition: { duration: 0.3, ease: 'easeOut' } },
};

export const glowHover = {
  rest:  { boxShadow: '0 0 0 rgba(0, 123, 255, 0)' },
  hover: { boxShadow: '0 0 30px rgba(0, 123, 255, 0.4)', transition: { duration: 0.3 } },
};
