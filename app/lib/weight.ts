import { GoogleGenAI , Type} from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const prompt = `
This is the image of a weight machine. Can be analog or can be degitial. In digital, simply parse the digital output 
(beware sum times a faint leading zero gives impression of an 8) whilest 
in analog, parse the analog output taking attention to the needle and the weight meter,
 and return the response in the given structured format.
 ALso parse the weight unit if u can see it else default to "kg"
`

export async function parseWeight(file: File) {

  const imageArrayBuffer = await file.arrayBuffer();
  const base64ImageData = Buffer.from(imageArrayBuffer).toString('base64');

  const result = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [
    {
      inlineData: {
        mimeType: 'image/jpeg',
        data: base64ImageData,
      },

    },
    { text: prompt.trim() },
    
  ],
  config: {
      responseMimeType: "application/json",
      responseSchema: {
        
          type: Type.OBJECT,
          properties: {
            weight: {
              type: Type.NUMBER,
            },
            unit: {
              type: Type.STRING,
              default: "kg"
            },
          },
        },
    
    },
  });
  return JSON.parse(result.text ?? '{"weight": 0, "unit":"kg"}');
}