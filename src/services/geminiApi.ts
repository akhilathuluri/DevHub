import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('Gemini API key is not configured! Please set VITE_GEMINI_API_KEY in your .env file');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const generateResumeContent = async (githubData: any) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Create a professional resume using this GitHub profile data. Respond ONLY with a valid JSON object containing exactly these fields:
    {
      "professionalSummary": "string",
      "technicalSkills": ["string"],
      "projectHighlights": [{"name": "string", "description": "string"}],
      "contributionsAndAchievements": ["string"],
      "recommendations": "string"
    }

    Use this profile data:
    Name: ${githubData.name}
    Bio: ${githubData.bio}
    Repositories: ${JSON.stringify(githubData.repositories)}
    Languages: ${JSON.stringify(githubData.languages)}
    Contributions: ${githubData.contributions}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean up the response to ensure valid JSON
    const jsonStr = text.replace(/```json\s*|\s*```/g, '').trim();
    
    try {
      return JSON.parse(jsonStr);
    } catch (parseError) {
      console.error('Failed to parse JSON response:', jsonStr);
      throw new Error('Invalid response format from AI');
    }
  } catch (error) {
    console.error('Error generating resume content:', error);
    throw error;
  }
};
