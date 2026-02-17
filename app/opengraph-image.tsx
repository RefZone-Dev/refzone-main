import { ImageResponse } from 'next/og'

export const alt = 'RefZone - AI-Powered Football Referee Training'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(135deg, #9114af 0%, #ff5eb8 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
          <span style={{ fontSize: 96, fontWeight: 'bold' }}>RefZone</span>
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 500,
            textAlign: 'center',
            maxWidth: '80%',
            opacity: 0.95,
          }}
        >
          AI-Powered Football Referee Training
        </div>
        <div
          style={{
            fontSize: 28,
            marginTop: 30,
            opacity: 0.9,
            display: 'flex',
            gap: 40,
          }}
        >
          <span>500+ Quizzes</span>
          <span>•</span>
          <span>100+ Scenarios</span>
          <span>•</span>
          <span>24/7 AI Assistant</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
