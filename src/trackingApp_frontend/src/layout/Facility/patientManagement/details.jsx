import React, { useState } from 'react';
import { Button } from '@/components/ui/button'; // Adjust the import path based on your project structure
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'; // Adjust the import path based on your project structure

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
  name: `patient ${String.fromCharCode(65 + (i % 26))}`,
  location: `Location ${String.fromCharCode(65 + (i % 26))}`,
  // status: i % 2 === 0 ? 'Pending' : 'Approved',
  contactInfo: `123-456-78${i.toString().padStart(2, "0")}`,
  age: `${String.fromCharCode(65 + (i % 26))}${i}yr`,
}));

// Function to handle approval
const handleEdit = (id) => {
  // Handle approve logic
  console.log(`Edit patient with ID: ${id}`);
};
// Function to handle download
const handleDownload = (id) => {
  // Handle download logic
  console.log(`download record with ID: ${id}`);
};

// Function to handle rejection
const handleDelete = (id) => {
  // Handle reject logic
  console.log(`Delete Patient with ID: ${id}`);
};

const details = () => {
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");

const columns = [
  { accessorKey: 'name', header: 'patient Name' },
  { accessorKey: 'location', header: 'Location' },
  // { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'contactInfo', header: 'Contact Info' },
  { accessorKey: 'age', header: ' Age' },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <div className="flex justify-center space-x-2">
        <Button onClick={() => handleEdit(row.original.id)} variant="success" className="bg-green-600 font-bold">Edit</Button>
        <Button onClick={() => handleDelete(row.original.id)} 
        className="font-bold" variant="">Delete</Button>
         <Button onClick={() => handleDownload(row.original.id)} className="bg-purple-500 font-bold">
           Download
        </Button>
      </div>
    ),
  },
];

const details = () => {
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState('');

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
    <div className="p-4 flex flex-col items-center overflow-x-auto w-full">
      <input
        type="text"
        value={filtering}
        onChange={(e) => setFiltering(e.target.value)}
        placeholder="Filter..."
        className="mb-4 p-2 border border-gray-300 text-black rounded"
      />
      <Table className="min-w-full border-separate border-spacing-0">
        <TableCaption>A list of patients </TableCaption>
        <TableHeader className="">
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id} className="bg-gray-900 text-white ">
              {headerGroup.headers.map(header => (
                <TableHead
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="p-3 text-left border-r border-gray-600 cursor-pointer  font-bold"
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
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id} className="dark:hover:bg-secondary hover:bg-gray-200  ">
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id} className="p-3 border border-gray-900">
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
        <div className="">
          <span className="">
            Page{" "}
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>{" "}
          </span>
          {/* <span>
            | Go to page:{' '}
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                table.setPageIndex(page);
              }}
              className="w-16 p-2 border rounded"
            />
          </span> */}
        </div>
      </div>
    </div>
  );
};

export default details;
