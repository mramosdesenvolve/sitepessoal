/**
 * Motivo de linha do ID Pessoal — espessura do fio ao sólido, passo fixo,
 * uma cor por composição (`currentColor`). Geometria idêntica a
 * assets/motivo-aneis.svg.
 */

/** Anéis concêntricos: 28 círculos, fio de 0,5 a 5,5 do exterior ao centro. */
export function Rings({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true">
      {Array.from({ length: 28 }, (_, i) => (
        <circle
          key={i}
          cx="200"
          cy="200"
          r={196 - 7 * i}
          fill="none"
          stroke="currentColor"
          strokeWidth={0.5 + (5 * i) / 27}
        />
      ))}
    </svg>
  );
}
