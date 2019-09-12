/*
* ==================================
*     M A T C H   M E D I A
* ==================================
*/

export default function mediaQuery(mq) {
  const matches = (key) => {
    let mediaQueryList = window.matchMedia(key);
    mediaQueryList = mediaQueryList.matches;
    return mediaQueryList;
  };

  let key = mq;
  switch (key) {
    case 'small':
      key = '(max-width: 767px)';
      break;
    case 'medium':
      key = '(min-width: 768px)';
      break;
    case 'medium down':
      key = '(max-width: 1023px)';
      break;
    case 'medium only':
      key = '(min-width: 768px) and (max-width: 1023px)';
      break;
    case 'large':
      key = '(min-width: 1024px)';
      break;
    default:
      return console.warn('Enter mediaQuery for comparison.'); // eslint-disable-line no-console
  }
  return matches(key);
}
