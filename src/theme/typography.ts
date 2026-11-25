import { TextStyle } from 'react-native';

export const typography = {
  h1: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  } as TextStyle,
  h2: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: -0.4,
  } as TextStyle,
  h3: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    letterSpacing: -0.3,
  } as TextStyle,
  subtitle1: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    letterSpacing: -0.2,
  } as TextStyle,
  subtitle2: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    letterSpacing: -0.2,
  } as TextStyle,
  body1: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
    letterSpacing: -0.1,
  } as TextStyle,
  body2: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400',
    letterSpacing: -0.1,
  } as TextStyle,
  caption: {
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '400',
    letterSpacing: 0,
  } as TextStyle,
  tabLabel: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: '500',
    letterSpacing: -0.3,
  } as TextStyle,
  button: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '600',
    letterSpacing: -0.2,
  } as TextStyle,
  badge: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  } as TextStyle,
};

export type Typography = typeof typography;
