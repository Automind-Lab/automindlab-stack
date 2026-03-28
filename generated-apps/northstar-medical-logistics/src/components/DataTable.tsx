import type { ReactElement } from "react";

interface DataTableProps {
  rows: Array<Record<string, string>>;
  columns: string[];
}

export function DataTable({ rows, columns }: DataTableProps): ReactElement {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => <th key={column}>{column}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => <td key={column}>{row[column] ?? "—"}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
