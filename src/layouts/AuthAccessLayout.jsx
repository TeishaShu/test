import React, { useEffect, useState } from 'react';
import { Link, useIntl, connect } from 'umi';
import SelectLang from '@/components/SelectLang';
import styles from './AuthLayout.less';
import globalSettings from '@/fn/globalsettings';
import commFn from '@/fn/comm';
import projectInfo from '@/fn/projectInfo.json';

const AuthLayout = props => {
  const {
    children,
    match,
    dispatch,
  } = props;
  const [init, setInit] = useState(true);
  const [envText, setEnvText] = useState('');

  const checkFn = () => {
    commFn.checkUiVersion(projectInfo.version, props.location.pathname).then(() => {
      return commFn.checkLogin();
    }).then(() => {
      return commFn.checkEnvFile(true);
    }).then((envResult) => {
      // envResult
      if (envResult) {
        setEnvText(envResult);
      }

      // getUserData
      dispatch({
        type: 'authList/fetchGetInitUserData',
      });

      // checkLanguage
      return commFn.initForCheckLanguage();
    }).then(() => {
      setInit(false);
    }).catch((result) => {
      if (result && result == 'logout') {
        commFn.logout();
      }
    });
  }

  useEffect(() => {
    checkFn();

    // checkTimer
    let checkTimer = setInterval(() => {
      // checkLogin
      if (!commFn.isLogin()) {
        commFn.logout();
      }

      // checkEnvFile
      commFn.checkEnvFile(false, envText).then((envResult) => {
        if (envResult) {
          setEnvText(envResult);
        }
      }).catch(() => { });
    }, globalSettings.envTimer);
    return () => {
      clearTimeout(checkTimer);
    }
  }, []);

  return (
    <div className={styles.container}>
      {/* 
        // TODO: language select
        <div className={styles.lang}>
          <SelectLang />
        </div>
      */}
      <div className={styles.content}>
        <img alt="logo" className={styles.logo} src={`${REACT_APP_PUBLIC_PATH}/logo.jpg`} />
        <h3>版權管理系統 - {(commFn.checkPlatOrEntRole() == '1') ? '後台版' : '企業版'}</h3>
        {!init ? children : ''}
      </div>
    </div>
  );
};

// export default AuthLayout;
export default connect(({ authList, loading }) => ({
  authList,
  loading: loading.models.authList,
}))(AuthLayout);