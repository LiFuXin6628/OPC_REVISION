const measurements = [
  { key: "uncorrectedVision", label: "Thị lực không kính (/10)", min: 0, max: 10, step: "any" },
  { key: "sph", label: "SPH (D)", step: "any" },
  { key: "cyl", label: "CYL (D)", step: "any" },
  { key: "axis", label: "AXIS (độ)", min: 0, max: 180, step: "1" },
  { key: "correctedVision", label: "Thị lực có kính (/10)", min: 0, max: 10, step: "any" },
];

export function EyeFields({ side, label }: { side: "leftEye" | "rightEye"; label: string }) {
  return <fieldset className="eye-panel">
    <legend className="sr-only">{label}</legend>
    <div className="eye-panel-title" aria-hidden="true">{label}</div>
    <div className="eye-panel-fields stack">
      {measurements.map(({ key, label, ...limits }) => <label key={key} className="field">
        {label}
        <input type="number" name={`${side}.${key}`} {...limits} />
      </label>)}
      <label className="field">Loại kính
        <input name={`${side}.lensType`} maxLength={120} />
      </label>
    </div>
  </fieldset>;
}
