import { useState } from 'react'

export default function App() {
  const [idea, setIdea] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const generate = () => {
    if (!idea.trim()) return
    setLoading(true)
    setTimeout(() => {
      setResult(`🎬 فكرة الفيديو: ${idea}\n\n1. هوك قوي (أول 3 ثواني):\n"تخيل لو صار معك هذا الشي..."\n\n2. القصة:\nتبدأ القصة مع ${idea}، وتصير أحداث غير متوقعة تخلي المشاهد يكمل للنهاية.\n\n3. النهاية + CTA:\n"اكتب في التعليقات وش بتسوي لو كنت مكاني؟ وتابعني للجزء الثاني!"\n\n#تيك_توك #قصص #استوديو_سامر`)
      setLoading(false)
    }, 800)
  }

  return (
    <div dir="rtl" style={{ minHeight: '100vh', background: '#0a0a0a', color: 'white', padding: 20, fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', fontSize: 28, fontWeight: 'bold' }}>🎬 استوديو سامر - TikTok</h1>
        <p style={{ textAlign: 'center', color: '#aaa' }}>اكتب فكرة، ونحولها لك لسيناريو جاهز</p>

        <textarea
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="مثال: واحد لقى جوال غريب في الشارع..."
          style={{ width: '100%', height: 100, borderRadius: 12, padding: 12, background: '#1a1a1a', color: 'white', border: '1px solid #333', marginTop: 20, fontSize: 16 }}
        />

        <button onClick={generate} style={{ width: '100%', padding: 14, borderRadius: 12, background: '#ff0050', color: 'white', fontWeight: 'bold', fontSize: 18, border: 'none', marginTop: 12, cursor: 'pointer' }}>
          {loading ? 'جاري التوليد...' : '✨ ولّد السيناريو'}
        </button>

        {result && (
          <div style={{ background: '#1a1a1a', padding: 16, borderRadius: 12, marginTop: 16, whiteSpace: 'pre-line', lineHeight: 1.8, border: '1px solid #333' }}>
            {result}
            <button onClick={() => navigator.clipboard.writeText(result)} style={{ width: '100%', padding: 10, marginTop: 12, borderRadius: 8, background: 'white', color: 'black', fontWeight: 'bold', border: 'none' }}>
              📋 نسخ السيناريو
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
