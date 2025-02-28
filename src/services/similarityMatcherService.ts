import { GoogleGenerativeAI } from "@google/generative-ai";
import { getUserData } from "./githubApi";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export const findSimilarDevelopers = async (username: string) => {
  try {
    const userData = await getUserData(username);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Based on this GitHub profile:
    Name: ${userData.name}
    Bio: ${userData.bio}
    Languages: ${JSON.stringify(userData.languages)}
    Repositories: ${JSON.stringify(userData.repositories)}

    Generate 5 similar developer profiles with the following JSON structure:
    {
      "similarProfiles": [{
        "username": "string",
        "name": "string",
        "bio": "string",
        "matchScore": number (0-100),
        "similarityReasons": ["string"],
        "commonInterests": ["string"],
        "recommendedCollaborations": ["string"],
        "sharedTechnologies": ["string"]
      }],
      "analysis": {
        "matchCriteria": ["string"],
        "codingStyleSimilarities": ["string"],
        "projectInterests": ["string"]
      }
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonStr = text.replace(/```json\s*|\s*```/g, '').trim();
    
    return {
      ...JSON.parse(jsonStr),
      originalProfile: {
        username,
        ...userData
      }
    };
  } catch (error) {
    console.error('Error finding similar developers:', error);
    throw error;
  }
};
