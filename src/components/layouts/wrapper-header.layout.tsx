import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Spinner,
  Typography,
  type CsvExportConfig,
} from "@components/ui";
import { LANG_KEY_CONST } from "@constants";
import { useLang } from "@hooks/use-lang";
import { FileDown } from "lucide-react";
import { useEffect, useRef, useState, type ComponentProps } from "react";
import { CSVLink } from "react-csv";

interface WrapperHeaderProps extends ComponentProps<"div"> {
  title?: string;
  titleAdd?: string;
  onAdd?: () => void;
  csv?: CsvExportConfig;
  data?: any[];
}

const WrapperHeader = ({
  title,
  csv = {
    headers: [],
    filename: "export.csv",
  },
  data = [],
  titleAdd,
  onAdd,
}: WrapperHeaderProps) => {
  const { t } = useLang();
  const [loadingCSV, setLoadingCSV] = useState(false);
  const [allData, setAllData] = useState<any[]>([]);
  const csvAllRef = useRef<any | null>(null);

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

  const currentFileName = csv.filename ?? "current-page.csv";
  const allFileName =
    csv.allExportFilename ?? csv.filename ?? "all-records.csv";

  return (
    <div className="flex justify-between items-center py-2">
      <Typography variant="h4" className="flex-1">
        {title}
      </Typography>
      <div className="flex items-end gap-2">
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
                  <>
                    <FileDown />
                    <Typography>
                      {t(LANG_KEY_CONST.COMMON_BTN_EXPORT)}
                    </Typography>
                  </>
                )}
              </Button>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <CSVLink
                data={data}
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
        {titleAdd && (
          <Button onClick={onAdd}>+{t(LANG_KEY_CONST.UNIT_TITLE_ADD)}</Button>
        )}
      </div>
    </div>
  );
};

export { WrapperHeader };
