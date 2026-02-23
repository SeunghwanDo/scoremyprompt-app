# ScoreMyPrompt — Grade Your AI Prompt in 30 Seconds

ScoreMyPrompt is a web application that analyzes AI prompts using the PROMPT framework and provides detailed scores and feedback. Users can get their PROMPT Score and compare with professionals in their field.

## Features

- **PROMPT Score Analysis**: Comprehensive evaluation using 6 dimensions (Precision, Relevance, Organization, Methodology, Personalization, Timeframe)
- **Job Role-Specific Analysis**: Tailored feedback based on professional context (Marketing, Design, Product, Finance, Freelance, Other)
- **Benchmark Comparison**: See how your prompt compares with other professionals
- **Dark Theme UI**: Modern, sleek interface built with Tailwind CSS
- **Fast Analysis**: Get results in seconds
- **Share Results**: Easily share your score with others
- **No Signup Required**: Completely free to use

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI**: Anthropic Claude API (for prompt analysis)
- **Styling**: Tailwind CSS with custom dark theme
- **OG Images**: Vercel OG for social sharing

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Anthropic API key (get one at https://console.anthropic.com)

### Installation

1. Clone the repository or navigate to the project directory:

```bash
cd scoremyprompt-app
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Add your Anthropic API key to `.env.local`:

```env
ANTHROPIC_API_KEY=your_api_key_here
```

### Running the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
scoremyprompt-app/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.js          # API endpoint for prompt analysis
│   ├── result/
│   │   └── page.js               # Results page with scores and feedback
│   ├── layout.js                 # Root layout with metadata
│   ├── page.js                   # Landing page
│   └── globals.css               # Global styles and animations
├── package.json                  # Project dependencies
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
├── .env.example                  # Example environment variables
└── README.md                     # This file
```

## API Endpoints

### POST /api/analyze

Analyzes a prompt and returns a PROMPT Score.

**Request:**
```json
{
  "prompt": "Your prompt text here",
  "jobRole": "Marketing"
}
```

**Response:**
```json
{
  "overallScore": 76,
  "dimensions": {
    "precision": { "score": 82, "feedback": "..." },
    "relevance": { "score": 78, "feedback": "..." },
    "organization": { "score": 74, "feedback": "..." },
    "methodology": { "score": 72, "feedback": "..." },
    "personalization": { "score": 76, "feedback": "..." },
    "timeframe": { "score": 72, "feedback": "..." }
  },
  "strengths": [...],
  "improvements": [...],
  "scoreLevel": "Great",
  "suggestions": "...",
  "benchmarks": {
    "average": 68,
    "excellent": 85,
    "percentile": 72
  }
}
```

## PROMPT Framework

The PROMPT framework evaluates prompts on 6 key dimensions:

1. **Precision (P)**: How clear and specific are the objectives?
2. **Relevance (R)**: How well-targeted is the prompt to its purpose?
3. **Organization (O)**: How well-structured and logical is the prompt?
4. **Methodology (M)**: Does it specify a clear approach or methodology?
5. **Personalization (P)**: Is it tailored to context and audience?
6. **Timeframe (T)**: Are timeline and deliverables clear?

Each dimension is scored from 0-100, with the overall score being an average of all dimensions.

## Customization

### Colors

The dark theme colors are defined in `tailwind.config.js`:

- Primary Blue: `#3b82f6`
- Accent Purple: `#8b5cf6`
- Background Dark: `#0a0f1a`
- Surface: `#0f172a`
- Border: `#1e293b`

To modify these, update the color values in `tailwind.config.js`.

### Job Roles

Job roles can be modified in `app/page.js`:

```javascript
const JOB_ROLES = ['Marketing', 'Design', 'Product', 'Finance', 'Freelance', 'Other'];
```

### Example Prompts

Add or modify example prompts in the `EXAMPLE_PROMPTS` array in `app/page.js`.

## Integrating Claude API

The API endpoint at `/api/analyze/route.js` includes a TODO comment for integrating the Anthropic Claude API. To implement:

1. Install the Anthropic SDK:

```bash
npm install @anthropic-ai/sdk
```

2. Update the route.js file with the actual API call:

```javascript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// In the POST handler, replace the mock result with:
const message = await anthropic.messages.create({
  model: 'claude-3-5-sonnet-20241022',
  max_tokens: 1024,
  system: PROMPT_SCORE_SYSTEM,
  messages: [
    {
      role: 'user',
      content: `Analyze this prompt from a ${jobRole} professional:\n\n${prompt}`,
    },
  ],
});

const result = JSON.parse(message.content[0].text);
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t scoremyprompt .
docker run -p 3000:3000 -e ANTHROPIC_API_KEY=your_key scoremyprompt
```

## Performance Optimization

- Uses Next.js App Router for better performance
- Tailwind CSS for optimized styling
- Server components where possible
- Client components only where necessary

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues.

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or feedback, please reach out to the ScoreMyPrompt team.

## Roadmap

- User accounts and prompt history
- Advanced filters and sorting
- Prompt templates library
- Team collaboration features
- API for third-party integration
- PromptTribe community platform

---

Built with ❤️ for prompt engineers everywhere.
