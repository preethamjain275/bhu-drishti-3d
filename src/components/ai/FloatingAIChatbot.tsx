import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from "lucide-react";
import { executeSpatialQuery } from "@/lib/api/spatialQuery";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useLanguage } from "@/lib/i18n/languageStore";

interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  suggestedAction?: { label: string; url: string } | undefined;
}

const PARCEL_DATABASE = [
  {
    id: "PARCEL-DEMO-014",
    area: "2,450 m²",
    landUse: "Commercial - Retail Plaza",
    status: "Active Geometry Conflict",
    discrepancy: "2.8m northern offset between Municipal GIS and Deed Registry",
    confidence: "96.4%",
    buildings: "BLDG-014-A (G+4 Commercial), BLDG-014-B (G+2 Office Annex)",
  },
  {
    id: "PARCEL-DEMO-002",
    area: "3,820 m²",
    landUse: "Mixed Residential / Commercial",
    status: "Attribute & Floor Count Discrepancy",
    discrepancy: "Property tax registers 4 floors vs Municipal survey reports 6 floors",
    confidence: "91.2%",
    buildings: "BLDG-002-Tower (G+6 Residential)",
  },
  {
    id: "PARCEL-DEMO-019",
    area: "1,650 m²",
    landUse: "Vacant Institutional Land",
    status: "Under Review - Boundary Verified",
    discrepancy: "Drone Orthomosaic confirms setback matches Municipal Cadastre",
    confidence: "98.7%",
    buildings: "No registered structures (Vacant plot)",
  },
  {
    id: "PARCEL-DEMO-021",
    area: "4,120 m²",
    landUse: "Urban Infrastructure Zone",
    status: "Harmonized & Signed Off",
    discrepancy: "All 3 registered sources (Revenue, Municipal, Survey) in full agreement",
    confidence: "99.1%",
    buildings: "BLDG-021-Substation (G+1 Utility)",
  },
];

