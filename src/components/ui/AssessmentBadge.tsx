import type { AssessmentLevel } from "@/types/practice";

interface AssessmentBadgeProps {
  level: AssessmentLevel;
  /** Optional custom labels. Defaults to "On track", "Stretched", "Needs attention", "Note" */
  labels?: {
    good?: string;
    stretched?: string;
    concerning?: string;
    neutral?: string;
  };
}

const defaultLabels = {
  good: "On track",
  stretched: "Stretched",
  concerning: "Needs attention",
  neutral: "Note",
};

const styles: Record<AssessmentLevel, string> = {
  good: "bg-green-100 text-green-800 border-green-200",
  stretched: "bg-yellow-100 text-yellow-800 border-yellow-200",
  concerning: "bg-red-100 text-red-800 border-red-200",
  neutral: "bg-gray-100 text-gray-800 border-gray-200",
};

export function AssessmentBadge({ level, labels }: AssessmentBadgeProps) {
  const mergedLabels = { ...defaultLabels, ...labels };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[level]}`}
    >
      {mergedLabels[level]}
    </span>
  );
}
