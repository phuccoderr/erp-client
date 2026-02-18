import { useTanstackTable } from "@components/ui";
import { WrapperHeader } from "@components/layouts";

interface HeaderProps {
  title?: string;
  csv?: CsvExportConfig;
  titleAdd?: string;
  onAdd?: () => void;
}
const TanstackTableHeader = ({ title, titleAdd, csv, onAdd }: HeaderProps) => {
  const { getRowModel } = useTanstackTable();
  const currentPageData = getRowModel().rows.map((r) => r.original) as any[];

  return (
    <WrapperHeader
      title={title}
      csv={csv}
      data={currentPageData}
      titleAdd={titleAdd}
      onAdd={onAdd}
    />
  );
};

export interface CsvExportConfig {
  headers: { label: string; key: string }[];
  filename?: string;
  allExportFilename?: string;
  fetchAllRecords?: () => Promise<any[]>;
}

export { TanstackTableHeader };
