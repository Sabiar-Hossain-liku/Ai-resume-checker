const Groq = require("groq-sdk")

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// Models to try in order if one is rate-limited
const MODELS = [
    "llama-3.3-70b-versatile",
    "llama3-70b-8192",
    "mixtral-8x7b-32768",
]

const SYSTEM_PROMPT = `You are an expert career coach and technical interview preparation specialist.

When given a candidate's resume, self-description, and a job description, you analyze the fit and generate a structured interview preparation report.

You MUST respond with ONLY valid JSON. No markdown, no explanation, no code fences — just raw JSON.

The JSON must follow this EXACT structure with these EXACT field names:
{
  "matchScore": <integer 0-100>,
  "technicalQuestions": [
    {
      "question": "<specific technical question based on job/resume>",
      "intention": "<why interviewers ask this question>",
      "answer": "<a strong, detailed sample answer>"
    }
  ],
  "behavioralQuestions": [
    {
      "question": "<STAR-format behavioral question>",
      "intention": "<what the interviewer is evaluating>",
      "answer": "<sample STAR answer using candidate's background>"
    }
  ],
  "skillGaps": [
    {
      "skill": "<skill name>",
      "severity": "<low | medium | high>"
    }
  ],
  "preparationPlan": [
    {
      "day": <day number as integer>,
      "focus": "<focus area for the day>",
      "tasks": ["<task 1>", "<task 2>", "<task 3>"]
    }
  ]
}

CRITICAL RULES — you will be penalized for breaking these:
- "matchScore" must be a number, NOT a string
- "severity" must be EXACTLY one of: "low", "medium", or "high" (lowercase only)
- "day" must be a number, NOT a string
- Include exactly 5 technical questions, 4 behavioral questions, 3-5 skill gaps, and a 7-day preparation plan
- Base all content specifically on the candidate's resume and target job
- Do NOT add any extra fields not listed above`

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const userMessage = `Please analyze this candidate and generate an interview preparation report.

--- RESUME ---
${resume}

--- SELF DESCRIPTION ---
${selfDescription}

--- JOB DESCRIPTION ---
${jobDescription}

Return the JSON report now.`

    let lastError = null

    for (const model of MODELS) {
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                console.log(`Trying Groq model: ${model} (attempt ${attempt})`)

                const completion = await groq.chat.completions.create({
                    model,
                    messages: [
                        { role: "system", content: SYSTEM_PROMPT },
                        { role: "user", content: userMessage },
                    ],
                    response_format: { type: "json_object" },
                    temperature: 0.7,
                    max_tokens: 4096,
                })

                const text = completion.choices[0]?.message?.content
                if (!text) throw new Error("Empty response from Groq")

                const parsed = JSON.parse(text)
                console.log(`✓ Success with model: ${model}`)
                return parsed

            } catch (err) {
                lastError = err
                const status = err?.status || err?.error?.status_code

                // 429 = rate limited — wait and retry on same model
                if (status === 429) {
                    if (attempt < 3) {
                        const delay = attempt * 3000
                        console.warn(`Rate limited on ${model}, retrying in ${delay}ms...`)
                        await sleep(delay)
                        continue
                    }
                    console.warn(`Rate limit exhausted on ${model}, trying next model...`)
                    break
                }

                // Other errors — try next model immediately
                console.warn(`Model ${model} failed: ${err.message?.slice(0, 100)}`)
                break
            }
        }
    }

    // All models failed
    const status = lastError?.status || lastError?.error?.status_code
    if (status === 429) {
        const err = new Error("All Groq models are rate limited. Please wait a moment and try again.")
        err.status = 429
        throw err
    }

    throw lastError
}

module.exports = generateInterviewReport