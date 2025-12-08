import Resume from "../models/Resume.js";
import ai from '../config/ai.js'
//function for enhancing professional summary using ai
//POST: /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) {
      return res.status().json({ message: "Missing required field" });
    }
    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are expert in resume writing.Your task is enhance the professional summary of resume.The summary should be 1-2 sentences also heighlighting skills, experience, and career objectives. Make it compelling and ATS-friendly. and only return text no options and anything else.",
        },

        {
          role: "user",
          content: userContent,
        },
      ],
    });
    const enhanceContent = response.choices[0].message.content;
    return res.status(200).json({ enhanceContent });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//function for enhancing job description using ai
//POST: /api/ai/enhance-job-desc

export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body;
    if (!userContent) {
      return res.status().json({ message: "Missing required field" });
    }
    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be only in 1-2 sentence also highlighting key responsibilities and achievements. Use action verbs and quantifiable results where possible. Make it ATS-friendly, and only return text no options or anything else.",
        },

        {
          role: "user",
          content: userContent,
        },
      ],
    });
    const enhancedContent = response.choices[0].message.content;
    return res.status(200).json({ enhancedContent });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//function for uploading resume
// Post: api/ai/uplaod-resume
export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;
    const userId = req.userId;
    if (!resumeText) {
      return res.status(400).json({ message: "Missing required field" });
    }
    const systemPrompt = "You are an AI Agent to extract data from resume";
    const userPrompt = `extract data from this resume: ${resumeText} 
                        provide data in JSON format with no additional text before or after:
                        
                        {
    professional_summary: { type: String, default: "" },
    skills: [{ type: String }],
    personal_info: {
        image: { type: String, default: "" },
        full_name: { type: String, default: "" },
        profession: { type: String, default: "" },
        email: { type: String, default: "" },
        phone: { type: String, default: "" },
        location: { type: String, default: "" },
        linkdein: { type: String, default: "" },
        website: { type: String, default: "" },
  },
  experience: [
    {
      compnay: { type: String },
      position: { type: String },
      start_date: { type: String },
      end_date: { type: String },
      description: { type: String },
      is_current: { type: Boolean },
    },
  ],
  projects: [
    {
      name: { type: String },
      type: { type: String },
      description: { type: String },
    },
  ],
   education: [
    {
      institution: { type: String },
      degree: { type: String },
      field: { type: String },
      graduation: { type: String },
      gpa: { type: String },
    },
  ],
    }`;
    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },

        {
          role: "user",
          content: userPrompt,
        },
      ],
      response_format: { type: "json_object" },
    });
    const extractData = response.choices[0].message.content;
    const parseData = JSON.parse(extractData);
    const newResume = await Resume.create({ userId, title, ...parseData });

    return res.status(200).json({ resumeId: newResume._id });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};


// Add this to your aiController.js

export const improveSections = async (req, res) => {
  try {
    const { resumeId } = req.params;
    const { analysisData } = req.body; // Pass the analysis data from frontend

    const resume = await Resume.findById(resumeId);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    // Prepare sections that need improvement based on analysis
    const sectionsToImprove = [];
    
    // Check which sections have issues
    if (analysisData.sections) {
      analysisData.sections.forEach(section => {
        if (section.score < 90) { // Improve sections scoring below 90
          sectionsToImprove.push({
            name: section.name,
            currentIssue: section.topImprovement
          });
        }
      });
    }

    const prompt = `You are a professional resume writer. Improve the following resume sections based on the issues identified.

IMPORTANT RULES:
1. Return ONLY valid JSON, no markdown, no extra text
2. Keep improvements professional and ATS-friendly
3. Maintain the same structure and format
4. Make specific, actionable improvements
5. Don't add fake information, only enhance existing content
6. Keep the same tone and style

Current Resume Data:
${JSON.stringify({
  professional_summary: resume.professional_summary,
  experience: resume.experience,
  education: resume.education,
  skills: resume.skills,
  project: resume.project
}, null, 2)}

Issues to Fix:
${sectionsToImprove.map(s => `- ${s.name}: ${s.currentIssue}`).join('\n')}

Critical Issues:
${analysisData.criticalIssues?.join('\n') || 'None'}

Return JSON in this exact format:
{
  "improved": {
    "professional_summary": "improved text if needed, otherwise keep original",
    "experience": [/* improved array if needed */],
    "education": [/* improved array if needed */],
    "skills": [/* improved array if needed */],
    "project": [/* improved array if needed */]
  },
  "changes": [
    {
      "section": "Professional Summary",
      "reason": "One line explaining what was improved",
      "hasChanges": true
    }
  ]
}`;

    const completion = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [{ role: "user", content: prompt }],
    });

    const aiOutput = completion?.choices?.[0]?.message?.content || completion?.output_text;
    if (!aiOutput) {
      return res.status(500).json({ message: "AI did not return any data." });
    }

    let improvements;
    try {
      // Clean any markdown formatting
      let cleanOutput = aiOutput.trim();
      cleanOutput = cleanOutput.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      cleanOutput = cleanOutput.trim();
      
      improvements = JSON.parse(cleanOutput);
    } catch (err) {
      console.error("Failed to parse AI response:", aiOutput);
      return res.status(500).json({ 
        message: "Failed to parse AI improvements.",
        debug: aiOutput 
      });
    }

    res.status(200).json({ 
      success: true, 
      improvements,
      originalData: {
        professional_summary: resume.professional_summary,
        experience: resume.experience,
        education: resume.education,
        skills: resume.skills,
        project: resume.project
      }
    });
  } catch (error) {
    console.error("Auto-Fix Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};