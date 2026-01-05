import {
  Button,
  Dialog,
  DialogClose,
  DialogContainer,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui";
import { LANG_KEY_CONST } from "@constants";

const FormCreatePermission = () => {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button>+ {LANG_KEY_CONST.PERMISSION.BTN_ADD}</Button>
        </DialogTrigger>
        <DialogContainer className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Permission</DialogTitle>
          </DialogHeader>
          <DialogContent className="grid gap-4">
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogContent>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContainer>
      </form>
    </Dialog>
  );
};

export default FormCreatePermission;
