export const functionOptions = [
  { name: "getWeather", key: "getWeather", config: { type: "app" } },
  {
    name: "getLambdaData-1",
    key: "getLambdaData-1",
    config: { type: "lambda", arn: "xxxxx", latency: 500 },
  },
  {
    name: "getLambdaData-2",
    key: "getLambdaData-2",
    config: { type: "lambda", arn: "xxxxx", latency: 4000 },
  },
];

export const planOptions = [
  { name: "free", key: "0" },
  { name: "plan-1", key: "1" },
  { name: "plan-2", key: "2" },
];

export const languageOptions = [
  { name: "English", key: "en" },
  { name: "Finnish", key: "fi" },
  { name: "Spanish", key: "es" },
];

export const metaTagOptions = [
  { name: "Validated", key: "validated" },
  { name: "Document", key: "document" },
  { name: "Transcript", key: "transcript" },
  { name: "Processed", key: "processed" },
];
