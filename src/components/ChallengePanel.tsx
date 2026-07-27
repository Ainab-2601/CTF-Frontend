import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import { Terminal, ShieldCheck, AlertCircle, ChevronDown, ChevronUp, Download } from 'lucide-react'

interface ChallengeDownload {
  url: string
  name: string
}

interface Challenge {
  id: number
  title: string
  description: string
  points: number
  downloadUrl?: string
  downloadName?: string
  downloads?: ChallengeDownload[]
  hintsCount?: number
}

const BACKEND = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'

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
      title: 'Krypton II — Multi-Layer Encryption',
      description: `Deep space receiver #7 intercepted this binary sequence from VOID's last known coordinates.

00111111 00011001 01010111 00101000 01000010 01100011
00010110 00011100 00101101 00100110 00101101 01100010
00000101 00110011 01001010 00001101 00101000 01011100
00011000

VOID's encryption uses multiple layers:
1. Reversed the byte order
2. Applied XOR with a repeating 3-byte key

Then decrypt the entire message and find the flag.`,
      points: 100,
    },
    {
      id: 3,
      title: 'Krypton III — Scrambled Multi-Layer Encryption',
      description: `VOID uses scrambled nested encryption to hide communications.

We intercepted this final ciphertext:
[2348, 7985, 4594, 2667, 4792, 6927, 566, 3563, 1669, 1519, 9192, 2310, 7504, 2667, 8075, 5141, 4014, 4677, 6341]

Layer 4 (scrambling):
- The ciphertext bytes were shuffled in an unknown order
- You must recover the original sequence

Layer 3 (outer RSA):
- n₃ = 9991

Layer 2 (inner RSA):
- n₂ = 3233

Layer 1 (encoding):
- Unknown single-byte XOR key
- Each byte rotated left by (position mod 8) bits

Find the correct byte order, decrypt both RSA layers, undo the rotation, brute-force the XOR key, and recover VOID's message.`,
      points: 200,
    },
  ],
  phantom: [
    {
      id: 4,
      title: 'Phantom I — RGB LSB Steganography',
      description: `VOID hid a message in the least significant bits of RGB color values.

Each RGB triplet contributes one bit to the message (from the LSB of R, G, or B in sequence).

RGB values (decimal):
(254, 255, 254) (255, 255, 254) (255, 254, 254) (255, 254, 254) (254, 255, 254) (255, 254, 255) (254, 255, 254) (254, 255, 254) (254, 255, 254) (254, 255, 255) (255, 255, 254) (255, 254, 255) (254, 254, 255) (255, 254, 255) (254, 254, 255) (254, 254, 255) (254, 255, 254) (254, 254, 255) (255, 255, 254) (255, 255, 255) (255, 254, 255) (255, 254, 255) (254, 254, 254) (255, 255, 255) (254, 255, 255) (255, 254, 254) (254, 254, 254) (254, 255, 255) (254, 255, 254) (255, 254, 255) (255, 255, 254) (255, 255, 254) (254, 255, 254) (255, 254, 254) (255, 254, 254) (255, 255, 254) (255, 255, 255) (254, 254, 254) (255, 255, 254) (254, 254, 255) (254, 255, 255) (255, 254, 255) (254, 254, 254) (255, 254, 254) (255, 255, 254) (255, 254, 255) (255, 255, 254) (255, 255, 255) (254, 255, 255) (255, 255, 255)`,
      points: 50,
    },
    {
      id: 5,
      title: 'Phantom II — Void Signal',
      description: `An unknown actor has been broadcasting a strange audio transmission over an encrypted channel. Our team managed to intercept two files — but we can't make sense of either of them. The audio sounds like pure static. The binary file is unreadable. Maybe they're connected.

You've intercepted two files from a suspicious transmission:
- void_signal.wav — an audio file that sounds like noise
- encrypted.bin — an encrypted binary file with no obvious format

Neither file makes sense on its own. Figure out how they're related and extract the hidden message.

Flag format: ZEROSIG{...}`,
      points: 100,
      downloads: [
        { url: `${BACKEND}/files/void_signal.wav`, name: 'void_signal.wav' },
        { url: `${BACKEND}/files/encrypted.bin`, name: 'encrypted.bin' },
      ],
      hintsCount: 2,
    },
    {
      id: 6,
      title: 'Phantom III — Dead Drop',
      description: `A ghost operative left behind a dead drop before going silent. Two files. No instructions. No contact. Whatever they hid, they didn't want it found easily. But they wanted it found by the right person.

You've recovered a suspicious archive from a compromised server. Inside are two files — an image and a note. Neither seems to contain anything useful.

But somewhere in this package, a message is waiting.

Find it.`,
      points: 200,
      downloadUrl: `${BACKEND}/files/dead_drop_1.zip`,
      downloadName: 'dead_drop_1.zip',
      hintsCount: 2,
    },
  ],
  oracle: [
    {
      id: 7,
      title: 'Oracle I — Trace Back',
      description: `VOID went dark after sending a single transmission. Our team intercepted it before it disappeared. The message looks like noise — but somewhere in the headers, they left a trace. Find it.

We intercepted a suspicious transmission sent by the operative known as VOID. The raw headers have been captured and preserved.

Analyze the transmission carefully. Not every field is what it seems — but one of them is exactly what you're looking for.`,
      points: 50,
      downloadUrl: `${BACKEND}/files/trace_back.png`,
      downloadName: 'trace_back.png',
      hintsCount: 2,
    },
    {
      id: 8,
      title: 'Oracle II — Phantom Document',
      description: `VOID has been transmitting from across the city — but our analysts believe every signal originates from the same anchor point. The coordinates don't lie. But do they tell the whole truth?

A classified PHANTOM UNIT transmission log has been recovered. It contains 10 intercepted signals, each with embedded coordinates.

All signals cluster around a single city. VOID always returns to the same place.

Find the anchor. The rest will follow.`,
      points: 100,
      downloadUrl: `${BACKEND}/files/phantom_document.pdf`,
      downloadName: 'phantom_document.pdf',
      hintsCount: 3,
    },
    {
      id: 9,
      title: 'Oracle III — Ghost Identity',
      description: `VOID went dark — but not before leaving a trail. A leaked profile. A recovered image. An encrypted transmission. Every piece connects to the next. Find the drop. Decode the message. Track VOID down.

Two files were recovered from a compromised PHANTOM UNIT server:
- contact.txt — a leaked operative profile with a partially recovered transmission
- profile.jpg — a blurry profile image with intact metadata`,
      points: 200,
      downloads: [
        { url: `${BACKEND}/files/contact.txt`, name: 'contact.txt' },
        { url: `${BACKEND}/files/profile.jpg`, name: 'profile.jpg' },
      ],
      hintsCount: 3,
    },
  ],
  nebula: [
    {
      id: 10,
      title: 'Nebula I — Unauthorized Entry',
      description: `VOID's Nebula sector control panel has been located. Our intelligence suggests the authentication system was built hastily — and sloppily.

The panel is running at:
https://nebula-challenges-zerosignalctf.up.railway.app

Your objective: Gain admin access to the control panel and retrieve the classified signal.

No credentials have been provided. You'll need to find another way in.`,
      points: 100,
    },
    {
      id: 11,
      title: 'Nebula II — Hidden Vault',
      description: `The VOID Archive claims to host only public records — but every server has secrets it forgets to hide properly.

Explore the site. Check what the robots don't want you to see, and what the frontend code might be whispering to itself.

Target: https://robust-unity-zerosignalctf.up.railway.app`,
      points: 100,
    },
    {
      id: 12,
      title: 'Nebula III — Silent Diagnostics',
      description: `VOID's network diagnostics console lets you ping any host — but their security team was in a hurry and only blocked the "obvious" characters.

Sometimes the most dangerous tool is the one you forgot to lock.

Target: https://gracious-gratitude-zerosignalctf.up.railway.app

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
      downloadUrl: `${BACKEND}/files/transmission_corrupted.png`,
      downloadName: 'transmission_corrupted.png',
    },
    {
      id: 14,
      title: 'Axiom II — The Keygen',
      description: `VOID's activation system requires a valid serial to unlock. We intercepted the program file — but it's protecting its own logic somehow.

Figure out how the file hides its real code, extract the validation logic, and derive a serial that passes the check.

Run the file with: python void_activation.py`,
      points: 150,
      downloadUrl: `${BACKEND}/files/void_activation.py`,
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
      downloadUrl: `${BACKEND}/files/void_lock.py`,
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
      downloadUrl: `${BACKEND}/files/void_core_transmission.png`,
      downloadName: 'void_core_transmission.png',
    },
  ],
  'the-summit': [
   {
  id: 17,
  title: 'The Summit — Broken Authority',
  description: `The final transmission has cut. One node remains — THE SUMMIT — guarded by four independent, differently-broken subsystems.

Target: https://summit-server-zerosignalctf.up.railway.app

Break any subsystem to seize control. Whoever captures dethrones the current holder instantly. But that subsystem won't work twice in a row — once used, find a different weakness to recapture. Only after all four have been used does the cycle reset.

Hold The Summit and earn +20 points every 60 seconds — for as long as you can defend it.`,
  points: 400,
},
  ],
}

interface HintStatus {
  index: number
  cost: number
  unlocked: boolean
  text: string | null
}

export const ChallengePanel: React.FC<{ activePlanetId: string }> = ({ activePlanetId }) => {
  const currentTeamId = useStore((state) => state.currentTeamId)
  const planets = useStore((state) => state.planets)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [flags, setFlags] = useState<Record<number, string>>({})
  const [statuses, setStatuses] = useState<Record<number, { type: string; message: string }>>({})
  const [loading, setLoading] = useState<Record<number, boolean>>({})
  const [hints, setHints] = useState<Record<number, HintStatus[]>>({})
  const [hintLoading, setHintLoading] = useState<Record<string, boolean>>({})

  const activePlanet = planets[activePlanetId]
  const challenges = CHALLENGES[activePlanetId] || []

  const fetchHints = async (challengeId: number) => {
    if (!currentTeamId) return
    try {
      const res = await fetch(
        `${BACKEND}/api/hints/status?teamId=${currentTeamId}&challengeId=${challengeId}`
      )
      const data = await res.json()
      setHints(prev => ({ ...prev, [challengeId]: data }))
    } catch {
      // silently fail — hints panel simply won't render
    }
  }

  const revealHint = async (challengeId: number, hintIndex: number) => {
    if (!currentTeamId) return
    const key = `${challengeId}-${hintIndex}`
    setHintLoading(prev => ({ ...prev, [key]: true }))
    try {
      const res = await fetch(`${BACKEND}/api/hints/unlock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamId: currentTeamId, challengeId, hintIndex }),
      })
      const data = await res.json()
      if (res.ok) {
        setHints(prev => ({
          ...prev,
          [challengeId]: (prev[challengeId] || []).map(h =>
            h.index === hintIndex ? { ...h, unlocked: true, text: data.text } : h
          ),
        }))
      }
    } catch {
      // silently fail
    } finally {
      setHintLoading(prev => ({ ...prev, [key]: false }))
    }
  }

  const toggleExpand = (challenge: Challenge) => {
    const willExpand = expandedId !== challenge.id
    setExpandedId(willExpand ? challenge.id : null)
    if (willExpand && challenge.hintsCount) {
      fetchHints(challenge.id)
    }
  }

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
              onClick={() => toggleExpand(challenge)}
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
                <pre className="text-slate-400 text-xs whitespace-pre-wrap leading-relaxed select-text">
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

                {challenge.downloads && challenge.downloads.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {challenge.downloads.map((d) => (
                      <a
                        key={d.url}
                        href={d.url}
                        download={d.name}
                        className="inline-flex items-center gap-2 text-xs text-sky-400 border border-sky-900 px-3 py-1.5 rounded hover:bg-sky-950/30 transition-colors"
                      >
                        <Download size={12} />
                        Download {d.name}
                      </a>
                    ))}
                  </div>
                )}

                {challenge.hintsCount && (
                  <div className="space-y-2">
                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Hints</div>
                    {(hints[challenge.id] || []).map((h) => (
                      <div key={h.index} className="flex items-center gap-2">
                        {h.unlocked ? (
                          <div className="flex-1 text-xs text-amber-300 bg-amber-950/20 border border-amber-900/50 rounded px-3 py-2">
                            {h.text}
                          </div>
                        ) : (
                          <button
                            onClick={() => revealHint(challenge.id, h.index)}
                            disabled={hintLoading[`${challenge.id}-${h.index}`]}
                            className="flex-1 text-xs text-amber-400 border border-amber-900/60 rounded px-3 py-2 hover:bg-amber-950/20 transition-colors disabled:opacity-50"
                          >
                            {hintLoading[`${challenge.id}-${h.index}`]
                              ? 'Unlocking...'
                              : `Reveal Hint ${h.index + 1} (-${h.cost} pts)`}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
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