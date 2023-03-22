import * as React from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  useReactTable
} from "@tanstack/react-table";
import { TableVirtuoso } from "react-virtuoso";
import { makeData, Person } from "./makeData";

import "./styles.css";

export default function App() {
  const rerender = React.useReducer(() => ({}), {})[1];
  const data = React.useMemo(() => makeData(300), []);

  const columns = React.useMemo<ColumnDef<Person>[]>(
    () => [
      {
        header: "Name",
        columns: [
          {
            accessorKey: "firstName",
            header: "First Name",
            cell: (info) => info.getValue()
          },
          {
            accessorKey: "lastName",
            header: () => <span>Last Name</span>,
            cell: (info) => info.getValue()
          }
        ]
      },
      {
        header: "Info",
        columns: [
          {
            accessorKey: "age",
            header: () => "Age"
          },
          {
            header: "More Info",
            columns: [
              {
                accessorKey: "visits",
                header: () => <span>Visits</span>,
                aggregationFn: "sum"
              },
              {
                accessorKey: "status",
                header: "Status"
              },
              {
                accessorKey: "progress",
                header: "Profile Progress"
              }
            ]
          }
        ]
      }
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getGroupedRowModel: getGroupedRowModel()
  });

  const rows = table.getRowModel().rows;

  return (
    <div className="p-2">
      <TableVirtuoso<Person>
        style={{ height: "400px" }}
        totalCount={rows.length}
        components={{
          Table: ({ style, ...props }) => {
            return (
              <table
                {...props}
                style={{ ...style, width: 800, tableLayout: "fixed" }}
              />
            );
          },
          TableBody: React.forwardRef(({ style, ...props }, ref) => (
            <tbody {...props} ref={ref} />
          )),
          TableRow: (props) => {
            const index = props["data-index"];
            const row = rows[index];
            console.log(row);

            return (
              <tr {...props}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          }
        }}
        fixedHeaderContent={() => {
          return table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ));
        }}
      />

      <div className="h-4" />
      <button onClick={() => rerender()} className="border p-2">
        Rerender
      </button>
    </div>
  );
}
