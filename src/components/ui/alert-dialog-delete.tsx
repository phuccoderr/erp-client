import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog";
import { Trash2 } from "lucide-react";

interface AlertDialogDeleteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  toggleDelete: () => void;
}

const AlertDialogDelete = ({
  open,
  onOpenChange,
  toggleDelete,
}: AlertDialogDeleteProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            <Trash2 className="size-5 text-destructive" />
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            This will permanently delete the project and all of its contents.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              toggleDelete();
            }}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            Delete Project
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogDelete;
