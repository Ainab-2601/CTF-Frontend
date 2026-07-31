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
      title: 'Nebula I — The Relay Node',
      description: `VOID rebuilt their control node after the last breach — but rumor has it a legacy debug feature never got removed.

Target: https://nebula-challenges-zerosignalctf.up.railway.app

This is a multi-stage exploit chain, not a single trick:

1. Somewhere on this node, a hidden value can only be confirmed one bit at a time — the app will only ever tell you TRUE or FALSE, nothing more.
2. What you extract lets you reconstruct a signing secret. Use it to forge your own credentials.
3. Your forged credentials only buy you a live, time-limited handshake. The flag is never stored anywhere on the server — it only gets generated the moment you complete that handshake correctly.

No single request solves this. You will need to script it.`,
      points: 50,
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
      points: 200,
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
      points: 50,
      downloadUrl: `${BACKEND}/files/transmission_corrupted.png`,
      downloadName: 'transmission_corrupted.png',
    },
    {
      id: 14,
      title: 'Axiom II — The Keygen',
      description: `VOID's activation system requires a valid serial to unlock. We intercepted the program file — but it's protecting its own logic somehow.

Figure out how the file hides its real code, extract the validation logic, and derive a serial that passes the check.

Run the file with: python void_activation.py`,
      points: 100,
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
      points: 200,
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
      points: 100,
      downloadUrl: `${BACKEND}/files/void_core_transmission.png`,
      downloadName: 'void_core_transmission.png',
    },
    {
      id: 17,
      title: 'Void Core — Stage 1: The First Fragment',
      description: `VOID's core stirred. Deep space receiver #1 intercepted the first fragment of its activation sequence, encrypted using VOID's signature method.

Ciphertext:
[1172, 716, 559, 2220, 14, 1204, 1726, 2497, 898, 2497, 14, 1912, 1305, 1340, 2666, 1062, 1359, 1823]

Encryption layers:
- RSA: n = 2773, e = 13
- Encoding: Unknown single-byte XOR key, then bit rotation by (position mod 8)

Our cryptanalysts confirmed:
- n = 2773 is the product of two primes
- The plaintext follows the format: VOID_FRAG_[NAME]::[NUMBER]

Decrypt to recover the first fragment.`,
      points: 20,
    },
    {
      id: 18,
      title: 'Void Core — Stage 2: The Hidden Signal',
      description: `A second fragment was intercepted, hidden inside a corrupted audio transmission.

Download the audio file below.

Our analysts believe VOID encoded a decryption key visually in the spectrogram. The key is visible when you view the audio in spectrogram form (use Audacity or similar tool).

Once you extract the key from the spectrogram, use it to decrypt this XOR-encrypted fragment:

Ciphertext (hex):
130c010b1a051a0e021c0a0a1102727574`,
      points: 20,
      downloadUrl: `${BACKEND}/files/void_transmission.wav`,
      downloadName: 'void_transmission.wav',
    },
    {
      id: 19,
      title: 'Void Core — Stage 3: The Archive',
      description: `VOID's infrastructure mirrors the organizational structure of this CTF itself.

Our lead analyst, Elisha, discovered traces of automated backups scattered across public platforms under seemingly innocuous accounts.

A partial archive identifier was recovered from deep packet inspection:

ZEROSIG_FRAGMENT_GAMMA_ARCHIVE_7B4K2M9N

Search this identifier on GitHub — particularly in repositories maintained by the CTF's operational teams (like ellietj8-code).

Once located, you'll find encrypted data. The encryption method should be familiar — VOID doesn't invent new ciphers.

Extract the third fragment.`,
      points: 20,
    },
    {
      id: 20,
      title: 'Void Core — Stage 4: The Final Archive',
      description: `The fourth and final fragment was hidden in VOID's primary data vault.

Download the image file below.

The fragment is hidden using the same steganographic method VOID employs across all their communications — LSB encoding in the red channel.

Extract the hidden message to recover the fourth fragment.

Once you have all four fragments, proceed to the Final Assembly challenge.`,
      points: 20,
      downloadUrl: `${BACKEND}/files/void_fragment_stage4.png`,
      downloadName: 'void_fragment_stage4.png',
    },
    {
      id: 21,
      title: 'Void Core — Final Transmission',
      description: `You have recovered all four fragments of VOID's activation sequence.

Each fragment contains an embedded position marker (::N).

Sort the fragments by their position markers in ascending order (1 → 2 → 3 → 4).

Extract only the FRAGMENT NAMES and concatenate them with underscores:

VOID_FRAG_[NAME1]_VOID_FRAG_[NAME2]_VOID_FRAG_[NAME3]_VOID_FRAG_[NAME4]

This assembled sequence contains the activation code.

Count the structural elements:
- How many underscores?
- How many times does each fragment name appear?

Combine these counts into a single code and use it to unlock VOID CORE.

Flag format: ZEROSIG{[code]}`,
      points: 200,
    },
  ],
  'the-summit': [
    {
      id: 22,
      title: 'The Summit — Broken Authority',
      description: `The final transmission has cut. One node remains — THE SUMMIT — guarded by four independent, differently-broken subsystems.

Target: http://SUMMIT_SERVER_IP:5003

Break any subsystem to seize control. Whoever captures dethrones the current holder instantly. But that subsystem won't work twice in a row — once used, find a different weakness to recapture. Only after all four have been used does the cycle reset.

Hold The Summit and earn +20 points every 60 seconds — for as long as you can defend it.`,
      points: 300,
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
  const clearTeam = useStore((state) => state.clearTeam)
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
      if (data.error === 'TEAM_NOT_FOUND') {
        clearTeam()
        return
      }
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

      if (data.error === 'TEAM_NOT_FOUND') {
        clearTeam()
        return
      }

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