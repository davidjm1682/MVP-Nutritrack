import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface NutritionAnalysis {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  description: string;
  ingredients: string[];
}

export async function analyzeMealImage(
  imageBase64: string
): Promise<NutritionAnalysis> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analiza esta imagen de comida y proporciona información nutricional estimada.
              Responde SOLO con un objeto JSON válido en este formato exacto:
              {
                "calories": número,
                "protein": número en gramos,
                "carbs": número en gramos,
                "fats": número en gramos,
                "fiber": número en gramos,
                "description": "descripción breve del plato",
                "ingredients": ["ingrediente1", "ingrediente2", ...]
              }
              No agregues texto adicional, solo el JSON.`,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response');
    }

    const analysis = JSON.parse(jsonMatch[0]);
    return analysis;
  } catch (error) {
    console.error('Error analyzing meal:', error);
    // Return default values if analysis fails
    return {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      fiber: 0,
      description: 'No se pudo analizar la imagen',
      ingredients: [],
    };
  }
}
