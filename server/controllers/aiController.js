import Resume from '../models/Resume.js'
import ai from '../config/ai.js'
//function for enhancing professional summary using ai
//POST: /api/ai/enhance-pro-sum
export const enhanceProfessionalSummary = async (req, res) => {
  try {
    const { userContent } = req.body
    if (!userContent) {
      return res.status().json({ message: 'Missing required field' })
    }
    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You are expert in resume writing.Your task is enhance the professional summary of resume.The summary should be 1-2 sentences also heighlighting skills, experience, and career objectives. Make it compelling and ATS-friendly. and only return text no options and anything else.'
        },

        {
          role: 'user',
          content: userContent
        }
      ]
    })
    const enhanceContent = response.choices[0].message.content
    return res.status(200).json({ enhanceContent })
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

//function for enhancing job description using ai
//POST: /api/ai/enhance-job-desc

export const enhanceJobDescription = async (req, res) => {
  try {
    const { userContent } = req.body
    if (!userContent) {
      return res.status().json({ message: 'Missing required field' })
    }
    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: 'system',
          content:
            'You are an expert in resume writing. Your task is to enhance the job description of a resume. The job description should be only in 1-2 sentence also highlighting key responsibilities and achievements. Use action verbs and quantifiable results where possible. Make it ATS-friendly, and only return text no options or anything else.'
        },

        {
          role: 'user',
          content: userContent
        }
      ]
    })
    const enhancedContent = response.choices[0].message.content
    return res.status(200).json({ enhancedContent })
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

//function for uploading resume
// Post: api/ai/uplaod-resume
export const uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body
    const userId = req.userId
    if (!resumeText) {
      return res.status(400).json({ message: 'Missing required field' })
    }
    const systemPrompt = 'You are an AI Agent to extract data from resume'
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
        linkedin: { type: String, default: "" },
        website: { type: String, default: "" },
  },
  experience: [
    {
      company: { type: String },
      position: { type: String },
      start_date: { type: String },
      end_date: { type: String },
      description: { type: String },
      is_current: { type: Boolean },
    },
  ],
  project: [
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
    }`
    const response = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },

        {
          role: 'user',
          content: userPrompt
        }
      ],
      response_format: { type: 'json_object' }
    })
    const extractData = response.choices[0].message.content
    const parseData = JSON.parse(extractData)
    const newResume = await Resume.create({ userId, title, ...parseData })

    return res.status(200).json({ resumeId: newResume._id })
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
}

// Add this to your aiController.js

export const improveSections = async (req, res) => {
  try {
    const { resumeId } = req.params
    const { analysisData } = req.body // Pass the analysis data from frontend

    const resume = await Resume.findById(resumeId)
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' })
    }

    // Prepare sections that need improvement based on analysis
    const sectionsToImprove = []

    // Check which sections have issues
    if (analysisData.sections) {
      analysisData.sections.forEach(section => {
        if (section.score < 90) {
          // Improve sections scoring below 90
          sectionsToImprove.push({
            name: section.name,
            currentIssue: section.topImprovement
          })
        }
      })
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
${JSON.stringify(
  {
    professional_summary: resume.professional_summary,
    experience: resume.experience,
    education: resume.education,
    skills: resume.skills,
    project: resume.project
  },
  null,
  2
)}

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
}`

    const completion = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [{ role: 'user', content: prompt }]
    })

    const aiOutput =
      completion?.choices?.[0]?.message?.content || completion?.output_text
    if (!aiOutput) {
      return res.status(500).json({ message: 'AI did not return any data.' })
    }

    let improvements
    try {
      // Clean any markdown formatting
      let cleanOutput = aiOutput.trim()
      cleanOutput = cleanOutput
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
      cleanOutput = cleanOutput.trim()

      improvements = JSON.parse(cleanOutput)
    } catch (err) {
      console.error('Failed to parse AI response:', aiOutput)
      return res.status(500).json({
        message: 'Failed to parse AI improvements.',
        debug: aiOutput
      })
    }

    res.status(200).json({
      success: true,
      improvements: {
        improved: improvements.improved,
        changes: improvements.changes
      },
      originalData: {
        full_name: resume.full_name,
        profession: resume.profession,
        email: resume.email,
        phone: resume.phone,
        location: resume.location,
        professional_summary: resume.professional_summary,
        experience: resume.experience,
        education: resume.education,
        skills: resume.skills,
        project: resume.project
      }
    })
  } catch (error) {
    console.error('Auto-Fix Error:', error.message)
    res.status(500).json({ message: error.message })
  }
}
// Add this to your aiController.js

