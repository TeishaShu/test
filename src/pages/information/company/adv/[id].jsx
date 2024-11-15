import React, { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  Spin,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, history } from 'umi';
import PageHeaderDescription from '@/components/PageHeaderDescription';
import ComInfo from './components/ComInfo';
import ComContractAuthor from './components/ComContractAuthor';
import ComContractSong from './components/ComContractSong';
import styles from '@/style/style.less';

const adv = props => {
  const {
    loading,
    dispatch,
    companyList: { info },
    authList,
    match,
  } = props;
  const { confirm } = Modal;
  const [nowTab, setNowTab] = useState({ id: '', name: '' });
  let redirectUrl = '';

  // api -----
  // removeData
  const removeData = () => {
    dispatch({
      type: 'companyList/fetchRemoveData',
      payload: {
        id: match.params.id,
      },
      callback: (result) => {
        if (result == 'ok') {
          history.push('/information/company');
        }
      }
    });
  }

  // getData
  const getData = (id) => {
    dispatch({
      type: 'companyList/fetchMultiGetInfo',
      payload: {
        id: id,
      },
    });
  }

  // mount, update id
  useEffect(() => {
    getTab();
  }, [match.params.id]);

  // ui -----
  // alert (remove)
  const showRemoveConfirm = () => {
    confirm({
      title: '',
      icon: '',
      content: '確定要刪除嗎？',
      okText: '確定',
      cancelText: '取消',
      onOk() {
        removeData();
      },
      onCancel() { },
    });
  }

  // header - buttons
  const buttonsList = (
    <div>
      <Button onClick={showRemoveConfirm}>刪除</Button>
      <Button
        type="primary"
        className={styles.om_sp_m_lb}
        onClick={() => {
          history.push(`/information/company/update/${match.params.id}`);
        }}
      >修改</Button>
    </div>
  );

  // header - description
  const description = (
    <PageHeaderDescription
      createdAt={info.created_at}
      updatedAt={info.updated_at}
    />
  );

  // header - tab
  const tabList = [
    {
      key: 'info',
      tab: '基本資料',
    },
    {
      key: 'contract_author',
      tab: '藝人發行合約',
    },
    {
      key: 'contract_song',
      tab: '詞曲合約',
    },
  ];

  // nowTab condition
  const getTab = () => {
    let url = match.url.split('/');
    let pageId = match.params.id;
    let nowTabName = url[url.length - 1];

    // if no params id, redirect
    if (pageId == 'info') {
      history.push('/information/company');
    }
    // set nowTab
    setNowTab({ ...nowTab, id: pageId, name: nowTabName });
    redirectUrl = match.url.replace(nowTabName, '');

    getData(pageId);
  }

  // change tab
  const changeTab = (newTab) => {
    history.push(`${redirectUrl}${newTab}`);
  }

  return (
    <Spin
      tip="Loading..."
      spinning={loading}
    >
      <PageHeaderWrapper
        className={styles.pageHeaderWrapper}
        title={`${(info.is_internal === '1') ? info.tax_id_number : info.company_code} - ${info.name}`}
        extra={buttonsList}
        content={description}
        tabList={tabList}
        tabActiveKey={nowTab.name}
        onTabChange={changeTab}
      >
        {nowTab.name === 'info' ? <ComInfo paramId={nowTab.id} /> : ''}
        {nowTab.name === 'contract_author' ? <ComContractAuthor paramId={nowTab.id} /> : ''}
        {nowTab.name === 'contract_song' ? <ComContractSong paramId={nowTab.id} /> : ''}
      </PageHeaderWrapper>
    </Spin>
  );
};

export default connect(({ companyList, authList, loading }) => ({
  companyList,
  authList,
  loading: loading.models.companyList,
}))(adv);