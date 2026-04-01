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
    <div className="  overflow-hidden space-y-4">
      {notificationRows.map((item) => (
        <div
          key={item.key}
          className={`flex justify-between items-center px-6 py-[20px] bg-white dark:bg-white/5 rounded-[8px]  `}
        >
          <span className="text-base md:text-xl text-[#2C2C2C] dark:text-white">
            {item.label}
          </span>

          <Toggle
            checked={Boolean(notifications[item.key])}
            onChange={() => onToggle(item.key)}
          />
        </div>
      ))}
    </div>
  );
}