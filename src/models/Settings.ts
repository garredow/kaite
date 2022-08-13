import type { BaseSettings } from 'onyx-ui/models';

export type Settings = BaseSettings & {
  timestamps: 'absolute' | 'relative';
  displayMentions: boolean;
  displayLinks: boolean;
  displayHashtags: boolean;
};