import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '@/src/theme';
import { ko } from '@/src/i18n/ko';

interface RegisterSpotModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (name: string, address: string, workTitle?: string) => Promise<void>;
}

export const RegisterSpotModal: React.FC<RegisterSpotModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [workTitle, setWorkTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert(ko.common.confirm, ko.map.enterSpotName);
      return;
    }
    if (!address.trim()) {
      Alert.alert(ko.common.confirm, ko.map.enterSpotAddress);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(name.trim(), address.trim(), workTitle.trim() || undefined);
      setName('');
      setAddress('');
      setWorkTitle('');
      onClose();
    } catch {
      Alert.alert(ko.common.error, '장소 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
              style={styles.modalContainer}
            >
              <View style={styles.header}>
                <View style={styles.headerTitleRow}>
                  <Ionicons name="location" size={20} color={colors.accent} />
                  <Text style={styles.title}>{ko.map.registerSpotTitle}</Text>
                </View>
                <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Ionicons name="close" size={22} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              <Text style={styles.subtitle}>{ko.map.registerSpotDesc}</Text>

              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    {ko.map.spotName} <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder={ko.map.spotNamePlaceholder}
                    placeholderTextColor={colors.textDisabled}
                    value={name}
                    onChangeText={setName}
                    maxLength={40}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>
                    {ko.map.spotAddress} <Text style={styles.required}>*</Text>
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder={ko.map.spotAddressPlaceholder}
                    placeholderTextColor={colors.textDisabled}
                    value={address}
                    onChangeText={setAddress}
                    maxLength={100}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>관련 작품 (선택)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="예: 달빛이 머무는 밤"
                    placeholderTextColor={colors.textDisabled}
                    value={workTitle}
                    onChangeText={setWorkTitle}
                    maxLength={50}
                  />
                </View>
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.cancelButton} onPress={onClose} disabled={isSubmitting}>
                  <Text style={styles.cancelButtonText}>{ko.common.cancel}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.submitButton} onPress={handleSave} disabled={isSubmitting}>
                  <Text style={styles.submitButtonText}>
                    {isSubmitting ? ko.common.loading : ko.map.submitSpot}
                  </Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(51, 48, 44, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  form: {
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  inputGroup: {
    gap: spacing.xs,
  },
  label: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  required: {
    color: colors.error,
  },
  input: {
    backgroundColor: colors.surfaceHigh,
    borderRadius: borderRadius.button,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    ...typography.body1,
    color: colors.textPrimary,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: borderRadius.button,
    backgroundColor: colors.surfaceHigh,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    ...typography.button,
    color: colors.textSecondary,
  },
  submitButton: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: borderRadius.button,
    backgroundColor: colors.accent,
    alignItems: 'center',
  },
  submitButtonText: {
    ...typography.button,
    color: colors.surface,
    fontWeight: '700',
  },
});
