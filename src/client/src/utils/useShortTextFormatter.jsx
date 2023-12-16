export default function useShortTextFormatter(data, shortLength = 15) {
  return data.length > shortLength
    ? `${data.substring(0, shortLength)}...`
    : data;
}
