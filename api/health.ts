export default function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    status: 'online',
    agent: 'JARVIS AI',
    protocol: 'SAADA Reserve Protocol v2.5',
    platform: 'Vercel Serverless',
    timestamp: new Date().toISOString(),
  });
}
