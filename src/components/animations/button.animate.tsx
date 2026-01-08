import {
  Button,
  Spinner,
  Typography,
  type ButtonVariantsProps,
} from "@components/ui";
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
  const MotionButton = motion.create(Button);
  const mergedLabels = { ...defaultLabels, ...labels };
  const currentLabel = labels[status] ?? mergedLabels[status] ?? children;

  const loadingClass = status === "processing" ? "w-[110px]" : "";

  return (
    <MotionButton
      className={loadingClass}
      disabled={disabled}
      whileTap={{
        scale: 0.96,
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
    </MotionButton>
  );
};

export { ButtonAnimated };
