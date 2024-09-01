import React, { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// const ambulanceSchema = z.object({
//   facilityName: z.string().min(1, "Facility Name is required"),
//   facilityLocation: z.string().min(1, "Location is required"),
//  description:
// });
// Sample data for demonstration
const data = Array.from({ length: 50 }, (_, i) => ({
  id: (i + 1).toString(),
  name: `Ambulance ${String.fromCharCode(65 + (i % 26))}`,
  location: `Location ${String.fromCharCode(65 + (i % 26))}`,
  status: i % 2 === 0 ? "Pending" : "Approved",
  contactInfo: `123-456-78${i.toString().padStart(2, "0")}`,
  certificationId: `Cert${String.fromCharCode(65 + (i % 26))}${i}`,
}));
// const {
//   register,
//   handleSubmit,
//   setValue,
//   formState: { errors },
// } = useForm({
//   resolver: zodResolver(facilitySchema),
//   defaultValues: {
//     facilityName: "",
//     facilityLocation: "",
//     facilityCapacity: 0,
//     services: "",
//     certificationId: "",
//     contactName: "",
//     contactEmail: "",
//     contactPhone: "",
//   },
// });
// Function to handle approval
const handleApprove = (id) => {
  // Handle approve logic
  console.log(`Approved ambulance with ID: ${id}`);
};

// Function to handle rejection
const handleReject = (id) => {
  // Handle reject logic
  console.log(`Rejected ambulance with ID: ${id}`);
};

const columns = [
  { accessorKey: "name", header: "Ambulance Name" },
  { accessorKey: "location", header: "Location" },
  { accessorKey: "status", header: "Status" },
  { accessorKey: "contactInfo", header: "Contact Info" },
  { accessorKey: "certificationId", header: "Certification ID" },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex justify-center space-x-2">
        {/* <Button onClick={() => handleApprove(row.original.id)} variant="success" className="bg-green-600 font-bold">Approve</Button> */}
        <Dialog>
          <DialogTrigger asChild>
            <Button
              onClick={() => handleApprove(row.original.id)}
              variant="success"
              className="bg-green-600 font-bold"
            >
              Approve
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">
                  Name
                </label>
                <input
                  id="name"
                  defaultValue="Pedro Duarte"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="username" className="text-right">
                  Username
                </label>
                <input
                  id="username"
                  defaultValue="@peduarte"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button
          onClick={() => handleReject(row.original.id)}
          className="font-bold"
          variant=""
        >
          Reject
        </Button>
      </div>
    ),
  },
];

const AmbulanceApprovalTable = () => {
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
      <h1 className="text-2xl font-bold mb-4">Ambulance Approval</h1>
      <div className="p-4 flex flex-col items-center overflow-x-auto w-full">
        <input
          type="text"
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)}
          placeholder="Filter..."
          className="mb-4 p-2 border border-gray-300 text-black rounded"
        />
        <Table className="min-w-full border-separate border-spacing-0">
          <TableCaption>A list of ambulances awaiting approval</TableCaption>
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
          <div className="">
            <span className="">
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

export default AmbulanceApprovalTable;
