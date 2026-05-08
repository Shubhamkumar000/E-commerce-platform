import {createColumnHelper, flexRender, getCoreRowModel, useReactTable,} from "@tanstack/react-table";

const DisplayTable = ({ data, column }) => {

  const table = useReactTable({
    data,
    columns: column,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="p-4">
      <div className="overflow-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-slate-900 text-white">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Sr. No</th>
 
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="text-slate-700">
            {table.getRowModel().rows.map((row,index) => (
              <tr key={row.id} className="border-b border-slate-100 even:bg-slate-50/60">
                <td className="px-4 py-3 font-medium text-slate-500">{index+1}</td>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-3 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

        </table>
      </div>
      <div className="h-4"/>
    </div>
  )
};

export default DisplayTable;
