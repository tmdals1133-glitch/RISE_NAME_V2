# Kakao Skill on Vercel (Serverless)

## Endpoints
- `GET /api/health`
- `GET/POST /api/sayHello`
- `GET/POST /api/showHello`
- `GET/POST /api/majorCounsel` (uses `data/contacts.json`)

## Deploy (Vercel)
1. Push this folder to GitHub.
2. Import the repo in Vercel → Deploy.
3. Test:
   - https://<your>.vercel.app/api/health
   - https://<your>.vercel.app/api/majorCounsel?RISE_name=AI웹툰애니계열
4. In Kakao Builder, set Skill URL to:
   - https://<your>.vercel.app/api/majorCounsel
   - Test with JSON: { "action": { "params": { "RISE_name": "AI웹툰애니계열" } } }
