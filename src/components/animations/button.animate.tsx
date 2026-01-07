import {
  Button,
  buttonVariants,
  Spinner,
  Typography,
  type ButtonVariantsProps,
} from "@components/ui";
import { cn } from "@lib";
import { AnimatePresence, motion } from "motion/react";
import { type ComponentProps } from "react";

export type ButtonAnimatedStatus = "default" | "processing" | "ok" | "error";

interface ButtonAnimatedProps
  extends ComponentProps<"button">,
    ButtonVariantsProps {
  status?: ButtonAnimatedStatus;
  stiffness?: number;
  damping?: number;
  labels?: {
    default?: React.ReactNode;
    processing?: React.ReactNode;
    ok?: React.ReactNode;
    error?: React.ReactNode;
  };
}

const defaultLabels = {
  idle: "Submit",
  processing: (
    <div className="flex gap-1 justify-center items-center">
      <Spinner />
      <Typography>Processing...</Typography>
    </div>
  ),
  ok: "Success ✓",
  error: "Error ✗",
};

const ButtonAnimated = ({
  status = "default",
  labels = {},
  stiffness = 300,
  damping = 15,
  children,
  onClick,
  disabled,
  size,
  variant,
}: ButtonAnimatedProps) => {
  const ButtonComponent = motion.create(Button, { forwardMotionProps: true });
  const mergedLabels = { ...defaultLabels, ...labels };
  const currentLabel = labels[status] ?? mergedLabels[status] ?? children;

  const loadingClass = status === "processing" ? "w-[110px]" : "";

  return (
    <ButtonComponent
      className={loadingClass}
      disabled={disabled}
      whileTap={{
        scale: 1.2,
      }}
      transition={{
        type: "spring",
        stiffness: stiffness,
        damping: damping,
      }}
      layout
      onClick={onClick}
      // Button Origin
      size={size}
      variant={variant}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={status}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          layout
          className="flex justify-center w-full"
        >
          {currentLabel}
        </motion.span>
      </AnimatePresence>
    </ButtonComponent>
  );
};

export { ButtonAnimated };
