/**
 * OpenAI API Configuration
 *
 * Configuration for OpenAI Chat Completions API integration
 */

export const OPENAI_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  apiBase: 'https://api.openai.com/v1',
  model: 'gpt-4-turbo-preview',
  temperature: 0.7,
  maxTokens: 2000,
} as const;

/**
 * Validate OpenAI configuration
 */
export function validateOpenAIConfig(): boolean {
  if (!OPENAI_CONFIG.apiKey) {
    console.error('OpenAI API key not found in environment variables');
    return false;
  }
  return true;
}
