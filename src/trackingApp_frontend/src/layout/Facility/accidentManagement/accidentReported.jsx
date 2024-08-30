import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/ui/button"; // Adjust the import path based on your project structure
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
import ActorContext from "../../../ActorContext";

const IncidentReported = () => {
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");
  const [data, setData] = useState([]);
  const { actors } = useContext(ActorContext);

  useEffect(() => {
    async function fetchAccidentsReported() {
      const result = await actors.accident.getAccidentsByFacility();
      if (result.ok) {
        setData(result.ok);
      } else {
        console.error(result.err);
      }
    }
    fetchAccidentsReported();
  }, [actors]);

  const columns = [
    { accessorKey: "id", header: "ID" },
    {
      accessorKey: "details",
      header: "Description",
      cell: ({ row }) => {
        return <div>{row.original.details.description}</div>;
      },
    },
    {
      accessorKey: "details",
      header: "Severity",
      cell: ({ row }) => {
        return <div>{Object.keys(row.original.details.severity)[0]}</div>;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return <div>{Object.keys(row.original.status)[0]}</div>;
      },
    },
    {
      accessorKey: "timestamp",
      header: "Reported at",
      cell: ({ row }) => (
        <div>
          {new Date(Number(row.original.timestamp) / 1000000).toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex justify-center space-x-2">
          <Button
            onClick={() => handleEdit(row.original.id)}
            className="bg-blue-500 font-bold"
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDelete(row.original.id)}
            className="bg-red-500 font-bold"
          >
            Delete
          </Button>
          <Button
            onClick={() => handleTimeline(row.original.id)}
            className="bg-purple-500 font-bold"
          >
            Get Timeline
          </Button>
        </div>
      ),
    },
  ];

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

  // Function to handle edit
  const handleEdit = (id) => {
    // Handle edit logic
    console.log(`Edited record with ID: ${id}`);
  };

  // Function to handle delete
  const handleDelete = (id) => {
    // Handle delete logic
    console.log(`Deleted record with ID: ${id}`);
  };

  // Function to handle Timeline
  const handleTimeline = (id) => {
    // Handle Timeline logic
    console.log(`Timeline record with ID: ${id}`);
  };

  return (
    <div className="p-4 min-h-screen dark:bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-blue-700 via-blue-800 to-gray-900 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">
        Incidents Reported by Your Facility
      </h1>
      <div className="p-4 flex flex-col items-center overflow-x-auto w-full ">
        <input
          type="text"
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)}
          placeholder="Filter..."
          className="mb-4 p-2 border border-gray-300 text-black rounded"
        />
        <Table className="min-w-full border-separate border-spacing-0">
          <TableCaption>A list of reported Incidents</TableCaption>
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

export default IncidentReported;
