import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { User } from '../types';

// IMPORTANT: In a real application, process.env.API_KEY must be set in your environment.
// For this example, we are mocking the functionality since the key isn't available in this context.
const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
try {
  if(API_KEY) {
    ai = new GoogleGenAI({ apiKey: API_KEY });
  }
} catch (e) {
  console.error("Failed to initialize GoogleGenAI. API_KEY might be missing.", e);
}

const generateMockResponse = (text: string) => new Promise<string>((resolve) => setTimeout(() => resolve(text), 1500));

export const getCareerAdvice = async (cvFile: File | null, userMessage: string, userProfile: User): Promise<string> => {
  if (!ai) {
    console.warn("Gemini AI not initialized. Using mock response.");
    return generateMockResponse(`**Mock Response:**\n\nHello ${userProfile.name}! Based on your interest in **${userProfile.desiredJob}** and your message, here are some suggestions:\n\n*   **Focus on Core Skills:** For a ${userProfile.desiredJob}, it's crucial to master skills like AI/ML Fundamentals, Python, and data structures. Your profile shows you're already skilled in ${userProfile.currentSkills?.join(', ')}, which is a great start.\n*   **CV Improvement:** Add a project section to your CV. If you uploaded one, I would suggest making the descriptions more results-oriented (e.g., 'Increased efficiency by 15% using X algorithm').\n*   **Next Steps:** Consider taking a specialized course in Natural Language Processing, as it aligns with your goals.`);
  }

  const cvContent = cvFile ? `The user has uploaded a CV named '${cvFile.name}'. Assume its content is relevant to their profile.` : 'The user has not uploaded a CV.';
  
  const prompt = `You are an expert career coach bot for a platform called I-CAN.
A user named ${userProfile.name} is asking for career advice.
Their current role is: ${userProfile.currentJob || 'Not specified'}.
They want to become a: ${userProfile.desiredJob || 'Not specified'}.
Their current skills are: ${userProfile.currentSkills?.join(', ') || 'Not specified'}.
They want to learn: ${userProfile.desiredSkills?.join(', ') || 'Not specified'}.
${cvContent}

The user's message is: "${userMessage}"

Based on all this information, provide constructive, encouraging, and actionable advice. Address them by their name. Structure your response in markdown format. Give them suggestions for their CV, skills to acquire, and potential career steps.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "I'm sorry, I encountered an error trying to process your request. Please check your connection or API key and try again.";
  }
};

export const findMatchingCandidates = async (hrdProfile: User, allCandidates: User[]): Promise<string> => {
    if (!ai) {
        console.warn("Gemini AI not initialized. Using mock response.");
        return generateMockResponse(`**Mock Response: Top 3 Candidate Matches for ${hrdProfile.company}**\n\n1.  **Brian (ID: 2):** High match (92%). Strong alignment on desired role (AI Engineer) and possesses key skills like AI/ML Fundamentals. He is actively seeking new opportunities.\n2.  **Alice (ID: 4):** Good match (85%). While her current role is different, her desired skills in AI Integration and her goal to switch into the field make her a promising candidate worth talking to.\n3.  **Charlie (ID: 5):** Moderate match (78%). Has a solid software development background and is looking to transition into AI. Would require some upskilling but shows high potential.`);
    }

  const requiredSkills = hrdProfile.requiredSkills?.join(', ') || 'Not specified';
  const budget = `Rp ${hrdProfile.budget?.min.toLocaleString()} - Rp ${hrdProfile.budget?.max.toLocaleString()}`;

  const candidatesJSON = JSON.stringify(allCandidates.map(c => ({
      id: c.id,
      name: c.name,
      desiredJob: c.desiredJob,
      currentSkills: c.currentSkills,
      desiredSkills: c.desiredSkills,
      desiredSalary: c.desiredSalary
  })));

  const prompt = `You are an AI Headhunting assistant for HR professionals on the I-CAN platform.
An HR Manager from ${hrdProfile.company}, is looking for candidates.
Their requirements are:
- Skills needed: ${requiredSkills}
- Salary Budget: ${budget}

Here is a list of available candidates in JSON format:
${candidatesJSON}

Analyze the list of candidates and find the top 3-5 best matches based on the HR manager's required skills and budget.
For each match, provide the candidate's name, a match score (as a percentage), and a brief justification for why they are a good fit.
Present the final output in a clean, readable markdown format.`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
          model: 'gemini-2.5-flash-preview-04-17',
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          }
        });

        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }
        // Assuming the response is well-formed markdown text as requested in the prompt, not JSON
        return response.text;
    } catch (error) {
        console.error("Error calling Gemini API for matchmaking:", error);
        return "I'm sorry, I couldn't find candidates at the moment. Please try again later.";
    }
};
