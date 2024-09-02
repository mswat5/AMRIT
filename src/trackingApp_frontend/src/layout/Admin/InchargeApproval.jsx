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
import { toast } from "@/components/ui/use-toast";

import { ActorContext } from "../../ActorContext";

const InchargeApproval = () => {
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");
  const [data, setData] = useState([]);
  const { actors } = useContext(ActorContext);

  // Function to handle approval
  const handleApprove = async (id) => {
    try {
      const result = await actors.admin.approveIncharge(id);
      if (result.ok) {
        console.log(`Approved incharge with ID: ${id}`);
        setData(data.filter((incharge) => incharge[0] !== id));
        toast({
          title: "Success",
          description: "incharge ID No. :" + id + " Approved",
          variant: "success",
        });
      } else {
        console.error("Failed to approve incharge:", result.err);
        toast({
          title: "Failed to approve incharge:",
          description: result.err,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error approving incharge:", error);
      toast({
        title: "Error approving incharge:",
        description: error,
        variant: "destructive",
      });
    }
  };

  // Function to handle rejection
  const handleReject = async (id) => {
    try {
      const result = await actors.admin.rejectIncharge(id);
      if (result.ok) {
        console.log(`Rejected incharge with ID: ${id}`);
        setData(data.filter((incharge) => incharge[0] !== id));
      } else {
        console.error("Failed to reject incharge:", result.err);
      }
    } catch (error) {
      console.error("Error rejecting incharge:", error);
    }
  };
  const columns = [
    { accessorKey: "name", header: "Incharge Name" },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => {
        const { latitude, longitude, address } = row.original.location;
        return (
          <div>
            <div>{address}</div>
            <div>
              Lat: {latitude}, Long: {longitude}
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "inchargeType",
      header: "Designation",
      cell: ({ row }) => {
        return <div>{Object.keys(row.original.inchargeType)[0]}</div>;
      },
    },
    {
      accessorKey: "contactInfo",
      header: "Contact Info",
      cell: ({ row }) => {
        const { phoneNumber, email } = row.original.contactInfo;
        return (
          <div>
            <div>Phone: {phoneNumber}</div>
            <div>Email: {email}</div>
          </div>
        );
      },
    },
    { accessorKey: "certificationID", header: "Certification ID" },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex justify-center space-x-2">
          <Button
            onClick={() => handleApprove(row.original.id)}
            variant="success"
            className="bg-green-600 font-bold"
          >
            Approve
          </Button>
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

  useEffect(() => {
    const fetchPendingIncharges = async () => {
      try {
        const result = await actors.admin.listPendingIncharges();
        console.log(result.ok);
        console.log(result);

        if (result.ok) {
          setData(
            result.ok.map(([id, registration]) => {
              console.log({ id, ...registration });
              return { id, ...registration };
            })
          );
        } else {
          console.error("Failed to fetch pending Incharges:", result.err);
        }
      } catch (error) {
        console.error("Error fetching pending Incharges:", error);
      }
    };

    fetchPendingIncharges();
  }, [actors]);

  return (
    <div className="p-4 min-h-screen dark:bg-[conic-gradient(at_bottom_right,_var(--tw-gradient-stops))] from-blue-700 via-blue-800 to-gray-900 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Incharge Approval</h1>
      <div className="p-4 flex flex-col items-center overflow-x-auto w-full">
        <input
          type="text"
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)}
          placeholder="Filter..."
          className="mb-4 p-2 border border-gray-300 text-black rounded"
        />
        <Table className="min-w-full border-separate border-spacing-0">
          <TableCaption>A list of patients awaiting approval</TableCaption>
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

export default InchargeApproval;
