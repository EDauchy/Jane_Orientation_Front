export type RomeInference = {
  metiersRome: {
    libelleAppellation: string;
    codeAppellation: string;
    libelleRome: string;
    codeRome: string;
    scorePrediction: number;
  }[];
  uuidInference: string;
  identifiant: string;
  intitule: string;
  contexte?: string;
};

type Props = { data: RomeInference[] };

export default function RomeInferenceResults({ data }: Props) {
  if (!data?.length) {
    return (
      <p className="text-[13px] text-muted text-center py-4">
        Aucun résultat à afficher.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {data.map((group) => (
        <div key={group.uuidInference} className="flex flex-col gap-2">
          <span className="text-[11px] font-bold uppercase tracking-label text-muted">
            {group.identifiant} — {group.intitule}
          </span>
          <ul className="flex flex-col gap-2">
            {group.metiersRome.slice(0, 3).map((metier, i) => (
              <li
                key={`${metier.codeAppellation}-${i}`}
                className="flex items-start justify-between gap-3 rounded-2xl bg-pink-lt px-4 py-3"
              >
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-[14px] font-bold text-ink leading-snug">
                    {metier.libelleAppellation}
                  </span>
                  <span className="text-[11px] text-muted truncate">
                    {metier.libelleRome} · {metier.codeRome}
                  </span>
                </div>
                <span className="text-[13px] font-black tabular-nums text-pink shrink-0">
                  {Math.round(metier.scorePrediction * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
 