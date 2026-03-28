import type { Party } from '../types';

interface Props {
  party: Party;
  onNameChange: (newName: string) => void;
  onVotesChange: (id: string, value: number) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export const PartyItem = ({
  party,
  onNameChange,
  onVotesChange,
  onRemove,
  canRemove,
}: Props) => {
  return (
    <div className="party-item">
      <div
        className="party-color"
        style={{
          backgroundColor: party.color,
          borderColor: party.borderColor,
          borderWidth: 2,
          borderStyle: 'solid',
        }}
      />

      <input
        type="text"
        className="party-name-input"
        value={party.name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Nombre del partido"
      />

      <div className="vote-controls">
        <button
          className="btn-vote"
          onClick={() => onVotesChange(party.id, -1)}
        >
          −
        </button>
        <span className="vote-count">{party.votes}</span>
        <button className="btn-vote" onClick={() => onVotesChange(party.id, 1)}>
          +
        </button>
      </div>

      <button
        className="btn-remove"
        onClick={onRemove}
        disabled={!canRemove}
        title="Eliminar partido"
      >
        ✕
      </button>
    </div>
  );
};