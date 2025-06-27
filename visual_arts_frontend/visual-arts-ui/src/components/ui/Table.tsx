import type { ReactNode } from "react"

type TableProps = {
  headers: string[]
  children: ReactNode
}

export function Table({ headers, children }: TableProps) {
  return (
    <div className="border rounded-md overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 text-left text-sm font-medium">
          <tr>
            {headers.map((head, index) => (
              <th key={index} className="p-2">{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {children}
        </tbody>
      </table>
    </div>
  )
}
