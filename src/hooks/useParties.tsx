import { use, useEffect, useState } from "react";
import { WebSocketContext } from "../context/WebSocketContext";
import type { Party } from "../types";
import type { ChartData, ChartOptions } from "chart.js";

const PARTY_COLORS = [
  {
    color: "rgba(220, 53, 69, 0.2)",
    borderColor: "rgb(220, 53, 69)",
  },
  {
    color: "rgba(0, 123, 255, 0.2)",
    borderColor: "rgb(0, 123, 255)",
  },
  {
    color: "rgba(40, 167, 69, 0.2)",
    borderColor: "rgb(40, 167, 69)",
  },
  {
    color: "rgba(255, 193, 7, 0.2)",
    borderColor: "rgb(255, 193, 7)",
  },
  {
    color: "rgba(255, 152, 0, 0.2)",
    borderColor: "rgb(255, 152, 0)",
  },
];

export const useParties = () => {
  const { status, send, lastMessage } = use(WebSocketContext);
  const [parties, setParties] = useState<Party[]>([]);

  useEffect(() => {
    if (!lastMessage) return;
    switch (lastMessage.type) {
      case "PARTIES_LIST":
        setParties(lastMessage.payload as Party[]);
        break;

      case "PARTY_ADDED":
        setParties((prev) => [...prev, lastMessage.payload as Party]);
        break;

      case "VOTES_UPDATED":
      case "PARTY_UPDATE":
        setParties((prev) =>
          prev.map((party) =>
            party.id === (lastMessage.payload as Party).id
              ? (lastMessage.payload as Party)
              : party,
          ),
        );
        break;

      case "PARTY_DELETE":
        setParties((prev) =>
          prev.filter(
            (party) => party.id !== (lastMessage.payload as Party).id,
          ),
        );
        break;

      case "ERROR":
        console.error("Error del servidor:", lastMessage.payload);
        break;
    }
  }, [lastMessage]);

  const updatePartyName = (id: string, newName: string) => {
    send({
      type: "UPDATE_PARTY",
      payload: { id: id, name: newName },
    });
  };

  const updateVotes = (id: string, value: number) => {
    send({
      type: value > 0 ? "INCREMENT_VOTES" : "DECREMENT_VOTES",
      payload: { id },
    });
  };

  const addParty = () => {
    const newColor = PARTY_COLORS[parties.length % PARTY_COLORS.length];
    const newParty = {
      name: `Nuevo partido ${parties.length + 1}`,
      votes: 0,
      color: newColor.color,
      borderColor: newColor.borderColor,
    };

    send({
      type: "ADD_PARTY",
      payload: newParty,
    });
  };

  const removeParty = (id: string) => {
    send({
      type: "DELETE_PARTY",
      payload: { id },
    });
  };

  const chartData: ChartData<"bar"> = {
    labels: parties.map((p) => p.name),
    datasets: [
      {
        data: parties.map((p) => p.votes),
        backgroundColor: parties.map((c) => c.color),
        borderColor: parties.map((c) => c.borderColor),
        borderWidth: 2,
      },
    ],
  };

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Votos por partido",
      },
    },
  };

  return {
    chartData,
    removeParty,
    updatePartyName,
    updateVotes,
    addParty,
    chartOptions,
    parties,
    status,
  };
};
