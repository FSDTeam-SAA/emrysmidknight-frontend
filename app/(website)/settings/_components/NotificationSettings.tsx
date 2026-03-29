import { Toggle } from "./Controls";

type NotificationRow<K extends string> = {
  key: K;
  label: string;
};

type NotificationSettingsProps<K extends string> = {
  notificationRows: ReadonlyArray<NotificationRow<K>>;
  notifications: Record<K, boolean>;
  onToggle: (key: K) => void;
};

export default function NotificationSettings<K extends string>({
  notificationRows,
  notifications,
  onToggle,
}: NotificationSettingsProps<K>) {
  return (
    <div className="bg-[color:var(--surface)] rounded-xl overflow-hidden">
      {notificationRows.map((item, index) => (
        <div
          key={item.key}
          className={`flex justify-between items-center px-6 py-[18px] ${
            index < notificationRows.length - 1 ? "border-b border-[color:var(--border)]" : ""
          }`}
        >
          <span className="text-sm text-[color:var(--text-primary)]">{item.label}</span>
          <Toggle checked={Boolean(notifications[item.key])} onChange={() => onToggle(item.key)} />
        </div>
      ))}
    </div>
  );
}
