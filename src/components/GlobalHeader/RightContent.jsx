import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import SelectLang from '../SelectLang';
import styles from './index.less';

const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};

export const GlobalHeaderRight = props => {
  const {
    isPath,
    enterpriseList: { listallList, agent_eid },
    dispatch,
  } = props;

  const setInitCompany = () => {
    const defaultAgent = '1';
    localStorage.agent_eid = defaultAgent;
    dispatch({
      type: 'enterpriseList/changeAgentEid',
      payload: { agent_eid: defaultAgent },
    });
  }

  useEffect(() => {
    if (localStorage.agent_eid) {
      dispatch({
        type: 'enterpriseList/changeAgentEid',
        payload: { agent_eid: localStorage.agent_eid },
      });
    } else {
      setInitCompany();
    }
  }, [listallList]);

  return (
    <div className={styles.right}>
      {
        (isPath && isPath.indexOf('/settle/') >= 0 || isPath.indexOf('/new_media') >= 0)
          ? (<p><span className={styles.settle_info}>結算對象：{
            (listallList && agent_eid)
              ? (
                (listallList.filter(elem => elem.id == agent_eid).length > 0)
                  ? (listallList.filter(elem => elem.id == agent_eid)[0].name)
                  : (agent_eid)
              )
              : ('')
          }</span></p>)
          : (null)
      }
      {/* 
        // ONLY FOR TEST: HIDE FEATURE
        <HeaderSearch
          className={`${styles.action} ${styles.search}`}
          placeholder="搜尋"
          defaultValue=""
          options={searchOpts}
          onSearch={value => {
            searchKeyword(value);
          }}
        />
      */}
      <Avatar
        menu
        isPath={isPath}
      />
      {/* 
        // ONLY FOR TEST: HIDE FEATURE
        <SelectLang className={styles.action} />
      */}
    </div>
  );
};

export default connect(({ enterpriseList, loading }) => ({
  enterpriseList,
}))(GlobalHeaderRight);
