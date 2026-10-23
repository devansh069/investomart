import React from 'react';
import { View } from 'react-native';
import { Building2 } from 'lucide-react-native';

interface BuilderLogoBadgeProps {
  size?: number;
}

export const BuilderLogoBadge: React.FC<BuilderLogoBadgeProps> = ({ size = 34 }) => {
  return (
    <View
      style={{ width: size, height: size }}
      className="rounded-full bg-[#14532D] items-center justify-center border-2 border-emerald-400 shadow-xs"
    >
      <Building2 size={Math.round(size * 0.52)} color="#FFFFFF" strokeWidth={2.4} />
    </View>
  );
};
