import { BellDotIcon } from "lucide-react";
import { Button } from "@components/ui";

const Header = () => {
  return (
    <div className="flex justify-end px-6 py-2 items-center">
      <div className="flex gap-2">
        <Button size="icon-lg" variant="outline" className="">
          <BellDotIcon />
        </Button>
        <Button size="icon-lg" variant="outline">
          add
        </Button>
      </div>
    </div>
  );
};

export default Header;
