import OpenAI from "openai";

// 🔹 Initialize OpenAI (optional)
let client = null;

if (process.env.OPENAI_API_KEY) {
  client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// 🔹 Toggle
const USE_OPENAI = false;

// =====================
// MAIN FUNCTION
// =====================
export async function generateStepsFromPrompt(
  prompt,
  data
) {

  console.log(
    "AI Prompt:",
    prompt
  );

  if (!USE_OPENAI) {

    console.log(
      "⚠️ Using SIMULATED AI"
    );

    return simulatedSteps(
      prompt,
      data
    );
  }

  console.log(
    "🚀 Using OPENAI"
  );

  return await openAISteps(
    prompt,
    data
  );
}

// =====================
// OPENAI (future)
// =====================
async function openAISteps(
  prompt,
  data
) {

  const response =
    await client
      .chat
      .completions
      .create({

        model: "gpt-4o-mini",

        messages: [

          {
            role: "system",

            content: `
Return ONLY JSON array.

Allowed actions:
click, fill, select,
assertVisible,
assertRequired
            `,
          },

          {
            role: "user",

            content: `
Instruction:
${prompt}

Data:
${JSON.stringify(data)}
            `,
          }

        ]

      });

  let text =
    response
      .choices[0]
      .message
      .content;

  text =
    text
      .replace(
        /```json|```/g,
        ''
      )
      .trim();

  return JSON.parse(
    text
  );
}

// =====================
// SIMULATED AI
// =====================
function simulatedSteps(
  prompt,
  data
) {

  const p =
    prompt.toLowerCase();

  // =====================
  // LOGIN FLOW
  // =====================
  if (
    p.includes("login")
  ) {

    const steps = [

      {
        action: 'click',
        target: 'loginandsignuplink'
      }

    ];

    // Missing email
    if (
      !data.emailAddress ||
      p.includes(
        "missing email"
      )
    ) {

      steps.push(

        {
          action: 'fill',
          target: 'password',
          value:
            data.password || ''
        },

        {
          action: 'click',
          target: 'loginButton'
        },

        {
          action: 'assertRequired',
          target: 'emaillogin'
        }

      );

      return steps;
    }

    // Missing password
    if (
      !data.password ||
      p.includes(
        "missing password"
      )
    ) {

      steps.push(

        {
          action: 'fill',
          target: 'emaillogin',
          value:
            data.emailAddress
        },

        {
          action: 'click',
          target: 'loginButton'
        },

        {
          action: 'assertRequired',
          target: 'password'
        }

      );

      return steps;
    }

    // Invalid
    if (
      p.includes(
        "invalid"
      )
    ) {

      steps.push(

        {
          action: 'fill',
          target: 'emaillogin',
          value:
            data.emailAddress
        },

        {
          action: 'fill',
          target: 'password',
          value:
            data.password
        },

        {
          action: 'click',
          target: 'loginButton'
        },

        {
          action: 'assertVisible',
          target: 'loginError'
        }

      );

      return steps;
    }

    // Success
    steps.push(

      {
        action: 'fill',
        target: 'emaillogin',
        value:
          data.emailAddress
      },

      {
        action: 'fill',
        target: 'password',
        value:
          data.password
      },

      {
        action: 'click',
        target: 'loginButton'
      },

      {
        action: 'assertVisible',
        target: 'logoutButton'
      }

    );

    return steps;
  }

  // =====================
  // REGISTER FLOW
  // =====================
  if (
    p.includes(
      "register"
    )
  ) {

    const steps = [

      {
        action: 'click',
        target: 'loginandsignuplink'
      },

      {
        action: 'fill',
        target: 'name',
        value: data.name
      },

      {
        action: 'fill',
        target: 'emailAddress',
        value:
          data.emailAddress
      },

      {
        action: 'click',
        target: 'signupButton'
      }

    ];

    // Duplicate email
    if (
      p.includes(
        "existing"
      )
    ) {

      steps.push(

        {
          action: 'assertVisible',
          target:
            'emailAlreadyExists'
        }

      );

      return steps;
    }

    // Success
    steps.push(

      {
        action: 'click',
        target: 'Title'
      },

      {
        action: 'fill',
        target: 'regpassword',
        value:
          data.regpassword
      },

      {
        action: 'select',
        target: 'daydropdown',
        value:
          data.dayValue
      },

      {
        action: 'select',
        target: 'monthdropdown',
        value:
          data.monthValue
      },

      {
        action: 'select',
        target: 'yeardropdown',
        value:
          data.yearValue
      },

      {
        action: 'fill',
        target: 'firstName',
        value:
          data.firstname
      },

      {
        action: 'fill',
        target: 'lastName',
        value:
          data.lastname
      },

      {
        action: 'fill',
        target: 'company',
        value:
          data.company
      },

      {
        action: 'fill',
        target: 'address',
        value:
          data.address
      },

      {
        action: 'select',
        target: 'country',
        value:
          data.country
      },

      {
        action: 'fill',
        target: 'state',
        value:
          data.state
      },

      {
        action: 'fill',
        target: 'city',
        value:
          data.city
      },

      {
        action: 'fill',
        target: 'zipcode',
        value:
          data.zipcode
      },

      {
        action: 'fill',
        target:
          'mobileNumber',
        value:
          data.mobilenumber
      },

      {
        action: 'click',
        target:
          'createButton'
      },

      {
        action: 'assertVisible',
        target:
          'successfullRegistrationMsg'
      }

    );

    return steps;
  }

  throw new Error(
    "Unknown prompt"
  );
}