import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Spinner,
  Typography,
} from "@components/ui";
import { CSVLink } from "react-csv";
import { LANG_KEY_CONST } from "@constants";
import { FileDown } from "lucide-react";
import { PermissionApi } from "@apis";

interface HeaderProps {
  children: ReactNode;
  title?: string;
}
const TanstackTableHeader = ({ children, title }: HeaderProps) => {
  return (
    <div className="flex justify-between items-center py-2">
      <Typography variant="h4" className="flex-1">
        {title}
      </Typography>
      <div className="flex items-end">{children}</div>
    </div>
  );
};

interface HeaderRightProps {
  children: ReactNode;
  csv?: {
    fileName?: string;
    data: any[];
    headers: { label: string; key: string }[];
  };
}
const TanstackTableHeaderRight = ({
  children,
  csv = { data: [], headers: [], fileName: "base.csv" },
}: HeaderRightProps) => {
  const [loadingCSV, setLoadingCSV] = useState(false);
  const [allData, setAllData] = useState([]);
  const csvInstance = useRef<any | null>(null);

  const asyncExportAll = async () => {
    try {
      const fullData = await PermissionApi.findAll({
        pagination: false,
      });
      setAllData(fullData.data.entities);
      setLoadingCSV(true);
    } catch (e) {
      setLoadingCSV(false);
    }
  };

  useEffect(() => {
    if (
      allData.length > 0 &&
      csvInstance &&
      csvInstance.current &&
      csvInstance.current.link
    ) {
      setTimeout(() => {
        csvInstance.current.link.click();
        setAllData([]);
        setLoadingCSV(false);
      });
    }
  }, [allData]);

  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {csv && (
            <Button variant="secondary" disabled={loadingCSV}>
              {loadingCSV ? (
                <div className="px-2 flex gap-1 items-center justify-center">
                  <Spinner />
                  <Typography>Processing...</Typography>
                </div>
              ) : (
                <Fragment>
                  <FileDown />
                  <Typography>{LANG_KEY_CONST.EXPORT}</Typography>
                </Fragment>
              )}
            </Button>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <CSVLink
              data={csv.data}
              headers={csv.headers}
              filename={csv.fileName}
            >
              Export Page
            </CSVLink>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={loadingCSV}
            onClick={() => {
              asyncExportAll();
            }}
          >
            Export All
          </DropdownMenuItem>
          {allData && (
            <CSVLink
              className="hidden"
              data={allData}
              headers={csv.headers}
              filename={csv.fileName}
              ref={csvInstance}
            />
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {children}
    </div>
  );
};

export { TanstackTableHeader, TanstackTableHeaderRight };
