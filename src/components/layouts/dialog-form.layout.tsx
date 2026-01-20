import { ButtonAnimated } from "@components/animations";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContainer,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui";
import { LANG_KEY_CONST } from "@constants";
import { useLang } from "@hooks/use-lang";
import { Ban, CheckCheck } from "lucide-react";
import type { ReactNode } from "react";

interface DialogFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  submitText: string;
  isPending?: boolean;
  children?: ReactNode;
  idSubmit?: string;
}

const DialogForm = ({
  isOpen,
  onOpenChange,
  title,
  submitText,
  isPending,
  children,
  idSubmit,
}: DialogFormProps) => {
  const { t } = useLang();
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContainer>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"}>
              <Ban /> {t(LANG_KEY_CONST.COMMON_CANCEL)}
            </Button>
          </DialogClose>
          <ButtonAnimated form={idSubmit} type="submit" disabled={isPending}>
            <CheckCheck className="text-current" />
            {submitText}
          </ButtonAnimated>
        </DialogFooter>
      </DialogContainer>
    </Dialog>
  );
};

export { DialogForm };
