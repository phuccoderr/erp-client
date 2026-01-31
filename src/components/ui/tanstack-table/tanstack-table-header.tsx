import {
  Fragment,
  memo,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Spinner,
  Typography,
  useTanstackTable,
} from "@components/ui";
import { CSVLink } from "react-csv";
import { LANG_KEY_CONST } from "@constants";
import { FileDown } from "lucide-react";
import { useLang } from "@hooks";

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
      <div className="flex items-end gap-2">{children}</div>
    </div>
  );
};

export interface CsvExportConfig {
  headers: { label: string; key: string }[];
  filename?: string;
  allExportFilename?: string;
  fetchAllRecords?: () => Promise<any[]>;
}

interface HeaderRightProps {
  children?: ReactNode;
  csv?: CsvExportConfig;
}
const TanstackTableHeaderRight = memo(
  ({
    children,
    csv = {
      headers: [],
      filename: "export.csv",
    },
  }: HeaderRightProps) => {
    const { t } = useLang();
    const [loadingCSV, setLoadingCSV] = useState(false);
    const [allData, setAllData] = useState<any[]>([]);
    const csvAllRef = useRef<any | null>(null);
    const { getRowModel } = useTanstackTable();

    useEffect(() => {
      if (allData.length > 0 && csvAllRef.current?.link) {
        const timer = setTimeout(() => {
          csvAllRef.current.link.click();
          setAllData([]);
          setLoadingCSV(false);
        }, 100);

        return () => clearTimeout(timer);
      }
    }, [allData]);

    const handleExportAll = async () => {
      if (!csv.fetchAllRecords || loadingCSV) return;

      setLoadingCSV(true);
      try {
        const fullData = await csv.fetchAllRecords();
        setAllData(fullData as any[]);
      } catch (err) {
        setLoadingCSV(false);
      }
    };

    const currentPageData = getRowModel().rows.map((r) => r.original) as any[];
    const currentFileName = csv.filename ?? "current-page.csv";
    const allFileName =
      csv.allExportFilename ?? csv.filename ?? "all-records.csv";

    return (
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {csv && (
              <Button variant="secondary" disabled={loadingCSV}>
                {loadingCSV ? (
                  <div className="px-2 flex gap-1 items-center justify-center">
                    <Spinner />
                    <Typography>
                      {t(LANG_KEY_CONST.COMMON_PROCESSING)}...
                    </Typography>
                  </div>
                ) : (
                  <Fragment>
                    <FileDown />
                    <Typography>
                      {t(LANG_KEY_CONST.COMMON_BTN_EXPORT)}
                    </Typography>
                  </Fragment>
                )}
              </Button>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <CSVLink
                data={currentPageData}
                headers={csv.headers}
                filename={currentFileName}
              >
                {t(LANG_KEY_CONST.TABLE_EXPORT_PAGE)}
              </CSVLink>
            </DropdownMenuItem>
            <DropdownMenuItem disabled={loadingCSV} onClick={handleExportAll}>
              {t(LANG_KEY_CONST.TABLE_EXPORT_ALL)}
            </DropdownMenuItem>
            {allData && (
              <CSVLink
                className="hidden"
                data={allData}
                headers={csv.headers}
                filename={allFileName}
                ref={csvAllRef}
              />
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        {children}
      </div>
    );
  },
);

export { TanstackTableHeader, TanstackTableHeaderRight };
