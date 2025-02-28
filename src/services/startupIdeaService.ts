import { GoogleGenerativeAI } from "@google/generative-ai";
import { getUserData } from "./githubApi";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const generateStartupIdeas = async (username: string) => {
  try {
    const githubData = await getUserData(username);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Based on this GitHub user's profile data:
    Name: ${githubData.name}
    Bio: ${githubData.bio}
    Repositories: ${JSON.stringify(githubData.repositories)}
    Languages: ${JSON.stringify(githubData.languages)}
    
    Generate 3 innovative startup ideas that align with their technical skills and interests.
    Return the response as a JSON object with this structure:
    {
      "ideas": [{
        "title": "string",
        "description": "string",
        "valueProposition": "string",
        "targetMarket": "string",
        "techStack": ["string"],
        "keyFeatures": ["string"],
        "monetizationStrategy": "string",
        "challengesToSolve": ["string"]
      }],
      "marketAnalysis": {
        "trends": ["string"],
        "opportunities": ["string"],
        "risks": ["string"]
      },
      "skillsMatch": {
        "existingSkills": ["string"],
        "skillsToAcquire": ["string"],
        "complementaryRoles": ["string"]
      }
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonStr = text.replace(/```json\s*|\s*```/g, '').trim();
    
    return {
      ...JSON.parse(jsonStr),
      github: {
        username: username,
        skills: githubData.languages,
        topRepositories: githubData.repositories.slice(0, 3)
      }
    };
  } catch (error) {
    console.error('Error generating startup ideas:', error);
    throw error;
  }
};
