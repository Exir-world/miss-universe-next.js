import Avatar from "@/components/avatar";
import DoneTasks from "@/components/doneTasks";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslations } from "next-intl";

const page = () => {
  const t = useTranslations();
  const nickname = "User"; // TODO: Replace with actual nickname from context or props

  return (
    <div>
      <div className="border border-[#C643A8E5] rounded-lg bg-[#7D7D7D4D]/30 px-4 pt-4 pb-6 w-full flex flex-col items-center">
        <div className="flex items-center justify-between w-full">
          <span>
            {t("", { nickname })}
          </span>
          <div className="flex items-center text-white gap-4 justify-between w-full p-2">
            <Avatar nickName={nickname} />
            <LanguageSwitcher />
          </div>
        </div>
        <div className="flex w-full flex-col justify-center items-center px-2 pt-7 gap-4 font-[600] text-[14px] tracking-wider">
          <DoneTasks />
        </div>
      </div>
    </div>
  );
};
export default page;
