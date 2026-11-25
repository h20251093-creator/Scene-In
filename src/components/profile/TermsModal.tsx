import React from 'react';
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
import { colors, spacing, typography } from '@/src/theme';

interface TermsModalProps {
  visible: boolean;
  type: 'terms' | 'privacy';
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ visible, type, onClose }) => {
  const isTerms = type === 'terms';

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isTerms ? '서비스 이용약관' : '개인정보 처리방침'}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {isTerms ? (
            <View style={styles.textBlock}>
              <Text style={styles.sectionHeader}>제 1 조 (목적)</Text>
              <Text style={styles.body}>
                본 약관은 SCENE-IN(이하 "회사")이 제공하는 명장면 중심 팬덤 아카이빙 및 촬영지 지도 탐색 서비스의 이용 조건 및 절차에 관한 제반 사항을 규정함을 목적으로 합니다.
              </Text>

              <Text style={styles.sectionHeader}>제 2 조 (용어의 정의)</Text>
              <Text style={styles.body}>
                1. "서비스"란 회사가 제공하는 '이 장면 뭐야?', '명장면 서랍', '지도', '팬덤 캘린더' 등 모든 제반 기능을 의미합니다.{'\n'}
                2. "이용자"란 본 약관에 동의하고 서비스를 이용하는 회원을 말합니다.{'\n'}
                3. "명장면 서랍"이란 이용자가 직접 시청 중인 작품의 장면, 대사, 메모를 수집하고 커스텀 카드로 제작할 수 있는 개인 보관함을 말합니다.
              </Text>

              <Text style={styles.sectionHeader}>제 3 조 (저작권의 귀속 및 권리)</Text>
              <Text style={styles.body}>
                서비스 내에 제공되는 작품의 공식 스틸컷, OST, 대사의 지식재산권은 원저작권자 및 제작사에 귀속되며, 이용자가 개인적 감상 목적으로 작성한 메모 및 큐레이션 컬렉션의 저작권은 작성자에게 있습니다.
              </Text>
            </View>
          ) : (
            <View style={styles.textBlock}>
              <Text style={styles.sectionHeader}>1. 수집하는 개인정보의 항목</Text>
              <Text style={styles.body}>
                회사는 원활한 고객 상담 및 팬덤 서비스 제공을 위해 최소한의 개인정보를 수집합니다.{'\n'}
                - 수집 항목: 닉네임, 프로필 한 줄 소개, 저장한 장면 목록, 관심 작품/인물 목록, 위치 정보(100m 반경 성지순례 인증 시 일시 사용).
              </Text>

              <Text style={styles.sectionHeader}>2. 개인정보의 수집 및 이용 목적</Text>
              <Text style={styles.body}>
                - 맞춤형 팬덤 일정 알림 및 푸시 알림 제공{'\n'}
                - 촬영지 근처 성지순례 방문 인증 및 디지털 스탬프북 발급{'\n'}
                - 서비스 이용 통계 분석 및 불량 이용자 제재
              </Text>

              <Text style={styles.sectionHeader}>3. 개인정보의 보유 및 파기</Text>
              <Text style={styles.body}>
                이용자의 회원 탈퇴 시 수집된 개인정보는 지체 없이 파기됩니다. 단, 관계 법령에 의해 보존할 필요가 있는 경우 법정 기간 동안 안전하게 보관됩니다.
              </Text>
            </View>
          )}
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
    paddingBottom: spacing.xxxl,
  },
  textBlock: {
    gap: spacing.md,
  },
  sectionHeader: {
    ...typography.subtitle2,
    color: colors.accent,
    marginTop: spacing.sm,
  },
  body: {
    ...typography.body2,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
