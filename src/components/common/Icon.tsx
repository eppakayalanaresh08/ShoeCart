import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import type { LucideIcon, LucideProps } from 'lucide-react-native';
import {
  Activity,
  ArrowLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  CirclePlus,
  Coffee,
  Dumbbell,
  Eye,
  EyeOff,
  Footprints,
  Grid2x2,
  Heart,
  House,
  KeyRound,
  LayoutDashboard,
  LogOut,
  MapPin,
  Package,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Smile,
  Trophy,
  User,
  Users,
  Zap,
} from 'lucide-react-native';

export type IconName =
  | 'footprints'
  | 'user'
  | 'shield-check'
  | 'eye'
  | 'eye-off'
  | 'check-circle'
  | 'alert-circle'
  | 'arrow-left'
  | 'shopping-bag'
  | 'logout'
  | 'dashboard'
  | 'plus-circle'
  | 'package'
  | 'users'
  | 'home'
  | 'grid'
  | 'key'
  | 'map-pin'
  | 'heart'
  | 'rotate-ccw'
  | 'chevron-right'
  | 'search'
  | 'zap'
  | 'smile'
  | 'activity'
  | 'dumbbell'
  | 'coffee'
  | 'trophy';

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: ViewStyle;
}

const ICON_MAP: Record<IconName, LucideIcon> = {
  'footprints': Footprints,
  'user': User,
  'shield-check': ShieldCheck,
  'eye': Eye,
  'eye-off': EyeOff,
  'check-circle': CircleCheck,
  'alert-circle': CircleAlert,
  'arrow-left': ArrowLeft,
  'shopping-bag': ShoppingBag,
  'logout': LogOut,
  'dashboard': LayoutDashboard,
  'plus-circle': CirclePlus,
  'package': Package,
  'users': Users,
  'home': House,
  'grid': Grid2x2,
  'key': KeyRound,
  'map-pin': MapPin,
  'heart': Heart,
  'rotate-ccw': RotateCcw,
  'chevron-right': ChevronRight,
  'search': Search,
  'zap': Zap,
  'smile': Smile,
  'activity': Activity,
  'dumbbell': Dumbbell,
  'coffee': Coffee,
  'trophy': Trophy,
};

export const Icon: React.FC<IconProps> = ({
  name,
  size = 18,
  color = '#0F172A',
  strokeWidth = 2,
  style,
}) => {
  const LucideComponent = ICON_MAP[name];
  const iconProps: LucideProps = {
    size,
    color,
    strokeWidth,
  };

  return (
    <View style={[styles.iconContainer, style]}>
      <LucideComponent {...iconProps} />
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
