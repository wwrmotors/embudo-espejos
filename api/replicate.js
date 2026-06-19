export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { image } = req.body;

  const response = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-kontext-pro/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
      'Prefer': 'wait'
    },
    body: JSON.stringify({
      input: {
        prompt: "Add a pair of black retractable wing rearview mirrors to the handlebars of this motorcycle. Mirrors should look factory installed, sporty and premium. Do not change anything else in the image.",
        input_image: image,
        output_format: "jpg",
        output_quality: 90,
        safety_tolerance: 5,
        prompt_upsampling: true
      }
    })
  });

  const data = await response.json();
  return res.status(200).json(data);
}
