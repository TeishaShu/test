import React, { Fragment } from 'react';
import styles from './index.less';

const BoxIcon = props => {
  const {
    list,
    listKey,  // optional
    selected,
    cusSelectBg,
    text,
  } = props;
  const selectBg = '#FFAA20';

  return (
    <Fragment>
      {
        (list)
          ? (
            <p
              className={styles.icon}
              style={
                (typeof (list) == 'string')
                  ? (
                    (
                      (list == selected)
                        ? ({ backgroundColor: (cusSelectBg ? cusSelectBg : selectBg) })
                        : (null)
                    )
                  )
                  : (
                    (
                      list.filter(elem => (listKey) ? (elem[listKey] === selected) : (elem === selected)).length > 0
                    )
                      ? ({ backgroundColor: (cusSelectBg ? cusSelectBg : selectBg) })
                      : (null)
                  )
              }
            >
              {text}
            </p>
          )
          : (null)
      }
    </Fragment>
  );
}

export default BoxIcon;