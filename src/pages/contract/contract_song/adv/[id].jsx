import React, { useState, useEffect, Fragment } from 'react';
import {
  Button,
  Descriptions,
  Modal,
  Spin,
  Tooltip,
  message,
  Table,
  Alert,
  Card,
  Row,
  Col,
  Pagination,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, Link, history } from 'umi';
import InfoBanner from '@/components/InfoBanner';
import styles from '@/style/style.less';
import {
  FileAddOutlined,
  InteractionOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import ComAttachments from './components/ComAttachments';
import ComInfo from './components/ComInfo';
import { ComContractSongCopyModal } from './components/ComContractSongCopyModal';
import ComCommission from './components/ComCommission';
import cusStyles from '@/pages/contract/contract_song/styles/index.less';
import commFn from '@/fn/comm';
import PageHeaderDescription from '@/components/PageHeaderDescription';
import ComSong from './components/ComSong';
import ComPrepaid from './components/ComPrepaid';

const Adv = props => {
  const {
    loading,
    dispatch,
    contractSongList: { info, rightSongs },
    match,
  } = props;

  const [modalVisible, setModalVisible] = useState(false);
  const [pageCurrent, setPageCurrent] = useState(1);
  // 檢查合約是否超出終止日期
  const [isEffect, setIsEffect] = useState(true);
  const { confirm } = Modal;

  // 讀資料＆刷新資料 api
  const getData = () => {
    dispatch({
      type: 'contractSongList/fetchGetInfo',
      payload: {
        id: match.params.id,
      },
    });
  };

  // 取得合約相關歌曲(權利)
  const getSong = (page) => {
    dispatch({
      type: 'contractSongList/fetchRightSong',
      payload: {
        id: match.params.id,
        page_current: page || 1,
      },
    });
  };

  // 續約api
  const renewContract = () => {
    dispatch({
      type: 'contractSongList/renewContract',
      payload: {
        id: parseInt(info.id, 10),
      },
      callback: res => {
        if (res && res.data === true) {
          getData();
          message.success('續約成功');
        }
      },
    });
  };

  // 終止合約api
  const expireContract = () => {
    let apiCheck = true;
    if (rightSongs.total_items > 0) {
      dispatch({
        type: 'songRightsList/fetchExpireContract',
        payload: {
          contract_song_id: parseInt(info.id, 10),
        },
        callback: res => {
          if (res && res.status_code === 200) {
            apiCheck = true;
          } else {
            apiCheck = false;
          }
        },
      });
    }
    if (apiCheck === true) {
      dispatch({
        type: 'contractSongList/fetchExpireContract',
        payload: {
          id: parseInt(info.id, 10),
        },
        callback: res2 => {
          if (res2 && res2.data === true) {
            getData();
            message.success('終止成功');
          }
        },
      });
    }
  };

  // 刪除合約api
  const deleteContract = () => {
    dispatch({
      type: 'contractSongList/deleteContract',
      payload: {
        id: parseInt(info.id, 10),
      },
      callback: res => {
        if (res && res.data === true) {
          message.success('刪除成功');
          history.push('/contract/contract_song');
        }
      },
    });
  };

  // mount, update id
  useEffect(() => {
    getData();
    getSong();
  }, [match.params.id]);

  useEffect(() => {
    const today = new Date();
    const terminationDate = info.contract_termination_date ? new Date(info.contract_termination_date) : undefined;
    const exDate = info.contract_expiry_date ? new Date(info.contract_expiry_date) : undefined;
    if (info.is_effective === '0') {
      setIsEffect(false);
    } else if (terminationDate) {
      setIsEffect(today < terminationDate);
    } else if (exDate) {
      setIsEffect(today < exDate);
    } else {
      setIsEffect(true);
    }
  }, [info]);

  // 彈出確認視窗
  const showConfirm = (type, id) => {
    let confirmInfo;
    switch (type) {
      case 'expire':
        confirmInfo = '終止合約';
        break;
      case 'renew':
        confirmInfo = '續約';
        break;
      case 'del':
        confirmInfo = '刪除合約';
        break;
      case 'prepaidDelete':
        confirmInfo = '刪除預付';
        break;
      default:
        break;
    }
    if (confirmInfo !== undefined) {
      confirm({
        title: '',
        icon: '',
        content: `確定要${confirmInfo}嗎?`,
        okText: '確定',
        cancelText: '取消',
        onOk() {
          switch (type) {
            case 'expire':
              expireContract();
              break;
            case 'renew':
              renewContract();
              break;
            case 'del':
              deleteContract();
              break;
            default:
              break;
          }
        },
        onCancel() {
        },
      });
    }
  };

  // ComModal (add or edit) - show
  const showModal = () => {
    setModalVisible(true);
  };

  // ComCompanyMediaOpModal (add or edit) - hide
  const hideModal = () => {
    setModalVisible(false);
  };

  const copyContractSubmit = values => {
    dispatch({
      type: 'contractSongList/contractCopy',
      payload: {
        id: info.id,
        ...values,
      },
      callback: res => {
        if (res && res.data) {
          const redirect = `/contract/contract_song/adv/id/${res.data}`;
          history.push(redirect);
        }
      },
    });
  };

  // ui -----
  // PageHeaderWrapper(extra) - buttonsList
  const buttonsList = () => {
    return (
      <div>
        {
          (info.is_effective === '1')
            ? (
              <Button
                onClick={() => {
                  showConfirm('del');
                }}
              >刪除</Button>
            )
            : (null)
        }
        <Button
          className={styles.om_sp_m_lb}
          onClick={() => {
            showModal();
          }}
        >複製合約</Button>
        {
          (info.is_effective === '1')
            ? (
              <Button
                key={`edit-button-${info.id}`}
                type="primary"
                className={styles.om_sp_m_lb}
                onClick={() => {
                  history.push(`/contract/contract_song/update/${info.id}`);
                }}
              >修改</Button>
            )
            : (null)
        }
      </div>
    );
  };

  // PageHeaderWrapper(content) - description
  const description = () => {
    const result = [];
    const today = new Date();
    const exDate = new Date(Date.parse(info.contract_expiry_date));

    if (info.is_effective === '1') {
      if (exDate - today < 60 * 24 * 60 * 60 * 1000 && parseFloat(info.renewal_period) && info.is_permanent === '0') {
        result.push(
          <Tooltip key="renew" title="續約">
            <FileAddOutlined
              style={{ color: '#1976D2', fontSize: '30px', marginRight: '15px' }}
              onClick={() => {
                showConfirm('renew');
              }} />
          </Tooltip>);
      }
      if (info.is_permanent === '0' && info.is_transfer === '0') {
        // 等後端完成再開啟
        /*
        result.push(
          <Tooltip key="transfer" title="合約轉換">
            <InteractionOutlined
              style={{ fontSize: '30px', marginRight: '15px' }}
              onClick={() => {
                if (info.party_b_object.is_delete === '1') {
                  commFn.errHandler('此簽約對象已被刪除，無法進行合約轉換');
                } else {
                  history.push(`/contract/contract_song/transfer/${info.id}`);
                }
              }} />
          </Tooltip>,
        );
        */
      }
      result.push(
        <Tooltip key="expire" title="終止合約">
          <CloseCircleOutlined
            style={{ fontSize: '30px', marginRight: '15px' }}
            className={styles.om_color_red}
            onClick={() => {
              showConfirm('expire');
            }} />
        </Tooltip>,
      );
    } else {
      if (info.transfer_history !== null && info.transfer_history !== undefined) {
        const transferMessage = (
          <div>此合約已終止! 接續合約為
            <Link to={`/contract/contract_song/adv/id/${info.transfer_history.id}`}
              style={{ marginLeft: '16px', color: '#1890ff' }}>
              {info.transfer_history.contract_code}
            </Link>
          </div>);
        result.push(<Alert key="alert" message={transferMessage} type="warning" style={{ width: '100%' }} showIcon />);
      } else {
        result.push(<Alert key="alert" message="合約已終止!" type="warning" style={{ width: '100%' }} showIcon />);
      }
    }

    return (
      <Descriptions column={1} className={styles.headerList}>
        <Descriptions.Item>
          <PageHeaderDescription
            changeAcountStyle={true}
            createdAt={info.created_at}
            updatedAt={info.updated_at}
            createdBy={info.created_by}
            updatedBy={info.updated_by}
          />
        </Descriptions.Item>
        <Descriptions.Item>
          {result}
        </Descriptions.Item>
      </Descriptions>
    );
  };

  // PageHeaderWrapper(extraContent) - infoBanners
  const infoBanners = (
    <InfoBanner desc="相關歌曲" title1={rightSongs ? rightSongs.total_items : 0} first />
  );

  return (
    <Spin
      tip="Loading..."
      spinning={loading}
    >
      <PageHeaderWrapper
        title={info.contract_code ?? undefined}
        extra={buttonsList()}
        content={description()}
        extraContent={infoBanners}
        className={styles.infoBanners}
      >
        {info.file ? <ComAttachments info={info} /> : undefined}
        {info ? <ComInfo info={info} /> : undefined}
      </PageHeaderWrapper>
      <ComContractSongCopyModal
        visible={modalVisible}
        onCancel={hideModal}
        onSubmit={copyContractSubmit}
      />
      <ComSong
        pageCurrent={pageCurrent}
        setPageCurrent={setPageCurrent}
        getSong={getSong}
      />
      {/* <ComPrepaid
        pageId={match.params.id}
        color="#389E0D"
      /> */}
      {
        info.commission ? <ComCommission info={info} /> : undefined
      }
    </Spin>
  );
};

export default connect(({ contractSongList, loading }) => ({
  contractSongList,
  loading: loading.models.contractSongList,
}))(Adv);
