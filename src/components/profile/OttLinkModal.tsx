import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '@/src/theme';
import { ko } from '@/src/i18n/ko';

interface OttLinkModalProps {
  visible: boolean;
  onClose: () => void;
}

interface OttPlatform {
  id: string;
  name: string;
  iconColor: string;
  isLinked: boolean;
  accountEmail?: string;
}

export const OttLinkModal: React.FC<OttLinkModalProps> = ({ visible, onClose }) => {
  const [platforms, setPlatforms] = useState<OttPlatform[]>([
    { id: 'tving', name: 'TVING (티빙)', iconColor: '#FF153C', isLinked: true, accountEmail: 'cinephile@tving.com' },
    { id: 'wavve', name: 'Wavve (웨이브)', iconColor: '#0075FF', isLinked: true, accountEmail: 'cinephile@wavve.com' },
  ]);

  const toggleLink = (id: string) => {
    setPlatforms((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nextLinked = !p.isLinked;
          return {
            ...p,
            isLinked: nextLinked,
            accountEmail: nextLinked ? 'cinephile@link.com' : undefined,
          };
        }
        return p;
      })
    );
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{ko.profile.ottLink}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.infoBanner}>
            <Ionicons name="information-circle" size={18} color={colors.accent} />
            <Text style={styles.infoBannerText}>
              OTT 계정을 연동하시면 명장면 서랍에서 시청 중인 장면으로 1초 만에 바로 이동(딥링크)할 수 있습니다.
            </Text>
          </View>

          <View style={styles.list}>
            {platforms.map((p) => (
              <View key={p.id} style={styles.itemCard}>
                <View style={styles.platformMeta}>
                  <View style={[styles.platformIcon, { backgroundColor: p.iconColor }]}>
                    <Ionicons name="play" size={16} color="#FFF" />
                  </View>
                  <View style={styles.nameContainer}>
                    <Text style={styles.platformName}>{p.name}</Text>
                    {p.accountEmail ? (
                      <Text style={styles.accountEmail}>{p.accountEmail}</Text>
                    ) : (
                      <Text style={styles.unlinkedHint}>계정 미연동</Text>
                    )}
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.linkBtn,
                    p.isLinked ? styles.linkBtnActive : styles.linkBtnInactive,
                  ]}
                  onPress={() => toggleLink(p.id)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.linkBtnText,
                      p.isLinked && styles.linkBtnTextActive,
                    ]}
                  >
                    {p.isLinked ? ko.profile.ottLinked : ko.profile.ottNotLinked}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeBtn: {
    padding: spacing.xs,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  content: {
    padding: spacing.base,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: 'rgba(245, 196, 81, 0.1)',
    borderRadius: borderRadius.button,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(245, 196, 81, 0.25)',
    marginBottom: spacing.lg,
  },
  infoBannerText: {
    ...typography.caption,
    color: colors.accent,
    flex: 1,
    lineHeight: 18,
  },
  list: {
    gap: spacing.md,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: spacing.base,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  platformMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  platformIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameContainer: {
    flex: 1,
  },
  platformName: {
    ...typography.subtitle2,
    color: colors.textPrimary,
  },
  accountEmail: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  unlinkedHint: {
    fontSize: 11,
    color: colors.textDisabled,
    marginTop: 2,
  },
  linkBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: borderRadius.chip,
  },
  linkBtnActive: {
    backgroundColor: 'rgba(61, 220, 151, 0.15)',
    borderWidth: 1,
    borderColor: colors.success,
  },
  linkBtnInactive: {
    backgroundColor: colors.surfaceHigh,
    borderWidth: 1,
    borderColor: colors.border,
  },
  linkBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  linkBtnTextActive: {
    color: colors.success,
  },
});
