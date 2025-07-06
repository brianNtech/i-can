import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { User, Job, Certification, Recommendation } from '../types';

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

export const getMatchmakingRecommendations = async (user: User, allJobs: Job[], allCerts: Certification[]): Promise<Recommendation[]> => {
    if (!ai) {
        console.warn("Gemini AI not initialized. Using mock recommendations.");
        const job1 = allJobs.find(j => j.title === 'Data Scientist');
        const cert1 = allCerts.find(c => c.title === 'Certified Cloud Practitioner');
        const job2 = allJobs.find(j => j.id === 2); // Frontend Developer
        const cert2 = allCerts.find(c => c.title === 'Google Project Management');

        const recommendations: Recommendation[] = [];
        if(job1) recommendations.push({ type: 'job', reason: "Your interest in AI makes this Data Scientist role a fantastic stepping stone. It builds on analytical skills and gets you closer to machine learning projects.", details: job1 });
        if(cert1) recommendations.push({ type: 'certification', reason: "Cloud skills are non-negotiable for AI. This AWS cert is the perfect, industry-recognized starting point for you.", details: cert1 });
        if(job2) recommendations.push({ type: 'job', reason: "Leverage your software development skills in a high-demand frontend role while you continue learning AI on the side.", details: job2 });
        if(cert2) recommendations.push({ type: 'certification', reason: "As you grow, you'll lead projects. This certification gives you the structured approach top companies look for.", details: cert2 });
        
        return recommendations;
    }

    const simplifiedJobs = allJobs.map(j => ({ id: j.id, title: j.title, description: j.description.slice(0,2), location: j.location }));
    const simplifiedCerts = allCerts.map(c => ({ id: c.id, title: c.title, description: c.description }));

    const prompt = `You are an AI Career Matchmaker for the I-CAN platform. A user with the following profile is looking for recommendations:
- Name: ${user.name}
- Current Job: ${user.currentJob || 'Not specified'}
- Desired Job: ${user.desiredJob || 'Not specified'}
- Current Skills: ${user.currentSkills?.join(', ') || 'Not specified'}
- Desired Skills: ${user.desiredSkills?.join(', ') || 'Not specified'}

Here are the available jobs:
${JSON.stringify(simplifiedJobs)}

Here are the available certifications:
${JSON.stringify(simplifiedCerts)}

Analyze the user's profile and recommend a mixed list of up to 10 relevant jobs and certifications that would best help them achieve their career goals. For each recommendation, provide a short, encouraging reason (under 25 words) why it's a good match.

Return your response as a JSON array of objects. Each object must have the following structure:
{
  "id": <number>,
  "type": <"job" | "certification">,
  "reason": "<string>"
}
Do not include any items that are not a good match. The list should be ordered from most to least relevant.`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            },
        });

        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }
        
        const geminiRecs: {id: number; type: 'job' | 'certification'; reason: string}[] = JSON.parse(jsonStr);

        const recommendations: Recommendation[] = geminiRecs.map(rec => {
            if (rec.type === 'job') {
                const jobDetails = allJobs.find(j => j.id === rec.id);
                if (!jobDetails) return null;
                return { type: 'job', reason: rec.reason, details: jobDetails };
            } else { // certification
                const certDetails = allCerts.find(c => c.id === rec.id);
                if (!certDetails) return null;
                return { type: 'certification', reason: rec.reason, details: certDetails };
            }
        }).filter((r): r is Recommendation => r !== null);
        
        return recommendations;
    } catch (error) {
        console.error("Error calling Gemini API for recommendations:", error);
        return []; // Return empty array on error to prevent crashes
    }
};