import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Adjust the import path based on your project structure

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

// Sample data for demonstration
const data = Array.from({ length: 50 }, (_, i) => ({
  id: (i + 1).toString(),
  accidentId: `Accident-${i + 1}`,
  patientId: `Patient-${i + 1}`,
  facilityId: `Facility-${i + 1}`,
  reportType: i % 2 === 0 ? "Incident" : "Follow-Up",
  timestamp: new Date().toLocaleString(),
  details: `Details of report ${i + 1}`,
  file: i % 3 === 0 ? "Available" : null,
}));

const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "accidentId", header: "Accident ID" },
  { accessorKey: "patientId", header: "Patient ID" },
  { accessorKey: "facilityId", header: "Facility ID" },
  { accessorKey: "reportType", header: "Report Type" },
  { accessorKey: "timestamp", header: "Timestamp" },
  { accessorKey: "details", header: "Details" },
  {
    accessorKey: "file",
    header: "File",
    cell: ({ row }) =>
      row.original.file ? (
        <button
          onClick={() => handleDownload(row.original.id)}
          className="text-blue-500 hover:underline"
        >
          Download
        </button>
      ) : (
        <span>No File</span>
      ),
  },
];

const handleDownload = (reportId) => {
  // Dummy function for download
  console.log(`Downloading file for report ID: ${reportId}`);
  alert(`Download functionality will be integrated for report ID: ${reportId}`);
};

const ReportsTable = () => {
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting: sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
  });

  return (
    <div className="p-4 min-h-screen dark:bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-blue-700 via-blue-800 to-gray-900 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Reports Management</h1>
      <div className="p-4 flex flex-col items-center overflow-x-auto w-full">
        <input
          type="text"
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)}
          placeholder="Filter..."
          className="mb-4 p-2 border border-gray-300 text-black rounded"
        />
        <Table className="min-w-full border-separate border-spacing-0">
          <TableCaption>A list of reports</TableCaption>
          <TableHeader className="">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-gray-900 text-white "
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="p-3 text-left border-r border-gray-600 cursor-pointer font-bold"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    <span>
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted()] ?? null}
                    </span>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="dark:hover:bg-secondary hover:bg-gray-200  "
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="p-3 border border-gray-900"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 flex justify-between items-center gap-12">
          <div>
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="mr-2 p-2 border rounded"
            >
              First Page
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="mr-2 p-2 border rounded"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="mr-2 p-2 border rounded"
            >
              Next
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="p-2 border rounded"
            >
              Last Page
            </button>
          </div>
          <div>
            <span>
              Page{" "}
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </strong>{" "}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsTable;
