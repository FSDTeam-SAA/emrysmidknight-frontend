import { Toggle } from "./Controls";

type AccountRow = {
  label: string;
  value?: string;
};

type AccountSettingsProps = {
  accountRows: ReadonlyArray<AccountRow>;
  publicProfile: boolean;
  onTogglePublicProfile: () => void;
  matureContent: boolean;
  onToggleMatureContent: () => void;
};

export default function AccountSettings({
  accountRows,
  publicProfile,
  onTogglePublicProfile,
  matureContent,
  onToggleMatureContent,
}: AccountSettingsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-[color:var(--surface)] rounded-xl overflow-hidden">
        {accountRows.map((item, index) => (
          <div
            key={item.label}
            className={`flex justify-between items-center px-6 py-[18px] ${
              index < accountRows.length - 1 ? "border-b border-[color:var(--border)]" : ""
            }`}
          >
            <span className="text-sm text-[color:var(--text-primary)]">{item.label}</span>
            {item.value && (
              <span className="text-sm text-[color:var(--text-secondary)]">{item.value}</span>
            )}
          </div>
        ))}
      </div>

      <div className="bg-[color:var(--surface)] rounded-xl px-6 py-[18px] flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-[color:var(--text-primary)] mb-1">
            Public Profile
          </p>
          <p className="text-[13px] text-[color:var(--text-muted)]">
            Anyone on the platform can view your profile information and activity.
          </p>
        </div>
        <Toggle checked={publicProfile} onChange={onTogglePublicProfile} />
      </div>

      <div className="bg-[color:var(--surface)] rounded-xl px-6 py-[18px] flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-[color:var(--text-primary)] mb-1">
            Mature Content
          </p>
          <p className="text-[13px] text-[color:var(--text-muted)]">
            You must be 18+ to view mature stories or media.
          </p>
        </div>
        <Toggle checked={matureContent} onChange={onToggleMatureContent} />
      </div>

      <div className="bg-[color:var(--surface)] rounded-xl px-6 py-[18px] border border-[color:var(--border)] cursor-pointer hover:border-[color:var(--text-muted)] transition-colors">
        <p className="text-sm font-medium text-[color:var(--accent)] mb-1">Deactivate account</p>
        <p className="text-[13px] text-[color:var(--text-muted)]">
          Deactivating will suspend your account until you sign back in.
        </p>
      </div>

      <div className="bg-[color:var(--surface)] rounded-xl px-6 py-[18px] border border-[color:var(--border)] cursor-pointer hover:border-[color:var(--text-muted)] transition-colors">
        <p className="text-sm font-medium text-[color:var(--accent)] mb-1">Delete account</p>
        <p className="text-[13px] text-[color:var(--text-muted)]">
          Permanently delete your account and all of your content.
        </p>
      </div>
    </div>
  );
}
