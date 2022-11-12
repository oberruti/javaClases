/* Common style constants used throughout react components.
 * Mostly used to mitigate the constants duplication that inlining styles
 * would normally produce.
 * */

export const COLORS = {
  blue: '#361999',
  white: '#ffffff',
  green: '#78FFF1',
  rose: '#e91e63',
};

const fontFamily = 'Montserrat';

export const FONTS = {
  title: {
    fontFamily,
    fontSize: '55px',
    fontWeight: 600,
  },
  comments: {
    fontSize: '20px',
    fontFamily,
    fontStyle: 'italic',
    fontWeight: 400,
  },
};
