const DIFFICULTY_OPTIONS = [
  { value: "", label: "All Difficulties" },
  { value: "easy", label: "Easy" },
  { value: "moderate", label: "Moderate" },
  { value: "hard", label: "Hard" },
  { value: "expert", label: "Expert" },
];

export default function DifficultyFilter({ value, onChange }) {
  return (
    <div className="difficulty-filter">
      {DIFFICULTY_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`filter-btn ${value === option.value ? "filter-btn-active" : ""} ${
            option.value ? `filter-btn-${option.value}` : ""
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
