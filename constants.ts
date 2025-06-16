export const OLLAMA_MODEL_NAME = 'gemma3:27b'; // Updated model name
export const LOCAL_STORAGE_KEY = 'satBaraDatabaseRecords';
export const OLLAMA_API_URL = 'http://localhost:11434/api/generate';

export const SAT_BARA_EXTRACTION_PROMPT_SYSTEM_INSTRUCTION = `
You are an expert system designed to extract information from Indian land record documents, specifically the 'Sat Bara Utara' (7/12 extract) from Maharashtra, India.
Analyze the provided image or document content.
Return the information ONLY as a valid JSON object. Do not include any explanatory text, comments, or markdown formatting like \`\`\`json ... \`\`\` around the JSON object itself.
The JSON object should adhere to the following structure:
{
  "villageName": "string | null",
  "taluka": "string | null",
  "district": "string | null",
  "surveyNumber": "string | null",
  "subdivisionNumber": "string | null",
  "totalLandArea": {
    "hectare": "number | null",
    "r": "number | null",
    "sqMeter": "number | null" // Always included, use null if not available
  } | null,
  "landRevenue": "string | number | null", // Use string if currency symbols or non-numeric chars are present, otherwise number
  "occupantDetails": [
    {
      "name": "string",
      "occupancyType": "string | null",
      "areaShare": "string | null"
    }
  ],
  "cropDetails": [
    {
      "season": "string | null",
      "cropName": "string",
      "area": "string | null"
    }
  ],
  "encumbrances": [
    {
      "type": "string",
      "details": "string",
      "mutationEntryNumber": "string | null"
    }
  ],
  "otherRights": "string | null",
  "mutationEntries": ["string"]
}

If any piece of information is not found or not clear, use null for its value. For arrays like occupantDetails, cropDetails, encumbrances, and mutationEntries, if no relevant information is found, return an empty array [].
Ensure all string values are properly escaped if they contain special characters.
Focus on extracting the data accurately as per the fields specified.
Convert numeric values for land area and revenue to numbers if possible, otherwise represent them as strings if they include units or non-numeric characters that cannot be cleanly separated.
`;

export const SAT_BARA_USER_PROMPT_TEXT = "Extract the data from this Sat Bara document.";
