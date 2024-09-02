import React, { useContext, useState } from "react";
import { ActorContext } from "../../../ActorContext";

const AccidentTimeline = ({ accidentActor }) => {
  const [accidentId, setAccidentId] = useState("");
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);
  const { actors } = useContext(ActorContext);

  const fetchTimeline = async () => {
    if (!accidentId) {
      alert("Please enter an accident ID");
      return;
    }

    setLoading(true);
    try {
      const result = await actors.accident.getAccidentTimeline(accidentId);
      if ("ok" in result) {
        setTimeline(result.ok);
      } else {
        throw new Error(result.err);
      }
    } catch (error) {
      console.error("Error fetching accident timeline:", error);
      alert("Failed to fetch accident timeline");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(Number(timestamp) / 1000000).toLocaleString();
  };

  return (
    <div className="p-6 bg-gray-200 shadow-lg rounded-md">
      <h2 className="text-2xl font-bold mb-4">Accident Timeline</h2>
      <div className="flex mb-4 space-x-2">
        <input
          type="text"
          placeholder="Enter Accident ID"
          value={accidentId}
          onChange={(e) => setAccidentId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={fetchTimeline}
          disabled={loading}
          className={`px-4 py-2 font-semibold text-white md:min-w-fit bg-indigo-500 rounded-lg ${
            loading ? "bg-red-400" : "hover:bg-red-600"
          } focus:outline-none focus:ring-2 focus:ring-red-500`}
        >
          {loading ? "Fetching..." : "Fetch Timeline"}
        </button>
      </div>
      {timeline.length > 0 ? (
        <div className="space-y-4">
          {timeline.map((event, index) => (
            <div key={index} className="flex items-start space-x-4">
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
  );
};

export default AccidentTimeline;
