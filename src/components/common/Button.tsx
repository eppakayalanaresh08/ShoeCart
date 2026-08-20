import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useApp } from '../../context/AppContext';
import { themeColors } from '../../theme/colors';
import { Icon, IconName } from './Icon';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  icon?: IconName;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  const { role } = useApp();
  const theme = themeColors[role];

  let bg = theme.primary;
  let txtColor = '#FFFFFF';
  let border = 'transparent';

  if (variant === 'secondary') {
    bg = theme.primaryBg;
    txtColor = theme.primary;
  } else if (variant === 'danger') {
    bg = theme.danger;
    txtColor = '#FFFFFF';
  } else if (variant === 'outline') {
    bg = 'transparent';
    txtColor = theme.primary;
    border = theme.primary;
  } else if (variant === 'ghost') {
    bg = 'transparent';
    txtColor = theme.textDark;
  }

  if (disabled) {
    bg = '#E5E7EB';
    txtColor = '#9CA3AF';
    border = 'transparent';
  }

  let paddingV = 12;
  let paddingH = 16;
  let fontSize = 14;

  if (size === 'sm') {
    paddingV = 8;
    paddingH = 12;
    fontSize = 12;
  } else if (size === 'lg') {
    paddingV = 16;
    paddingH = 24;
    fontSize = 16;
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: bg,
          borderColor: border,
          borderWidth: border !== 'transparent' ? 1.5 : 0,
          paddingVertical: paddingV,
          paddingHorizontal: paddingH,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={txtColor} size="small" />
      ) : (
        <>
          {icon && <Icon name={icon} size={16} color={txtColor} style={styles.icon} />}
          <Text style={[styles.text, { color: txtColor, fontSize }, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: {
    fontWeight: '700',
    textAlign: 'center',
  },
  icon: {
    marginRight: 2,
  },
});
