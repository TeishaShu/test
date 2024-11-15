import React, { useState, useEffect } from 'react';
import { Link, useIntl, connect } from 'umi';
import { PageLoading } from '@ant-design/pro-layout';
import commFn from '@/fn/comm';
import projectInfo from '@/fn/projectInfo.json';

export const SecurityLayout = props => {
  const {
    dispatch,
    children,
  } = props;
  const [init, setInit] = useState(true);

  // api -----
  // loadUiRoute
  const loadUiRoute = () => {
    return new Promise((resolve, reject) => {
      dispatch({
        type: 'uirouteList/fetchGetInitMenu',
        callback: (result) => {
          if (result && result == 'ok') {
            resolve();
          } else {
            reject('logout');
          }
        }
      });
    });
  }

  // mount
  useEffect(() => {
    if (init) {
      commFn.checkUiVersion(projectInfo.version, props.location.pathname).then(() => {
        return commFn.checkLogin();
      }).then(() => {
        return commFn.checkEnvFile(true);
      }).then(() => {
        // TODO: 動態 MENU 與 PERMISSION
        // return loadUiRoute();

        return true;
      }).then(() => {
        setInit(false);
      }).catch((result) => {
        if (result && result == 'logout') {
          commFn.logout();
        }
      });
    }
  }, []);

  return (
    (!init) ? (children) : (<PageLoading />)
  );
};

export default connect(({ uirouteList, loading }) => ({
  uirouteList,
  loading: loading.models.uirouteList,
}))(SecurityLayout);