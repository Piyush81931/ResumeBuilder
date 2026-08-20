export const generateResumeText = data => {
  return `
Full Name: ${data.personal_info?.full_name || ''}
Profession: ${data.personal_info?.profession || ''}
Email: ${data.personal_info?.email || ''}
Phone: ${data.personal_info?.phone || ''}
Location: ${data.personal_info?.location || ''}

Professional Summary:
${data.professional_summary || ''}

Skills:
${data.skills?.join(', ')}

Experience:
${data.experience
  ?.map(
    exp => `
- ${exp.position} at ${exp.company}
  (${exp.start_date} - ${exp.is_current ? 'Present' : exp.end_date})
  ${exp.description}
`
  )
  .join('\n')}

Projects:
${data.project
  ?.map(
    p => `
- ${p.name} (${p.type})
  ${p.description}
`
  )
  .join('\n')}

Education:
${data.education
  ?.map(
    edu => `
- ${edu.degree} in ${edu.field}
  ${edu.institution} (${edu.graduation})
  GPA: ${edu.gpa}
`
  )
  .join('\n')}
`
}
