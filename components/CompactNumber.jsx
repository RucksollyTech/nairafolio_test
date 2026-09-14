import { Text } from "react-native";


function formatCompactNumber(value) {
  if (!Number.isFinite(value)) return String(value);

  const suffixes = ["", "K", "M", "B", "T", "Qa", "Qi"];
  const absValue = Math.abs(value);

  if (absValue < 1_000) return String(value);

  let tier = Math.min(
    Math.floor(Math.log10(absValue) / 3),
    suffixes.length - 1
  );

  let scaled = value / 1_000 ** tier;

  if (
    Math.abs(Number(scaled.toFixed(2))) >= 1_000 &&
    tier < suffixes.length - 1
  ) {
    tier++;
    scaled = value / 1_000 ** tier;
  }

  return `${Number(scaled.toFixed(2))}${suffixes[tier]}`;
}

export function CompactNumber({ value, ...textProps }) {
  return <Text {...textProps}>{formatCompactNumber(value)}</Text>;
}