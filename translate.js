export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body || {};
  if (!text || !text.trim()) {
    return res.status(200).json({ translation: '' });
  }

  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'DEEPL_API_KEY is not set on the server.' });
  }

  // Free-tier DeepL keys end in ":fx" and use a different host than Pro keys.
  const isFreeKey = apiKey.trim().endsWith(':fx');
  const url = isFreeKey
    ? 'https://api-free.deepl.com/v2/translate'
    : 'https://api.deepl.com/v2/translate';

  const params = new URLSearchParams();
  params.append('text', text);
  params.append('source_lang', 'EN');
  params.append('target_lang', 'JA');

  try {
    const deeplRes = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params
    });

    const data = await deeplRes.json();

    if (!deeplRes.ok) {
      return res.status(deeplRes.status).json({ error: data.message || 'DeepL API error' });
    }

    const translation = data.translations && data.translations[0] ? data.translations[0].text : '';
    return res.status(200).json({ translation });
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Request to DeepL failed' });
  }
}