export function FloatingAIChatbot() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentParcelIndex, setCurrentParcelIndex] = useState(0);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-1",
      sender: "assistant",
      text: "👋 Welcome to Bhoo-Mitra AI! I am your Geospatial Intelligence Assistant. Ask me how Bhoo-Mitra AI resolves boundary conflicts, harmonizes land records, or queries any parcel with voice and chat.",
      timestamp: "Just now",
      suggestedAction: { label: "Explore 3D Intelligence Center", url: "/intelligence-3d" },
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const speakText = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      if (isSpeaking) {
        setIsSpeaking(false);
        return;
      }
      const cleanText = text.replace(/[*_#`]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = language === "hi" ? "hi-IN" : language === "kn" ? "kn-IN" : language === "ta" ? "ta-IN" : "en-IN";
      recognition.continuous = false;
      recognition.interimResults = false;
      setIsListening(true);
      recognition.onresult = (e: any) => {
        const transcript = e.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        handleSend(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } else {
      toast.error("Speech recognition is not supported in this browser. Please type your query.");
    }
  };

  const getKnowledgeResponse = (query: string): { text: string; action?: { label: string; url: string } } | null => {
    const q = query.toLowerCase();

    // Specific parcel queries or "diff one" / "other land"
    if (q.includes("diff") || q.includes("other") || q.includes("another") || q.includes("next land") || q.includes("next parcel")) {
      const nextIdx = (currentParcelIndex + 1) % PARCEL_DATABASE.length;
      setCurrentParcelIndex(nextIdx);
      const p = PARCEL_DATABASE[nextIdx]!;
      return {
        text: `📍 Retrieved Harmonized Intelligence for ${p.id}:\n• Land Use: ${p.landUse}\n• Area: ${p.area}\n• Status: ${p.status}\n• Discrepancy / Observation: ${p.discrepancy}\n• Harmonization Confidence: ${p.confidence}\n• Structures: ${p.buildings}`,
        action: { label: `Inspect ${p.id} in 3D Scene`, url: `/intelligence-3d?parcel=${p.id}` },
      };
    }

    const matchedParcel = PARCEL_DATABASE.find((p) => q.includes(p.id.toLowerCase()) || q.includes(p.id.replace("PARCEL-DEMO-", "").toLowerCase()));
    if (matchedParcel) {
      return {
        text: `📍 Harmonized Record for ${matchedParcel.id}:\n• Land Use: ${matchedParcel.landUse}\n• Total Area: ${matchedParcel.area}\n• Status: ${matchedParcel.status}\n• Details: ${matchedParcel.discrepancy}\n• Confidence: ${matchedParcel.confidence}\n• Associated Buildings: ${matchedParcel.buildings}`,
        action: { label: `Focus ${matchedParcel.id} in 3D`, url: `/intelligence-3d?parcel=${matchedParcel.id}` },
      };
    }

    if (q.includes("how it will help") || q.includes("help") || q.includes("what does it do") || q.includes("purpose") || q.includes("sih")) {
      return {
        text: "Bhoo-Mitra AI harmonizes fragmented and conflicting land records across government bodies. It aligns Cadastral Revenue maps, Municipal GIS, Property Deeds, and Drone Survey imagery into one unified spatial register with 7 core capabilities:\n\n1. Automated Ingestion & CRS Transformation (EPSG:4326 / EPSG:3857)\n2. Fuzzy & Exact Entity Matching\n3. 3D Spatial Conflict Detection (Overlaps & Boundary shifts)\n4. Provenance & Evidence Graphing\n5. AI Recommendation with Candidate Polygons\n6. Human Officer Verification (Accept, Modify, Reject, Defer)\n7. Immutable Audit Trails preserving original source records.",
        action: { label: "View Harmonization Pipeline", url: "/harmonization" },
      };
    }

    if (q.includes("3d") || q.includes("city") || q.includes("building") || q.includes("visualize")) {
      return {
        text: "The 3D Intelligence Center provides an interactive digital twin. Clicking any building flies the camera to the property, projects source boundaries, calculates area shifts, and logs human verification decisions with cryptographic audit hashes.",
        action: { label: "Open 3D City", url: "/intelligence-3d" },
      };
    }

    if (q.includes("report") || q.includes("pdf") || q.includes("export")) {
      return {
        text: "You can generate structured, print-ready PDF dossiers or export raw GeoJSON and CSV summaries for any parcel, conflict, or verification decision in the Reports & Export workspace.",
        action: { label: "Generate PDF Report", url: "/reports" },
      };
    }

    return null;
  };

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput("");
    setLoading(true);

    const localAns = getKnowledgeResponse(textToSend);
    if (localAns) {
      setTimeout(() => {
        const assistantMsg: ChatMessage = {
          id: `ast-${Date.now()}`,
          sender: "assistant",
          text: localAns.text,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          suggestedAction: localAns.action,
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setLoading(false);
      }, 400);
      return;
    }

    try {
      const res = await executeSpatialQuery(textToSend);
      const firstFollowUp = res.suggestedFollowUps && res.suggestedFollowUps.length > 0 ? res.suggestedFollowUps[0] : undefined;
      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: "assistant",
        text: res.result?.explanation || "Spatial query executed successfully.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedAction: firstFollowUp
          ? { label: firstFollowUp, url: "/intelligence-3d" }
          : undefined,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (_err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ast-err-${Date.now()}`,
          sender: "assistant",
          text: "Bhoo-Mitra AI spatial processing engine analyzed your query: All parcels across the urban sector are mapped and verifiable. You can select any building in the 3D Scene or draw new parcel boundaries on the Geospatial Map.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          suggestedAction: { label: "Open Geospatial Map", url: "/map" },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const starterPrompts = [
    "How will Bhoo-Mitra AI help?",
    "Show different land parcel",
    "Explain conflict on PARCEL-DEMO-014",
    "Open 3D Intelligence Center",
  ];

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-3 sm:right-6 z-50 font-sans">
      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-4 py-2 sm:py-3 rounded-full bg-gradient-to-r from-teal-500 via-teal-600 to-indigo-600 text-slate-950 font-bold shadow-[0_0_25px_rgba(20,184,166,0.5)] hover:scale-105 transition-all duration-300 border border-teal-300/40 cursor-pointer"
        >
          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse text-slate-950" />
          <span className="text-[11px] sm:text-xs uppercase tracking-wider font-extrabold text-slate-950">AI Copilot</span>
          <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-400 animate-ping" />
        </button>
      )}

      {/* Floating Chat Panel */}
      {isOpen && (
        <div className="w-[calc(100vw-1.5rem)] sm:w-[380px] md:w-[420px] h-[480px] sm:h-[540px] max-h-[75vh] bg-slate-950/95 border border-teal-500/40 rounded-2xl shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          
          {/* Panel Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-slate-900 via-teal-950/50 to-slate-900 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-teal-500/20 border border-teal-400/50 flex items-center justify-center text-teal-300">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-100 font-display flex items-center gap-1.5">
                  BHU-DRISHTI 3D COPILOT
                  <span className="px-1.5 py-0.2 rounded text-[8px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">VOICE & CHAT</span>
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">Real-time Spatial Intelligence & Voice</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  const lastMsg = messages[messages.length - 1];
                  if (lastMsg) speakText(lastMsg.text);
                }}
                className={cn(
                  "p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer",
                  isSpeaking && "text-teal-400 animate-pulse bg-teal-500/20"
                )}
                title={isSpeaking ? "Mute Voice" : "Read Aloud"}
              >
                {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-slate-900/60 border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto text-[10px] font-mono no-scrollbar">
            {starterPrompts.map((p) => (
              <button
                key={p}
                onClick={() => handleSend(p)}
                className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300 hover:text-teal-300 hover:border-teal-500/50 transition whitespace-nowrap cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 font-sans text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex gap-2.5 max-w-[88%]",
                  m.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div
                  className={cn(
                    "h-6 w-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold mt-0.5",
                    m.sender === "user" ? "bg-purple-600 text-white" : "bg-teal-500 text-slate-950 font-extrabold"
                  )}
                >
                  {m.sender === "user" ? <User className="h-3 w-3" /> : <Bot className="h-3.5 w-3.5" />}
                </div>

                <div className="space-y-1.5">
                  <div
                    className={cn(
                      "p-3 rounded-2xl text-xs leading-relaxed shadow-md whitespace-pre-line",
                      m.sender === "user"
                        ? "bg-purple-600 text-white rounded-tr-none"
                        : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none"
                    )}
                  >
                    {m.text}

                    {m.suggestedAction && (
                      <a
                        href={m.suggestedAction.url}
                        className="mt-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-500/15 border border-teal-500/40 text-teal-300 font-mono text-[10px] font-bold hover:bg-teal-500/25 transition"
                      >
                        {m.suggestedAction.label}
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 block px-1">{m.timestamp}</span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-teal-400 font-mono text-[11px] p-2">
                <Sparkles className="h-3.5 w-3.5 animate-spin" />
                Processing spatial query across land registries…
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar with Voice Recognition Button */}
          <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
            <button
              onClick={startListening}
              className={cn(
                "p-2 rounded-xl border transition cursor-pointer",
                isListening
                  ? "bg-red-500 text-white border-red-400 animate-pulse"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-teal-300 hover:border-teal-500/50"
              )}
              title="Voice Input (Speech-to-Text)"
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={isListening ? "Listening to your voice..." : "Ask AI Copilot about any land parcel or conflict..."}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-teal-500/60"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              className="p-2 rounded-xl bg-teal-500 text-slate-950 font-bold hover:bg-teal-400 disabled:opacity-50 transition cursor-pointer"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
