import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import { Terminal, ShieldCheck, AlertCircle, ChevronDown, ChevronUp, Download } from 'lucide-react'

interface Challenge {
  id: number
  title: string
  description: string
  points: number
  downloadUrl?: string
  downloadName?: string
}

const CHALLENGES: Record<string, Challenge[]> = {
  krypton: [
   {
      id: 1,
      title: 'Krypton I — Layered Transmission',
      description: `VOID's message was encrypted in three layers. Work backwards to decrypt it.

Ciphertext:
fUN1MlN4V3Q3ZVJ7TlBaVllsR30=

1. Caesar shift (key = 7) was applied first
2. Then the string was reversed
3. Then Base64 encoded

Find the flag.`,
      points: 50,
    },
    {
      id: 2,
      title: 'Krypton II — Fractured Primes',
      description: `VOID encrypted a secret using RSA — but they made a critical mistake. They used dangerously small prime numbers.

Public Key:
n = 3233
e = 17

Ciphertext (list of integers):
[1107, 368, 529, 690, 119, 612, 2412, 2906, 2271, 368, 1230, 119, 1369, 529, 281, 884, 624, 2412, 368, 1773]

Factor n, compute the private key d, and decrypt the message character by character.`,
      points: 50,
    },
    {
      id: 3,
      title: 'Krypton III — The Layered Signal',
      description: `VOID layered their encryption three times, thinking it would be unbreakable. Peel back each layer to reveal the transmission.

Encoded message:
d3d31566b6e444a577d423d4b693c636a7b684e4379365d40387754647473325a4e413453565b675

Instructions:
1. Reverse the string
2. Decode from Hex
3. Decode from Base64`,
      points: 50,
    },
  ],
  phantom: [
    {
      id: 4,
      title: 'Phantom I — Ghost in the Telescope',
      description: `VOID disguised a transmission inside a fake telescope image broadcast across the Phantom system.

The signal is hidden using LSB (Least Significant Bit) steganography. A passphrase was used during encoding.

Download the image and extract what's hidden.

Passphrase hint: The name of this galaxy operation — one word, all lowercase.`,
      points: 50,
      downloadUrl: 'http://localhost:8000/files/krypton_signal.png',
      downloadName: 'phantom_telescope.png',
    },
    {
      id: 5,
      title: 'Phantom II — The Silent Frequency',
      description: `VOID transmitted a secret signal disguised as background cosmic noise. Our receivers picked up this WAV file from the Phantom system.

It sounds like static — but nothing in deep space is ever just noise.

Download the audio file and analyze it. The flag is hidden in the least significant bits of the audio samples.`,
      points: 50,
      downloadUrl: 'http://localhost:8000/files/phantom_signal.wav',
      downloadName: 'phantom_signal.wav',
    },
    {
      id: 6,
      title: 'Phantom III — Dead Starlight',
      description: `VOID's telescope captured this image from deep space — but our forensics team suspects something was embedded in the file itself, not the pixels.

Sometimes the most sensitive data hides in plain sight — in the file's own metadata.

Download the image and inspect its EXIF data.

Tools that may help: exiftool, Python PIL/piexif, or any online EXIF viewer.`,
      points: 50,
      downloadUrl: 'http://localhost:8000/files/phantom_metadata.jpg',
      downloadName: 'phantom_metadata.jpg',
    },
  ],
  oracle: [
    {
      id: 7,
      title: "Oracle I — The Operative's Trail",
      description: `A VOID operative codenamed SPECTRE has been leaking intelligence. Our analysts traced their digital footprint to a public profile.

Start here:
https://gist.github.com/Ainab-2601/9ea763fffc433558dc79ecd1dd9f2706

Follow the trail. The flag is hidden in plain sight — but you'll need to decode it.`,
      points: 100,
    },
    {
      id: 8,
      title: 'Oracle II — Classified Document',
      description: `VOID's intelligence division accidentally leaked a classified transmission log. The document looks clean on the surface — but our forensics team suspects critical information is embedded within the file itself.

Download the document and dig deeper than the visible text.

Tools that may help: exiftool, pdfinfo, Python PyPDF2, or any online PDF metadata viewer.`,
      points: 100,
      downloadUrl: 'http://localhost:8000/files/oracle_classified.pdf',
      downloadName: 'oracle_classified.pdf',
    },
    {
      id: 9,
      title: 'Oracle III — The Last Known Location',
      description: `A VOID operative was last seen transmitting from a remote mountain location. We intercepted this image from their device before the signal went dark.

Your mission: Identify the exact location shown in the image using reverse image search and geolocation techniques.

The flag format is: ZEROSIG{cityname_latN_lonE}
- Replace dots with underscores
- City name in leet speak (a→4, e→3, i→1, o→0)
- Coordinates rounded to 4 decimal places

Hint: The operative fled to the mountains of northern Pakistan.`,
      points: 100,
      downloadUrl: 'http://localhost:8000/files/skardu.jpg',
      downloadName: 'skardu.jpg',
    },
  ],
  nebula: [
    {
      id: 10,
      title: 'Nebula I — Unauthorized Entry',
      description: `VOID's Nebula sector control panel has been located. Our intelligence suggests the authentication system was built hastily — and sloppily.

The panel is running at:
http://ADMIN_IP:5000

Your objective: Gain admin access to the control panel and retrieve the classified signal.

No credentials have been provided. You'll need to find another way in.`,
      points: 100,
    },
    {
      id: 11,
      title: 'Nebula II — Hidden Vault',
      description: `The VOID Archive claims to host only public records — but every server has secrets it forgets to hide properly.

Explore the site. Check what the robots don't want you to see, and what the frontend code might be whispering to itself.

Target: http://localhost:5001`,
      points: 100,
    },
    {
      id: 12,
      title: 'Nebula III — Silent Diagnostics',
      description: `VOID's network diagnostics console lets you ping any host — but their security team was in a hurry and only blocked the "obvious" characters.

Sometimes the most dangerous tool is the one you forgot to lock.

Target: http://localhost:5002

Note: This challenge requires sending a raw HTTP POST request — the web form won't let you type what you need. Use curl, Postman, or a script.`,
      points: 100,
    },
  ],
  axiom: [
    {
      id: 13,
      title: 'Axiom I — Corrupted Transmission',
      description: `VOID intercepted this image transmission — but the file arrived damaged. It won't open in any standard viewer.

Sometimes files aren't broken by accident. Look at the raw bytes and compare against what a valid file structure should look like.

Download the file and inspect it in a hex editor.

Tools that may help: HxD (Windows), xxd, or any hex editor.`,
      points: 100,
      downloadUrl: 'http://localhost:8000/files/transmission_corrupted.png',
      downloadName: 'transmission_corrupted.png',
    },
    {
      id: 14,
      title: 'Axiom II — The Keygen',
      description: `VOID's activation system requires a valid serial to unlock. We intercepted the program file — but it's protecting its own logic somehow.

Figure out how the file hides its real code, extract the validation logic, and derive a serial that passes the check.

Run the file with: python void_activation.py`,
      points: 150,
      downloadUrl: 'http://localhost:4000/files/void_activation.py',
      downloadName: 'void_activation.py',
    },
    {
      id: 15,
      title: 'Axiom III — The Deep Vault',
      description: `VOID's final archive lock intercepted a fragment of an internal transmission — possibly the vault key, encoded before transmission failure:

gu3_i01q_a3i3e_fy33cf

We also recovered the lock program itself, but its validation logic is not straightforward — reverse it carefully.

Run the file with: python void_lock.py`,
      points: 150,
      downloadUrl: 'http://localhost:4000/files/void_lock.py',
      downloadName: 'void_lock.py',
    },
  ],
  'void-core': [
    {
      id: 16,
      title: 'Void Core — The Convergence',
      description: `This is it — the final barrier. VOID's core systems require three fragments to align before the vault opens.

FRAGMENT I — Intercepted Transmission (hex, single-byte XOR):
35393b343f38333256373535332525563d332f4c560c4504462905471118421a29031847024512

FRAGMENT II — A visual transmission was captured. Something is embedded within it beyond what the eye can see.

FRAGMENT III — Once you recover the hidden program, it will not open easily. Its logic must be understood, not guessed.

Combine what you find. The key that decodes the first fragment is the same key the final lock demands.

Download the image below to begin Fragment II.`,
      points: 300,
      downloadUrl: 'http://localhost:4000/files/void_core_transmission.png',
      downloadName: 'void_core_transmission.png',
    },
  ],
  'the-summit': [
    {
      id: 17,
      title: 'The Summit — Broken Authority',
      description: `The final transmission has cut. One node remains — THE SUMMIT — guarded by four independent, differently-broken subsystems.

Target: http://SUMMIT_SERVER_IP:5003

Break any subsystem to seize control. Whoever captures dethrones the current holder instantly. But that subsystem won't work twice in a row — once used, find a different weakness to recapture. Only after all four have been used does the cycle reset.

Hold The Summit and earn +20 points every 60 seconds — for as long as you can defend it.`,
      points: 0,
    },
  ],
}

