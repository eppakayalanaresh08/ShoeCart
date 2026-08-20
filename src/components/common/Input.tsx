import React from 'react';
import { View, Text, TextInput, StyleSheet, ViewStyle } from 'react-native';
import { useApp } from '../../context/AppContext';
import { themeColors } from '../../theme/colors';
import { Icon, IconName } from './Icon';

interface InputProps {
  label?: string;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  multiline?: boolean;
  numberOfLines?: number;
  icon?: IconName;
  error?: string;
  style?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  icon,
  error,
  style,
}) => {
  const { role } = useApp();
  const theme = themeColors[role];

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, { color: theme.textDark }]}>{label}</Text>}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error ? theme.danger : theme.border,
            backgroundColor: '#FFFFFF',
          },
        ]}
      >
        {icon && <Icon name={icon} size={18} color={theme.textMuted} style={styles.icon} />}
        <TextInput
          style={[
            styles.input,
            {
              color: theme.textDark,
              height: multiline ? 24 * (numberOfLines || 3) : 46,
            },
          ]}
          placeholder={placeholder}
          placeholderTextColor={theme.textMuted}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
        />
      </View>
      {error && <Text style={[styles.errorText, { color: theme.danger }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 14,
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  errorText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});
