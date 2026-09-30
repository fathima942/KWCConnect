/**
 * Design system token types for the KWC Connect project.
 */

export interface ColorTokens {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  success: string;
  warning: string;
  error: string;
  divider: string;
  backgroundSelected: string;
  backgroundElement: string;
}

export interface TypographyVariant {
  fontSize: number;
  lineHeight: number;
  fontWeight: '400' | '500' | '600' | '700' | 'bold' | 'normal';
  fontFamily?: string;
}

export interface TypographyTokens {
  headingXL: TypographyVariant;
  headingL: TypographyVariant;
  headingM: TypographyVariant;
  body: TypographyVariant;
  caption: TypographyVariant;
  button: TypographyVariant;
}

export interface SpacingTokens {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
}

export interface RadiusTokens {
  small: number;
  medium: number;
  large: number;
}

export interface ShadowVariant {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

export interface ShadowTokens {
  none: ShadowVariant;
  small: ShadowVariant;
  medium: ShadowVariant;
  large: ShadowVariant;
}

export interface AppTheme {
  dark: boolean;
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  radius: RadiusTokens;
  shadows: ShadowTokens;
}
