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
