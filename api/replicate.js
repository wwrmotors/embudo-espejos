export default async function handler(req, res) {
  const token = process.env.REPLICATE_API_TOKEN;

  // GET: polling de predicción existente
  if (req.method === 'GET') {
    const { id } = req.query;
    if (!id) return res.status(400).json({ error: 'Missing id' });

    const response = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
      headers: { 'Authorization': `Token ${token}` }
    });
    const data = await response.json();
    return res.status(200).json(data);
  }

  // POST: crear nueva predicción
  if (req.method === 'POST') {
    try {
      const body = req.body;
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      return res.status(200).json(data);
    } catch(err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
