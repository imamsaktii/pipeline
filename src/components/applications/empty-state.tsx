type EmptyTab = "all" | "applied" | "interview" | "offer" | "rejected";

interface EmptyStateProps {
  status?: string;
  hasSearch?: boolean;
}

const EMPTY_CONFIG: Record<EmptyTab, { image: string; title: string; description: string }> = {
  all: {
    image: "/empty-states/all.png",
    title: "No applications tracked yet",
    description: 'Your pipeline is currently empty. Click "+ New application" in the top right to log your first role.',
  },
  applied: {
    image: "/empty-states/applied.png",
    title: "No pending applications",
    description: "Roles you have submitted and are waiting to hear back from will show up here.",
  },
  interview: {
    image: "/empty-states/interview.png",
    title: "No active interviews",
    description: "Once you land a call, update an application status to Interview to track its rounds here.",
  },
  offer: {
    image: "/empty-states/offer.png",
    title: "No offers yet",
    description: "Keep the momentum going — any role that reaches the offer stage will land right here.",
  },
  rejected: {
    image: "/empty-states/rejected.png",
    title: "Clean slate",
    description: "No rejected applications archived here. Every closed loop stays neatly tucked away.",
  },
};

export function EmptyState({ status = "all", hasSearch }: EmptyStateProps) {
  const key = (status in EMPTY_CONFIG ? status : "all") as EmptyTab;
  const config = EMPTY_CONFIG[key];

  return (
    <div className="mt-4 flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-white px-4 py-10 text-center sm:px-6 sm:py-14">
      <img src={config.image} alt={config.title} className="h-auto w-56 max-w-full object-contain mix-blend-multiply opacity-95 sm:w-64 md:w-72" />
      <h3 className="mt-2 text-sm font-semibold tracking-tight text-zinc-900 sm:text-base">{hasSearch ? "No matching applications" : config.title}</h3>
      <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-zinc-500">{hasSearch ? "No applications match your current search keyword. Try another term or switch status tabs." : config.description}</p>
    </div>
  );
}