export const ChallengePanel: React.FC<{ activePlanetId: string }> = ({ activePlanetId }) => {
  const currentTeamId = useStore((state) => state.currentTeamId)
  const planets = useStore((state) => state.planets)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [flags, setFlags] = useState<Record<number, string>>({})
  const [statuses, setStatuses] = useState<Record<number, { type: string; message: string }>>({})
  const [loading, setLoading] = useState<Record<number, boolean>>({})

  const activePlanet = planets[activePlanetId]
  const challenges = CHALLENGES[activePlanetId] || []

  const submitFlag = async (challengeId: number, planetId: string) => {
    const flag = flags[challengeId]
    if (!flag || !currentTeamId) return

    setLoading(prev => ({ ...prev, [challengeId]: true }))
    setStatuses(prev => ({ ...prev, [challengeId]: { type: 'idle', message: '' } }))

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/flags/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teamId: currentTeamId,
          challengeId,
          planetId,
          flag: flag.trim(),
        }),
      })

      const data = await res.json()

      if (res.ok && data.correct) {
        setStatuses(prev => ({
          ...prev,
          [challengeId]: {
            type: 'success',
            message: `Flag accepted! +${data.pointsAwarded} PTS${data.firstBlood ? ' 🩸 FIRST BLOOD +25' : ''}`,
          },
        }))
        setFlags(prev => ({ ...prev, [challengeId]: '' }))
      } else {
        setStatuses(prev => ({
          ...prev,
          [challengeId]: {
            type: 'error',
            message: data.message || 'Flag rejected.',
          },
        }))
      }
    } catch {
      setStatuses(prev => ({
        ...prev,
        [challengeId]: { type: 'error', message: 'Transmission drop. Network error.' },
      }))
    } finally {
      setLoading(prev => ({ ...prev, [challengeId]: false }))
    }
  }

  if (!activePlanetId) {
    return (
      <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 text-center font-mono text-xs text-slate-500">
        Select a planet from the galaxy map to view challenges.
      </div>
    )
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 font-mono shadow-xl">
      <div className="flex items-center gap-2 text-slate-300 text-xs uppercase tracking-wider border-b border-slate-800 pb-3 mb-4">
        <Terminal size={14} className="text-emerald-400" />
        <span>Challenges — <span className="text-sky-400 font-bold">{activePlanet?.name}</span></span>
      </div>

      <div className="space-y-3">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="border border-slate-800 rounded-lg overflow-hidden">
            {/* Challenge Header */}
            <button
              onClick={() => setExpandedId(expandedId === challenge.id ? null : challenge.id)}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-900/60 hover:bg-slate-800/60 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 text-xs font-bold">{challenge.points} PTS</span>
                <span className="text-slate-300 text-xs">{challenge.title}</span>
              </div>
              {expandedId === challenge.id
                ? <ChevronUp size={14} className="text-slate-500 flex-shrink-0" />
                : <ChevronDown size={14} className="text-slate-500 flex-shrink-0" />
              }
            </button>

            {/* Challenge Body */}
            {expandedId === challenge.id && (
              <div className="px-4 py-4 bg-black/30 space-y-3">
                <pre className="text-slate-400 text-xs whitespace-pre-wrap leading-relaxed">
                  {challenge.description}
                </pre>

                {challenge.downloadUrl && (
                  <a
                    href={challenge.downloadUrl}
                    download={challenge.downloadName}
                    className="inline-flex items-center gap-2 text-xs text-sky-400 border border-sky-900 px-3 py-1.5 rounded hover:bg-sky-950/30 transition-colors"
                  >
                    <Download size={12} />
                    Download {challenge.downloadName}
                  </a>
                )}

                <div className="space-y-2 pt-1">
                  <input
                    type="text"
                    value={flags[challenge.id] || ''}
                    onChange={(e) => setFlags(prev => ({ ...prev, [challenge.id]: e.target.value }))}
                    placeholder="ZEROSIG{...}"
                    className="w-full bg-black/50 border border-slate-700/80 rounded px-3 py-2 text-xs text-emerald-400 focus:outline-none focus:border-emerald-500 tracking-wide placeholder-slate-600"
                  />
                  <button
                    onClick={() => submitFlag(challenge.id, activePlanetId)}
                    disabled={loading[challenge.id] || !flags[challenge.id]}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 text-slate-100 text-xs font-bold py-2 rounded tracking-widest uppercase transition-all"
                  >
                    {loading[challenge.id] ? 'TRANSMITTING...' : 'INJECT FLAG'}
                  </button>
                </div>

                {statuses[challenge.id]?.type !== 'idle' && statuses[challenge.id]?.message && (
                  <div className={`flex items-start gap-2 p-2.5 rounded text-xs border ${
                    statuses[challenge.id]?.type === 'success'
                      ? 'bg-emerald-950/30 border-emerald-800 text-emerald-400'
                      : 'bg-rose-950/30 border-rose-900/60 text-rose-400'
                  }`}>
                    {statuses[challenge.id]?.type === 'success'
                      ? <ShieldCheck size={14} className="flex-shrink-0 mt-0.5" />
                      : <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
                    }
                    <span>{statuses[challenge.id]?.message}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}