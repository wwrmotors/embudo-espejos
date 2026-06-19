export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body;

    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    // Si viene con Prefer: wait, puede que ya tenga output
    if (data.output) {
      return res.status(200).json(data);
    }

    // Polling hasta que termine
    if (data.id) {
      for (let i = 0; i < 40; i++) {
        await new Promise(r => setTimeout(r, 2000));
        const poll = await fetch(`https://api.replicate.com/v1/predictions/${data.id}`, {
          headers: { 'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}` }
        });
        const pollData = await poll.json();
        if (pollData.status === 'succeeded') {
          return res.status(200).json(pollData);
        }
        if (pollData.status === 'failed') {
          return res.status(500).json({ error: 'IA falló', detail: pollData.error });
        }
      }
      return res.status(500).json({ error: 'Timeout' });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error('Replicate error:', err);
    return res.status(500).json({ error: err.message });
  }
}
