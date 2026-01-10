import {
  buttonVariants,
  Spinner,
  Typography,
  type CopyButtonProps,
} from "@components/ui";
import { cn } from "@lib";
import { AnimatePresence, motion } from "motion/react";

const ButtonAnimated = ({
  className,
  children,
  size,
  variant,
  disabled,
  ...props
}: CopyButtonProps) => {
  const {
    onAnimationStart,
    onAnimationComplete,
    onAnimationEnd,
    ...buttonProps
  } = props as any;
  const loadingClass = disabled ? "w-auto" : "";

  return (
    <motion.button
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
      }}
      // Tắt hover/tap khi disabled
      whileHover={disabled ? undefined : { scale: 1.1 }}
      whileTap={disabled ? undefined : { scale: 0.95 }}
      className={cn(
        buttonVariants({ variant, size: disabled ? "default" : size }),
        loadingClass,
        className
      )}
      {...buttonProps}
    >
      <AnimatePresence mode="popLayout">
        <motion.div
          key={disabled ? "true" : "false"}
          initial={{ y: -5, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 5, opacity: 0 }}
          transition={{ duration: 0.15, ease: "linear" }}
        >
          {disabled ? (
            <div className="px-2 flex gap-1 items-center justify-center">
              <Spinner />
              <Typography>Processing...</Typography>
            </div>
          ) : (
            children
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
};

export { ButtonAnimated };
