import React, { useState, useEffect } from 'react';
import {
  Spin,
  Button,
  Modal,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, history } from 'umi';
import PageHeaderDescription from '@/components/PageHeaderDescription';
import ComInfo from './components/ComInfo';
import ComISRC from './components/ComISRC';
import ComContractAuthor from './components/ComContractAuthor';
import ComContractSong from './components/ComContractSong';
import ComSongRights from './components/ComSongRights';
import styles from '@/style/style.less';

export const adv = props => {
  const {
    loading,
    dispatch,
    authorList: { info },
    authList,
    match
  } = props;
  const [viewLoading, setViewLoading] = useState(false);
  const { confirm } = Modal;
  const [nowTab, setNowTab] = useState('');

  // api -----
  // getData
  const getData = (tabName) => {
    dispatch({
      type: 'authorList/fetchMultiGetInfo',
      payload: {
        tab: tabName,
        id: match.params.id,
      },
    });
  }

  // getTabAndData
  const getTabAndData = () => {
    let url = match.url.split('/');
    let newTab = url[url.length - 1];

    setNowTab(newTab);
    getData(newTab);
  }

  // mount, update id
  useEffect(() => {
    getTabAndData();
  }, [match.params.id]);

  // removeData
  const removeData = () => {
    dispatch({
      type: 'authorList/fetchRemoveData',
      payload: {
        id: match.params.id,
      },
      callback: (result) => {
        if (result == 'ok') {
          history.push('/information/author');
        }
      }
    });
  }

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

  // PageHeaderWrapper(tabList) - tabList
  const tabList = [
    {
      key: 'info',
      tab: '個人資料',
    },
    {
      key: 'isrc',
      tab: '演唱歌曲',
    },
    {
      key: 'song_rights',
      tab: '創作歌曲',
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

  // PageHeaderWrapper(extra) - buttonsList
  const buttonsList = (
    <div>
      <Button onClick={showRemoveConfirm}>刪除</Button>
      <Button
        type="primary"
        className={styles.om_sp_m_lb}
        onClick={() => {
          history.push(`/information/author/update/${match.params.id}`);
        }}
      >修改</Button>
    </div>
  );

  // PageHeaderWrapper(content) - description
  const description = (
    <PageHeaderDescription
      createdAt={info.created_at}
      updatedAt={info.updated_at}
    />
  );

  // change tab
  const changeTab = (newTab) => {
    history.push(`/information/author/adv/${match.params.id}/${newTab}`);
  }

  return (
    <Spin
      tip="Loading..."
      spinning={loading || viewLoading}
    >
      <PageHeaderWrapper
        className={styles.pageHeaderWrapper}
        title={`${info.author_code} - ${info.name}`}
        extra={buttonsList}
        content={description}
        tabList={tabList}
        tabActiveKey={nowTab}
        onTabChange={changeTab}
      >
        {
          (nowTab === 'info')
            ? (<ComInfo setViewLoading={setViewLoading} pageId={match.params.id} />)
            : ('')
        }
        {
          (nowTab === 'isrc')
            ? (<ComISRC setViewLoading={setViewLoading} pageId={match.params.id} />)
            : ('')
        }
        {
          (nowTab === 'song_rights')
            ? (<ComSongRights setViewLoading={setViewLoading} pageId={match.params.id} authorCode={info.author_code} />)
            : ('')
        }
        {
          (nowTab === 'contract_author')
            ? (<ComContractAuthor setViewLoading={setViewLoading} pageId={match.params.id} />)
            : ('')
        }
        {
          (nowTab === 'contract_song')
            ? (<ComContractSong setViewLoading={setViewLoading} pageId={match.params.id} />)
            : ('')
        }
      </PageHeaderWrapper>
    </Spin>
  );
}

export default connect(({ authorList, authList, loading }) => ({
  authorList,
  authList,
  loading: loading.models.authorList,
}))(adv);