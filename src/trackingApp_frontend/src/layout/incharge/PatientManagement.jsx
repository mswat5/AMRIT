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
  accidentId: `Acc${i + 1}`,
  name: `Patient ${String.fromCharCode(65 + (i % 26))}`,
  age: Math.floor(Math.random() * 100),
  currentFacilityId: `Fac${i + 1}`,
  status: i % 2 === 0 ? "Active" : "Discharged",
  treatmentDetails: "Details about the treatment.",
  admissionTimestamp: new Date().toLocaleString(),
  dischargeTimestamp: i % 2 === 0 ? null : new Date().toLocaleString(),
}));

const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "accidentId", header: "Accident ID" },
  { accessorKey: "name", header: "Patient Name" },
  { accessorKey: "age", header: "Age" },
  { accessorKey: "currentFacilityId", header: "Facility ID" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "treatmentDetails", header: "Treatment Details" },
  { accessorKey: "admissionTimestamp", header: "Admission Timestamp" },
  { accessorKey: "dischargeTimestamp", header: "Discharge Timestamp" },
];

const PatientManagementTable = () => {
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
      <h1 className="text-2xl font-bold mb-4">Patient Management</h1>
      <div className="p-4 flex flex-col items-center overflow-x-auto w-full">
        <input
          type="text"
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)}
          placeholder="Filter..."
          className="mb-4 p-2 border border-gray-300 text-black rounded"
        />
        <Table className="min-w-full border-separate border-spacing-0">
          <TableCaption>A list of patients under management</TableCaption>
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

export default PatientManagementTable;
