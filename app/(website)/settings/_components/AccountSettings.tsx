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
      {/* Account Info */}
      <div className="overflow-hidden rounded-xl bg-white dark:bg-white/5">
        {accountRows.map((item) => (
          <div
            key={item.label}
            className="flex flex-col gap-2 px-4 py-4 sm:px-6 sm:py-[18px] md:flex-row md:items-center md:justify-between"
          >
            <span className="text-base sm:text-lg lg:text-xl text-[#2C2C2C] dark:text-white">
              {item.label}
            </span>

            {item.value && (
              <span className="break-words text-left text-base sm:text-lg lg:text-xl text-[#2C2C2C] dark:text-white md:text-right">
                {item.value}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Public Profile */}
      <div className="flex flex-col gap-4 rounded-xl bg-white px-4 py-4 dark:bg-white/5 sm:px-6 sm:py-[18px] md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <p className="mb-1 text-lg font-medium text-[#2C2C2C] dark:text-white lg:text-xl">
            Public Profile
          </p>
          <p className="text-sm text-[#5E5E5E] dark:text-gray-300 sm:text-[16px]">
            Anyone on the platform can view your profile information and activity.
          </p>
        </div>
        <div className="shrink-0">
          <Toggle checked={publicProfile} onChange={onTogglePublicProfile} />
        </div>
      </div>

      {/* Mature Content */}
      <div className="flex flex-col gap-4 rounded-xl bg-white px-4 py-4 dark:bg-white/5 sm:px-6 sm:py-[18px] md:flex-row md:items-center md:justify-between">
        <div className="flex-1">
          <p className="mb-1 text-lg font-medium text-[#2C2C2C] dark:text-white lg:text-xl">
            Mature Content
          </p>
          <p className="text-sm text-[#5E5E5E] dark:text-gray-300 sm:text-[16px]">
            You must be 18+ to view mature stories or media.
          </p>
        </div>
        <div className="shrink-0">
          <Toggle checked={matureContent} onChange={onToggleMatureContent} />
        </div>
      </div>

      {/* Deactivate Account */}
      <div className="cursor-pointer rounded-xl bg-white px-4 py-4 transition-colors hover:border-gray-400 dark:bg-white/5 dark:hover:border-white/30 sm:px-6 sm:py-[18px]">
        <p className="mb-1 text-lg font-medium text-[#EE0000] lg:text-xl">
          Deactivate account
        </p>
        <p className="text-sm text-[#5E5E5E] dark:text-gray-300 sm:text-[16px]">
          Deactivating will suspend your account until you sign back in.
        </p>
      </div>

      {/* Delete Account */}
      <div className="cursor-pointer rounded-xl bg-white px-4 py-4 transition-colors hover:border-[#EE0000] dark:bg-white/5 sm:px-6 sm:py-[18px]">
        <p className="mb-1 text-lg font-medium text-[#EE0000] lg:text-xl">
          Delete account
        </p>
        <p className="text-sm text-[#5E5E5E] dark:text-gray-300 sm:text-[16px]">
          Permanently delete your account and all of your content.
        </p>
      </div>
    </div>
  );
}