export const analyzeJobMatch = async (req, res) => {
  try {
    const { resumeId } = req.params
    const { jobDescription } = req.body

    if (!jobDescription || jobDescription.trim().length < 50) {
      return res.status(400).json({
        message:
          'Please provide a valid job description (at least 50 characters)'
      })
    }

    const resume = await Resume.findById(resumeId)
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' })
    }

    // Prepare resume data for AI
    const resumeText = `
Professional Summary: ${resume.professional_summary || 'Not provided'}

Experience:
${
  resume.experience
    ?.map(
      exp => `
- ${exp.position} at ${exp.company} (${exp.start_date} - ${
        exp.end_date || 'Present'
      })
  ${exp.description || ''}
`
    )
    .join('\n') || 'No experience listed'
}

Education:
${
  resume.education
    ?.map(
      edu => `
- ${edu.degree} in ${edu.field} from ${edu.institution} (${edu.graduation_year})
`
    )
    .join('\n') || 'No education listed'
}

Skills:
${resume.skills?.join(', ') || 'No skills listed'}

Projects:
${
  resume.project
    ?.map(
      proj => `
- ${proj.title}: ${proj.description}
  Technologies: ${proj.technologies}
`
    )
    .join('\n') || 'No projects listed'
}
    `.trim()

    console.log('Analyzing job match for resume:', resumeId)

    const prompt = `You are an expert resume analyzer and ATS specialist. Analyze how well this resume matches the job description.

CRITICAL: Return ONLY valid JSON, no markdown, no extra text, no code blocks.

Job Description:
${jobDescription}

Resume:
${resumeText}

Analyze and return this EXACT JSON structure:
{
  "matchScore": 75,
  "strongMatches": [
    {
      "skill": "React",
      "evidence": "3 years experience mentioned in resume",
      "relevance": "Required skill in job description"
    }
  ],
  "weakMatches": [
    {
      "skill": "Communication",
      "issue": "Mentioned only once in resume",
      "suggestion": "Add examples of cross-functional collaboration"
    }
  ],
  "missingSkills": [
    {
      "skill": "AWS",
      "priority": "CRITICAL",
      "question": "Do you have AWS experience?"
    }
  ],
  "missingKeywords": [
    "scalable",
    "cross-functional",
    "maintainable"
  ],
  "tailoredSections": {
    "professional_summary": "Enhanced summary with job keywords...",
    "experience": [
      {
        "position": "Same as original",
        "company": "Same as original",
        "start_date": "Same as original",
        "end_date": "Same as original",
        "description": "Enhanced description with job-specific keywords and achievements"
      }
    ],
    "skills": ["Enhanced skills list with relevant keywords"]
  },
  "improvementTips": [
    "Add quantifiable metrics to achievements",
    "Use action verbs from job description"
  ],
  "newMatchScore": 92
}

Rules:
1. matchScore = 0-100 based on how well resume matches job
2. strongMatches = skills/experience user has that match job (list top 5)
3. weakMatches = things mentioned but need emphasis (max 3)
4. missingSkills = required skills not in resume (max 5, prioritize)
5. missingKeywords = ATS keywords missing from resume (max 8)
6. tailoredSections = improved versions using job keywords naturally
7. newMatchScore = projected score after applying tailored content
8. Keep all tailoring professional and truthful - enhance, don't fabricate
9. Maintain original data structure for experience and education
10. Only enhance descriptions and summaries with relevant keywords`

    const completion = await ai.chat.completions.create({
      model: process.env.OPENAI_MODEL,
      messages: [{ role: 'user', content: prompt }]
    })

    const aiOutput =
      completion?.choices?.[0]?.message?.content || completion?.output_text
    if (!aiOutput) {
      return res.status(500).json({ message: 'AI did not return any data.' })
    }

    let analysis
    try {
      let cleanOutput = aiOutput.trim()
      cleanOutput = cleanOutput
        .replace(/```json\s*/g, '')
        .replace(/```\s*/g, '')
      cleanOutput = cleanOutput.trim()

      analysis = JSON.parse(cleanOutput)
    } catch (err) {
      console.error('Failed to parse AI response:', aiOutput)
      return res.status(500).json({
        message: 'Failed to parse AI analysis.',
        debug: aiOutput
      })
    }

    // Save the job match analysis
    const jobMatch = {
      jobDescription,
      analysis,
      createdAt: new Date()
    }

    res.status(200).json({
      success: true,
      analysis,
      originalResume: {
        professional_summary: resume.professional_summary,
        experience: resume.experience,
        education: resume.education,
        skills: resume.skills,
        project: resume.project
      }
    })
  } catch (error) {
    console.error('Job Match Analysis Error:', error.message)
    res.status(500).json({ message: error.message })
  }
}
