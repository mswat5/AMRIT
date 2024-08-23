import React, { useContext, useState } from "react";
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
import ActorContext from "../../ActorContext";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

// Sample data for demonstration
// const data = Array.from({ length: 50 }, (_, i) => ({
//   id: (i + 1).toString(),
//   name: `Facility ${String.fromCharCode(65 + (i % 26))}`,
//   location: `Location ${String.fromCharCode(65 + (i % 26))}`,
//   status: i % 2 === 0 ? "Pending" : "Approved",
//   services: `Service ${String.fromCharCode(65 + (i % 26))}`,
//   capacity: (i * 10).toString(),
//   availableBeds: (i * 2).toString(),
//   contactInfo: `123-456-78${i.toString().padStart(2, "0")}`,
//   certificationId: `Cert${String.fromCharCode(65 + (i % 26))}${i}`,
// }));

const FacilityApprovalTable = () => {
  const { actors } = useContext(ActorContext);
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");

  useEffect(() => {
    const fetchPendingFacilities = async () => {
      try {
        const result = await actors.admin.listPendingRegistrations();
        if (result.ok) {
          setData(
            result.ok.map(([id, registration]) => ({ id, ...registration }))
          );
        } else {
          console.error("Failed to fetch pending facilities:", result.err);
        }
      } catch (error) {
        console.error("Error fetching pending facilities:", error);
      }
    };

    fetchPendingFacilities();
  }, [actors]);

  // Function to handle approval
  const handleApprove = async (id) => {
    try {
      const result = await actors.admin.approveFacility(id);
      if (result.ok) {
        console.log(`Approved facility with ID: ${id}`);
        setData(data.filter((facility) => facility[0] !== id));
      } else {
        console.error("Failed to approve facility:", result.err);
      }
    } catch (error) {
      console.error("Error approving facility:", error);
    }
  };

  // Function to handle rejection
  const handleReject = async (id) => {
    try {
      const result = await actors.admin.rejectFacility(id);
      if (result.ok) {
        console.log(`Rejected facility with ID: ${id}`);
        setData(data.filter((facility) => facility[0] !== id));
      } else {
        console.error("Failed to reject facility:", result.err);
      }
    } catch (error) {
      console.error("Error rejecting facility:", error);
    }
  };

  const columns = [
    { accessorKey: "name", header: "Facility Name" },
    { accessorKey: "location", header: "Location" },
    { accessorKey: "status", header: "Status" },
    { accessorKey: "services", header: "Services" },
    { accessorKey: "capacity", header: "Capacity" },
    { accessorKey: "availableBeds", header: "Available Beds" },
    { accessorKey: "contactInfo", header: "Contact Info" },
    { accessorKey: "certificationId", header: "Certification ID" },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex justify-center space-x-2">
          <Button
            onClick={() => handleApprove(row.original[0])}
            variant="success"
            className="bg-green-600 font-bold"
          >
            Approve
          </Button>
          <Button
            onClick={() => handleReject(row.original[0])}
            className="font-bold"
            variant=""
          >
            Reject
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

  return (
    <div className="p-4 min-h-screen dark:bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-blue-700 via-blue-800 to-gray-900 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Facility Approval</h1>
      <div className="p-4 flex flex-col items-center overflow-x-auto w-full md:w-[80%]">
        <input
          type="text"
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)}
          placeholder="Filter..."
          className="mb-4 p-2 border border-gray-300 text-black rounded md:w-3/5 w-1/5"
        />
        <Table className="min-w-full border-separate border-spacing-0">
          <TableCaption>A list of facilities awaiting approval</TableCaption>
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
    </div>
  );
};

export default FacilityApprovalTable;
