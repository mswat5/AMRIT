import React, { useState, useEffect, useContext } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ActorContext } from "../../../ActorContext";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { reportIncidentSchema } from "../../zod";
import { useForm } from "react-hook-form";

const ActiveAccidents = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reportIncidentSchema),
  });
  const [data, setData] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [filtering, setFiltering] = useState("");
  const [timeline, setTimeline] = useState([]);
  const [isTimelineDialogOpen, setIsTimelineDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAccidentId, setSelectedAccidentId] = useState(null);
  const { actors } = useContext(ActorContext);

  useEffect(() => {
    const fetchAccidents = async () => {
      try {
        const result = await actors.accident.listActiveAccidentsForFacility();
        if ("ok" in result) {
          setData(result.ok);
        } else {
          throw new Error(result.err);
        }
      } catch (error) {
        console.error("Error fetching active accidents:", error);
      }
    };

    fetchAccidents();
  }, [actors.accident]);

  const handleEdit = async (formData) => {
    console.log("handleEdit called with formData:", formData);
    try {
      const result = await actors.accident.editAccidentDetails(
        selectedAccidentId,
        {
          currentFacilityId: "0",
          reportingFacilityId: "0",
          description: formData.description,
          severity: { [formData.severity]: null },
          status: { [formData.status]: null },
        }
      );
      if ("ok" in result) {
        console.log("Accident updated successfully");
        setData((prevData) =>
          prevData.map((accident) =>
            accident.id === selectedAccidentId
              ? {
                  ...accident,
                  details: {
                    ...accident.details,
                    description: formData.description,
                    severity: { [formData.severity]: formData.severity },
                  },
                  status: { [formData.status]: formData.status },
                }
              : accident
          )
        );
        setIsEditDialogOpen(false);
      } else {
        throw new Error(result.err);
      }
    } catch (error) {
      console.error("Error updating accident:", error);
      alert("Failed to update accident");
    }
  };

  const handleViewTimeline = async (id) => {
    try {
      const result = await actors.accident.getAccidentTimeline(id);
      if ("ok" in result) {
        setTimeline(result.ok);
        setSelectedAccidentId(id);
        setIsTimelineDialogOpen(true);
      } else {
        throw new Error(result.err);
      }
    } catch (error) {
      console.error("Error fetching accident timeline:", error);
      alert("Failed to fetch accident timeline");
    }
  };

  const columns = [
    {
      accessorKey: "id",
      header: "Accident ID",
    },
    {
      accessorKey: "details.description",
      header: "Description",
    },
    {
      accessorKey: "details.severity",
      header: "Severity",
      cell: ({ row }) => {
        const severity = Object.keys(row.original.details.severity)[0];
        return severity;
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = Object.keys(row.original.status)[0];
        return status;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button
            onClick={() => {
              setSelectedAccidentId(row.original.id);
              setValue("description", row.original.details.description);
              setValue(
                "severity",
                Object.keys(row.original.details.severity)[0]
              );
              setValue("status", Object.keys(row.original.status)[0]);
              setIsEditDialogOpen(true);
            }}
          >
            Edit
          </Button>
          <Button onClick={() => handleViewTimeline(row.original.id)}>
            View Timeline
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
      sorting,
      globalFilter: filtering,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFiltering,
  });

  const formatDate = (timestamp) => {
    return new Date(Number(timestamp) / 1000000).toLocaleString();
  };

  return (
    <div>
      <div className="flex items-center py-4">
        <input
          placeholder="Filter accidents..."
          value={filtering}
          onChange={(e) => setFiltering(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      <Dialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Accident</DialogTitle>
            <DialogDescription>
              You are editing this accident.
            </DialogDescription>
          </DialogHeader>
          <form>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="description"
                  className="text-right"
                >
                  Description
                </label>
                <input
                  id="description"
                  {...register("description")}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="severity"
                  className="text-right"
                >
                  Severity
                </label>
                <select
                  id="severity"
                  {...register("severity")}
                  className="col-span-3"
                >
                  <option value="Minor">Minor</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="status"
                  className="text-right"
                >
                  Status
                </label>
                <select
                  id="status"
                  {...register("status")}
                  className="col-span-3"
                >
                  <option value="Reported">Reported</option>
                  <option value="ServiceAssigned">Service Assigned</option>
                  <option value="InProgress">In Progress</option>
                </select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleEdit}
              >
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isTimelineDialogOpen}
        onOpenChange={setIsTimelineDialogOpen}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              Timeline for Accident {selectedAccidentId}
            </DialogTitle>
            <DialogDescription>
              Viewing the timeline for this accident.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {timeline.length > 0 ? (
              <div className="space-y-4">
                {timeline.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-500 text-white rounded-full">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold">{event.status}</p>
                      <p>{formatDate(event.timestamp)}</p>
                      <p>{event.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No timeline data available</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActiveAccidents;
