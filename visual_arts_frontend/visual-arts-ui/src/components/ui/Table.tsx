import type { ReactNode, HTMLAttributes } from "react";

type TableProps = {
  headers?: string[];
  children: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

export const Table = ({ children, className, ...props }: TableProps) => {
  return (
    <div className={`border rounded-md overflow-x-auto ${className}`} {...props}>
      <table className="w-full text-sm">
        {children}
      </table>
    </div>
  );
};

type TableCellProps = {
  children: ReactNode;
  colSpan?: number;
  className?: string;
} & HTMLAttributes<HTMLTableCellElement>;

export const TableCell = ({ children, colSpan, className, ...props }: TableCellProps) => (
  <td className={`p-2 ${className}`} colSpan={colSpan} {...props}>
    {children}
  </td>
);

type TableRowProps = {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLTableRowElement>;

export const TableRow = ({ children, className, ...props }: TableRowProps) => (
  <tr className={`${className}`} {...props}>{children}</tr>
);

type TableHeadProps = {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLTableCellElement>;

export const TableHead = ({ children, className, ...props }: TableHeadProps) => (
  <th className={`p-2 ${className}`} {...props}>{children}</th>
);

export const TableHeader = ({ children, className }: { children: ReactNode; className?: string }) => (
  <thead className={`bg-gray-100 text-left text-sm font-medium ${className}`}>{children}</thead>
);

export const TableBody = ({ children, className }: { children: ReactNode; className?: string }) => (
  <tbody className={className}>{children}</tbody>
);