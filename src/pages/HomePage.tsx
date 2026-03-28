import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { PartyItem } from "../components/PartyItem";
import { useParties } from "../hooks/useParties";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export const HomePage = () => {
  const {
    addParty,
    chartData,
    chartOptions,
    removeParty,
    updatePartyName,
    updateVotes,
    parties,
    status,
  } = useParties();

  return (
    <div className="chart-container">
      <h1>Resultados electorales</h1>
      <h3>conexion: {status}</h3>
      <div className="chart-wrapper">
        <Bar options={chartOptions} data={chartData} />
      </div>

      <div className="controls-seccion">
        <div className="controls-header">
          <h2>configuracion de partidos</h2>
          <button className="btn-add" onClick={addParty}>
            + agregar partido
          </button>
        </div>

        <div className="party-list">
          {parties.map((party) => (
            <PartyItem
              key={party.id}
              party={party}
              onNameChange={(newName) => updatePartyName(party.id, newName)}
              onVotesChange={updateVotes}
              onRemove={() => removeParty(party.id)}
              canRemove={parties.length > 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
