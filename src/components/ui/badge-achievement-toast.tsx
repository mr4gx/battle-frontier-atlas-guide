
import React from "react";
import { Award } from "lucide-react";

interface BadgeAchievementToastProps {
  badgeName?: string;
}

export const BadgeAchievementToast = ({ badgeName = "" }: BadgeAchievementToastProps) => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-lg shadow-lg">
      <div className="flex items-center">
        <div className="mr-4 bg-white/20 p-3 rounded-full flex-shrink-0">
          <Award className="h-8 w-8" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Badge Achieved!</h3>
          <p className="text-sm">
            {badgeName ? 
              `Congratulations! You've earned the ${badgeName} Badge.` : 
              "Congratulations! You've earned a badge for winning 7 battles at this facility."}
          </p>
          <p className="text-xs mt-1 text-white/80">
            View your collection in your Trainer Passport.
          </p>
        </div>
      </div>
    </div>
  );
};
