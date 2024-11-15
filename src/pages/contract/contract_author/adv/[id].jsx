import React, { useState, useEffect, Fragment } from 'react';
import {
  Spin,
  Button,
  Modal,
  Tooltip,
  Alert,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Link, connect, history } from 'umi';
import { FileAddOutlined, AppstoreOutlined } from "@ant-design/icons";
import PageHeaderDescription from '@/components/PageHeaderDescription';
import ComInfo from './components/ComInfo';
import ComSplit from './components/ComSplit';
import ComContractAuthorCopyModal from './components/ComContractAuthorCopyModal';
import ComSpecifiedAlbum from './components/ComSpecifiedAlbum';
import ComSpecifiedSong from './components/ComSpecifiedSong';
import ComPrepaid from './components/ComPrepaid';
import styles from '@/style/style.less';
import commFn from '@/fn/comm';

export const adv = props => {
  const {
    loadingCopyContract,
    loadingRemoveContract,
    loadingContractRenewal,
    loadingDeleteSubcontract,
    loadingAddSubcontract,
    loadingMultiGetContractAuthorInfo,
    dispatch,
    contractAuthorList: { multiChangeId, info },
    match
  } = props;
  const { confirm } = Modal;
  const [copyModalVisible, setCopyModalVisible] = useState(false);
  const [isContractTermination, setIsContractTermination] = useState(false);

  // api -----
  // getData
  const getData = () => {
    dispatch({
      type: 'contractAuthorList/fetchMultiGetContractAuthorInfo',
      payload: {
        isEdit: true,
        contract_author_id: match.params.id,
      }
    });
  }

  // mount, update id
  useEffect(() => {
    getData();
  }, [match.params.id]);

  // updateData
  useEffect(() => {
    // !永久 && (('合約提前終止' && ('合約提前終止' - 當天日期) < 0) || (!'合約提前終止' && '合約有效日' ('合約有效日' - 當天日期) < 0)) 則顯示 Alert 及隱藏相關按鈕
    if (info.basic_info.is_permanent != '1' && ((info.basic_info.contract_termination_date && (((new Date(info.basic_info.contract_termination_date) - new Date()) / 1000 / 60 / 60 / 24) < -1)) || (!info.basic_info.contract_termination_date && !info.basic_info.contract_expiry_date && (((new Date(info.basic_info.contract_expiry_date) - new Date()) / 1000 / 60 / 60 / 24) < -1)))) {
      setIsContractTermination(true);
    } else {
      setIsContractTermination(false);
    }
  }, [multiChangeId]);

  // copyContractSubmit
  const copyContractSubmit = values => {
    dispatch({
      type: 'contractAuthorList/fetchCopyContract',
      payload: {
        copy_contract_author_id: match.params.id,
        ...values,
      },
      callback: res => {
        if (res && res != 'error') {
          hideCopyModal();
          history.push(`/contract/contract_author/adv/${res}`);
        }
      },
    });
  };

  // removeContract
  const removeContract = () => {
    dispatch({
      type: 'contractAuthorList/fetchRemoveContract',
      payload: {
        contract_author_id: match.params.id,
      },
      callback: res => {
        if (res && res != 'error') {
          history.push('/contract/contract_author');
        }
      }
    });
  }

  // contractRenewal
  const contractRenewal = (obj) => {
    dispatch({
      type: 'contractAuthorList/fetchContractRenewal',
      payload: obj,
      callback: (res) => {
        if (res && res != 'error') {
          getData();
        }
      }
    });
  }

  // deleteSubcontract
  const deleteSubcontract = (obj) => {
    dispatch({
      type: 'contractAuthorList/fetchDeleteSubcontract',
      payload: obj,
      callback: (res) => {
        if (res && res != 'error') {
          getData();
        }
      }
    });
  }

  // addSubcontract
  const addSubcontract = (obj) => {
    dispatch({
      type: 'contractAuthorList/fetchAddSubcontract',
      payload: obj,
      callback: (res) => {
        if (res && res != 'error') {
          getData();
        }
      }
    });
  }

  // ui -----  
  // showCopyModal
  const showCopyModal = () => {
    setCopyModalVisible(true);
  };

  // hideCopyModal
  const hideCopyModal = () => {
    setCopyModalVisible(false);
  };

  // alert (removeContract)
  const showRemoveConfirm = () => {
    confirm({
      title: '',
      icon: '',
      content: '確定要刪除嗎？',
      okText: '確定',
      cancelText: '取消',
      onOk() {
        removeContract();
      },
      onCancel() { },
    });
  }

  // confirm
  const showConfirm = (type, text, para) => {
    confirm({
      title: '',
      icon: '',
      content: `確定要${text}嗎？`,
      okText: '確定',
      cancelText: '取消',
      onOk() {
        switch (type) {
          case 'contractRenewal':
            contractRenewal(para);
            break;
          case 'deleteSubcontract':
            deleteSubcontract(para);
            break;
          case 'addSubcontract':
            addSubcontract(para);
            break;
        }
      },
      onCancel() { },
    });
  }

  // PageHeaderWrapper(extra) - buttonsList
  const buttonsList = (
    <div>
      <Button onClick={showRemoveConfirm}>刪除</Button>
      <Button
        className={styles.om_sp_m_lb}
        onClick={() => {
          showCopyModal();
        }}
      >複製合約</Button>
      <Button
        type="primary"
        className={styles.om_sp_m_lb}
        onClick={() => {
          history.push(`/contract/contract_author/update/${match.params.id}`);
        }}
      >修改</Button>
    </div>
  );

  // PageHeaderWrapper(content) - description
  const description = (
    <Fragment>
      <PageHeaderDescription
        changeAcountStyle={true}
        createdAt={info.basic_info.created_at}
        updatedAt={info.basic_info.updated_at}
        createdBy={info.basic_info.created_by}
        updatedBy={info.basic_info.updated_by}
      />
      {
        (info.basic_info && !commFn.convertToBool(info.basic_info.is_permanent) && info.basic_info.contract_expiry_date && info.basic_info.renewal_period && (new Date(info.basic_info.contract_expiry_date) - new Date()) / 1000 / 60 / 60 / 24 < 60)
          ? (
            <Fragment>
              <Tooltip title="續約">
                <FileAddOutlined
                  style={{ color: '#1976D2', fontSize: '30px', marginRight: '15px' }}
                  onClick={() => {
                    showConfirm('contractRenewal', '續約', { contract_author_id: match.params.id, renewal_period: info.basic_info.renewal_period });
                  }}
                />
              </Tooltip>
            </Fragment>
          )
          : (null)
      }
      {
        (info.basic_info.contract_code)
          ? (
            (info.basic_info.has_subcontract && info.basic_info.has_subcontract == '1')
              ? (
                <Tooltip title="刪除子合約">
                  <AppstoreOutlined
                    style={{ fontSize: '30px' }}
                    onClick={() => {
                      showConfirm('deleteSubcontract', '刪除子合約', { contract_author_id: match.params.id });
                    }}
                  />
                </Tooltip>
              )
              : (
                (info.basic_info.party_b_object_author && info.basic_info.party_b_object_author.id && info.basic_info.party_b_object_author.type == '2')
                  ? (
                    <Tooltip title="分拆子合約">
                      <AppstoreOutlined
                        style={{ fontSize: '30px', color: '#54A767' }}
                        onClick={() => {
                          if (info.basic_info.party_b_object_author.is_delete == '1') {
                            commFn.errHandler('此藝人已被刪除，無法分拆');
                          } else {
                            showConfirm('addSubcontract', '分拆子合約', { contract_author_id: match.params.id, contract_code: info.basic_info.contract_code, parent_author_id: info.basic_info.party_b_object_author.id });
                          }
                        }}
                      />
                    </Tooltip>
                  )
                  : (null)
              )
          )
          : (null)
      }
    </Fragment>
  );

  return (
    <Spin
      tip="Loading..."
      spinning={loadingCopyContract || loadingRemoveContract || loadingContractRenewal || loadingDeleteSubcontract || loadingAddSubcontract || loadingMultiGetContractAuthorInfo}
    >
      <PageHeaderWrapper
        className={styles.pageHeaderWrapper}
        title={info.basic_info.contract_code}
        extra={buttonsList}
        content={description}
      >
        <ComInfo
          pageId={match.params.id}
        />
        <ComSpecifiedAlbum
          pageId={match.params.id}
          color="#006DB8"
        />
        <ComSpecifiedSong
          pageId={match.params.id}
          color="#C40000"
        />
        <ComPrepaid
          pageId={match.params.id}
          color="#389E0D"
        />
        <ComSplit />
      </PageHeaderWrapper>
      <ComContractAuthorCopyModal
        visible={copyModalVisible}
        onCancel={hideCopyModal}
        onSubmit={copyContractSubmit}
      />
    </Spin>
  );
}

export default connect(({ contractAuthorList, loading }) => ({
  contractAuthorList,
  loadingCopyContract: loading.effects['contractAuthorList/fetchCopyContract'],
  loadingRemoveContract: loading.effects['contractAuthorList/fetchRemoveContract'],
  loadingContractRenewal: loading.effects['contractAuthorList/fetchContractRenewal'],
  loadingDeleteSubcontract: loading.effects['contractAuthorList/fetchDeleteSubcontract'],
  loadingAddSubcontract: loading.effects['contractAuthorList/fetchAddSubcontract'],
  loadingMultiGetContractAuthorInfo: loading.effects['contractAuthorList/fetchMultiGetContractAuthorInfo'],
}))(adv);