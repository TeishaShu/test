import React from 'react';
import styles from '@/style/style.less';
import cusStyles from './index.less';

const InfoBanner = props => {
  const {
    firstBanner,
    desc,
    title1,
    title2,
    first,
    cusTitle2Color,  // optional
  } = props;

  return (
    <div
      className={(first) ? `${cusStyles.block} ${styles.om_bd_none}` : `${cusStyles.block}`}
    >
      <p className={cusStyles.desc}>{(desc) ? desc : '0'}</p>
      <p className={cusStyles.title1}>{(title1) ? title1 : '0'}</p>
      <p className={`${cusStyles.title2} ${(cusTitle2Color) ? (styles.om_color_red) : ('')}`}>{(title2) ? title2 : ''}</p>
    </div>
  );
}

export default InfoBanner;