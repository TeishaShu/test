import React, { useState, useEffect, Fragment } from 'react';
import {
  Form,
  Card,
  Button,
  Modal,
  Popover,
  Spin,
  Result,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, history } from 'umi';
import { CloseCircleOutlined } from "@ant-design/icons";
import styles from '@/style/style.less';
import errorStyles from '@/style/error_style.less';
import FooterToolbar from '@/components/FooterToolbar';
import ComSongSetting from './components/ComSongSetting';
import FormIsOursPrepaidSetting from './components/FormIsOursPrepaidSetting';
import FormNotIsOursPrepaidSetting from './components/FormNotIsOursPrepaidSetting';
import commFn from '@/fn/comm';

export const prepaid = props => {
  const {
    match,
    loadingGetContent,
    loadingGetPrepaid,
    loadingEditExternalContract,
    loadingEditInternalContract,
    loadingRemovePrepaid,
    dispatch,
    albumPrepaidList: { externalContractList, internalContractList },
  } = props;
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const [error, setError] = useState([]);
  const [viewLoading, setViewLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  // FormPrepaidSetting
  const [isDisabledSubmit, setIsDisabledSubmit] = useState(false);
  const [showRightList, setShowRightList] = useState([]);
  // nowTab
  const [nowTab, setNowTab] = useState('isOurs');

  // api -----
  // convertPrepaidData, TODO: 應要轉成新格式??
  const convertPrepaidData = (resObj, isTab) => {
    let tmpObj = resObj;
    let tmpPrepaidData = [];
    let tmpShowRightList = [];
    let nowTabSetting = (isTab) ? (isTab) : (nowTab);
    let checkParentIsEffective = true;

    form.setFieldsValue({ prepaid: [] });
    setShowRightList([]);

    // check isTab obj
    if (!resObj) {
      if (nowTabSetting == 'isOurs') {
        tmpObj = internalContractList;
      } else {
        tmpObj = externalContractList;
      }
    }

    for (let i = 0; i < tmpObj.length; i++) {
      let prepaidObj = {
        id: tmpObj[i].id,
        prepaid_id: tmpObj[i].prepaid_id,
        prepaid_right_id: tmpObj[i].prepaid_right_id,
        is_settled: tmpObj[i].is_settled,
        contract_song_code: tmpObj[i].contract_song_code,
        is_entity: commFn.convertToBool(tmpObj[i].is_entity),
        is_digital: commFn.convertToBool(tmpObj[i].is_digital),
        author: tmpObj[i].author,
        author_code: tmpObj[i].author_code,
        song_code: tmpObj[i].song_code,
        song_right_id: tmpObj[i].song_right_id,
        song_rights: tmpObj[i].song_rights,
        value: (!tmpObj[i].value || tmpObj[i].value == '-') ? ('') : (commFn.trimZero(tmpObj[i].value)),  // 預付
        balance: (!tmpObj[i].balance || tmpObj[i].balance == '-') ? ('') : (commFn.trimZero(tmpObj[i].balance)),  // 餘額
        is_paid: commFn.convertToBool(tmpObj[i].is_paid),
        is_no_commission: commFn.convertToBool(tmpObj[i].is_no_commission),
        rights: [],
        ui_merge_rights: [],  // 有勾選合併扣抵的 prepaid_right_id
        ui_delete_btn: (tmpObj[i].is_settled && parseInt(tmpObj[i].is_settled, 10) == 1) ? (false) : (true),
        is_master: (tmpObj[i].is_master == '1') ? (true) : (false),
        is_effective: (tmpObj[i].is_effective) ? (tmpObj[i].is_effective) : '0',  // 有效或無效 (歷史)
        album_id: tmpObj[i].album_id,
        init_album_id: tmpObj[i].init_album_id,
        is_limited: (tmpObj[i].is_limited == '1') ? (true) : (false),  // 限扣此專輯
        ui_is_child: false,
      };
      let tmpUiPrepaidRightId = [];

      // ui_merge_rights
      if (tmpObj[i].prepaid_right_id) {
        tmpUiPrepaidRightId.push(tmpObj[i].prepaid_right_id);
      }
      if (tmpObj[i].other_rights) {
        for (let k = 0; k < tmpObj[i].other_rights.length; k++) {
          let itemPrepaidRightId = tmpObj[i].other_rights[k].prepaid_right_id;
          if (itemPrepaidRightId) {
            tmpUiPrepaidRightId.push(itemPrepaidRightId);
          }
        }
      }
      prepaidObj.ui_merge_rights = tmpUiPrepaidRightId;

      if (tmpObj[i].other_rights) {
        for (let j = 0; j < tmpObj[i].other_rights.length; j++) {
          let meRight = tmpObj[i].other_rights[j];
          let rightsObj = {
            prepaid_id: meRight.prepaid_id,
            prepaid_right_id: meRight.prepaid_right_id,
            song_rights_id: meRight.song_rights_id,
            checked: (meRight.prepaid_right_id) ? (true) : (false),
            is_master: (meRight.is_master == '1') ? (true) : (false),
            album_id: meRight.album_id,
            album_code: meRight.album_code,
            disc: meRight.disc,
            song_name: meRight.song_name,
            contract_song_code: meRight.contract_song_code,
            author: meRight.author,
            song_rights: meRight.song_rights,
            album_disc_content_id: meRight.album_disc_content_id,
            is_effective: (meRight.is_effective) ? (meRight.is_effective) : '0',
            country_name_zh: meRight.country_name_zh,
          };

          // check ui_is_child
          if (meRight.is_master == '1') {
            prepaidObj.ui_is_child = true;
          }

          prepaidObj.rights.push(rightsObj);
        }
      }


      tmpPrepaidData.push(prepaidObj);
      tmpShowRightList.push(false);

      // checkParentIsEffective
      if (prepaidObj.is_effective != '1') {
        checkParentIsEffective = false;
      }
    }

    // check isDisabledSubmit
    if (tmpPrepaidData.length < 1) {
      setIsDisabledSubmit(true);
    } else {
      setIsDisabledSubmit(false);
    }

    form.setFieldsValue({ prepaid: tmpPrepaidData });
    setShowRightList(tmpShowRightList);
  }

  // getPrepaidData
  const getPrepaidData = (album_disc_content_id, isNowTab) => {
    dispatch({
      type: 'albumPrepaidList/fetchMultiGetContractList',
      payload: {
        album_disc_content_id: album_disc_content_id,
      },
      callback: (internalRes, externalRes) => {
        let nowTabSetting = (isNowTab) ? (isNowTab) : (nowTab)

        if (nowTabSetting == 'isOurs') {
          if (internalRes && internalRes.length > 0) {
            convertPrepaidData(internalRes, nowTabSetting);
          } else {
            form.setFieldsValue({ prepaid: [] });
            setShowRightList([]);
          }
        } else {
          if (externalRes && externalRes.length > 0) {
            convertPrepaidData(externalRes, nowTabSetting);
          } else {
            form.setFieldsValue({ prepaid: [] });
            setShowRightList([]);
          }
        }
      }
    });
  }

  // valid behavior -----
  // fieldLabels
  const fieldLabels = {
    // role: '角色類別',
  };

  // valid
  const getErrorInfo = errors => {
    const errorCount = errors.filter(item => item.errors.length > 0).length;
    // fix Form.List field
    const cusFields = [];  // ['role', 'type']
    const cusFieldId = '';  // 'role'

    if (!errors || errorCount === 0) {
      return null;
    }

    const scrollToField = fieldKey => {
      let labelNode = document.querySelector(`label[for="${fieldKey}"]`);

      if (cusFields.includes(fieldKey)) {
        labelNode = document.getElementById(cusFieldId);
      }

      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };

    const errorList = errors.map(err => {
      if (!err || err.errors.length === 0) {
        return null;
      }

      let key = err.name[0];
      let renderFieldName = fieldLabels[key];
      let renderSelector = key;

      if (err.name.length > 1) {
        key = '';
        for (let i = 0; i < err.name.length; i++) {
          key += err.name[i];
        }
      }

      if (!renderFieldName) {
        for (let i = 0; i < cusFields.length; i++) {
          if (key.indexOf(cusFields[i]) >= 0) {
            renderFieldName = fieldLabels[cusFieldId][cusFields[i]];
            break;
          }
        }

        renderSelector = cusFieldId;
      }

      return (
        <li key={key} className={errorStyles.errorListItem} onClick={() => scrollToField(renderSelector)}>
          <CloseCircleOutlined className={errorStyles.errorIcon} />
          <div className={errorStyles.errorMessage}>{err.errors[0]}</div>
          <div className={errorStyles.errorField}>{renderFieldName}</div>
        </li>
      );
    });
    return (
      <span className={errorStyles.errorIcon}>
        <Popover
          title="表單驗證訊息"
          content={errorList}
          overlayClassName={errorStyles.errorPopover}
          trigger="click"
          getPopupContainer={trigger => {
            if (trigger && trigger.parentNode) {
              return trigger.parentNode;
            }

            return trigger;
          }}
        >
          <CloseCircleOutlined />
        </Popover>
        {errorCount}
      </span>
    );
  };
  const onFinishFailed = errorInfo => {
    setError(errorInfo.errorFields);
  };

  // save
  const onFinish = values => {
    setError([]);
    let saveObj = {
      album_disc_content_id: '',
      prepaid: [],
    }

    // album_disc_content_id
    saveObj.album_disc_content_id = values.ui_song;

    // prepaid
    for (let i = 0; i < values.prepaid.length; i++) {
      let tmpOrgAlbumPrepaidRightId = values.prepaid[i].ui_merge_rights.slice();
      let tmpSettleAlbumPrepaidRightId = values.prepaid[i].ui_merge_rights.slice();
      let prepaidItem = {
        album_prepaid_id: values.prepaid[i].prepaid_id,
        song_code: values.prepaid[i].song_code,
        song_right_id: values.prepaid[i].song_right_id,
        author_code: values.prepaid[i].author_code,
        is_settled: values.prepaid[i].is_settled,
        is_master: (values.prepaid[i].is_master && values.prepaid[i].is_master == '1') ? '1' : '0',
        value: null,
        is_paid: commFn.convertBoolToNumStr(values.prepaid[i].is_paid),
        is_no_commission: commFn.convertBoolToNumStr(values.prepaid[i].is_no_commission),
        is_limited: commFn.convertBoolToNumStr(values.prepaid[i].is_limited),
        album_prepaid_right_id: [],
        new_right: [],
        ui_is_effective: values.prepaid[i].is_effective,
        ui_is_settled: values.prepaid[i].is_settled,
      };

      // value, balance
      if (values.prepaid[i].is_settled == '1') {
        prepaidItem.value = (values.prepaid[i].balance) ? (values.prepaid[i].balance) : null;
      } else {
        prepaidItem.value = (values.prepaid[i].value) ? (values.prepaid[i].value) : null;
      }
      if (!prepaidItem.value) {
        continue;
      }

      if (nowTab != 'isOurs') {
        // album_prepaid_right_id
        for (let j = 0; j < values.prepaid[i].rights.length; j++) {
          let newRightItem = {
            album_disc_content_id: values.prepaid[i].rights[j].album_disc_content_id,
            song_right_id: values.prepaid[i].rights[j].song_rights_id,
            is_master: (values.prepaid[i].rights[j].is_master && values.prepaid[i].rights[j].is_master == '1') ? '1' : '0'
          };

          if (values.prepaid[i].rights[j].checked) {
            if (tmpOrgAlbumPrepaidRightId.includes(values.prepaid[i].rights[j].prepaid_right_id)) {
              prepaidItem.album_prepaid_right_id.push(values.prepaid[i].rights[j].prepaid_right_id);
            } else {
              prepaidItem.new_right.push(newRightItem);
            }
          } else if (!values.prepaid[i].rights[j].checked && tmpSettleAlbumPrepaidRightId.includes(values.prepaid[i].rights[j].prepaid_right_id)) {
            for (let k = 0; k < tmpSettleAlbumPrepaidRightId.length; k++) {
              if (tmpSettleAlbumPrepaidRightId[k] == values.prepaid[i].rights[j].prepaid_right_id) {
                tmpSettleAlbumPrepaidRightId.splice(k, 1);
                break;
              }
            }
          }
        }

        // parent right
        if (!values.prepaid[i].prepaid_id && (prepaidItem.is_paid == '1' || prepaidItem.is_no_commission || parseFloat(prepaidItem.value) > 0)) {
          let newRightItem = {
            is_master: '1',
            album_disc_content_id: values.ui_song,
            song_right_id: values.prepaid[i].song_right_id,
          };

          prepaidItem.new_right.push(newRightItem);
        } else if (values.prepaid[i].prepaid_right_id) {
          prepaidItem.album_prepaid_right_id.push(values.prepaid[i].prepaid_right_id);
        }
      }

      saveObj.prepaid.push(prepaidItem);
    }

    // 限定專輯：若有相同 author_code，則自動勾選
    if (nowTab == 'isOurs') {
      for (let k = 0; k < saveObj.prepaid.length; k++) {
        for (let l = 0; l < saveObj.prepaid.length; l++) {
          if (saveObj.prepaid[k].ui_is_effective != '1' || saveObj.prepaid[k].ui_is_settled == '1' || saveObj.prepaid[l].ui_is_effective != '1' || saveObj.prepaid[l].ui_is_settled == '1') {
            continue;
          }

          if (saveObj.prepaid[k].is_limited == '1' && saveObj.prepaid[l].value && saveObj.prepaid[k].author_code == saveObj.prepaid[l].author_code) {
            saveObj.prepaid[l].is_limited = '1';
          }
        }
      }
    }

    for (let m = 0; m < saveObj.prepaid.length; m++) {
      delete saveObj.prepaid[m].ui_is_effective;
      delete saveObj.prepaid[m].ui_is_settled;
    }

    dispatch({
      type: (nowTab != 'isOurs') ? ('albumPrepaidList/fetchEditExternalContract') : ('albumPrepaidList/fetchEditInternalContract'),
      payload: saveObj,
      callback: (result) => {
        if (result != '' && result != 'error') {
          setIsEdit(false);
          getPrepaidData(form.getFieldsValue().ui_song);
        }
      }
    });
  }

  // ui -----
  // changeTab
  const changeTab = (val) => {
    setNowTab(val);
    convertPrepaidData(null, val);
  }

  // confirm
  const showConfirm = (changeTabVal) => {
    confirm({
      title: '',
      icon: '',
      content: '確定要取消修改嗎？',
      okText: '確定',
      cancelText: '取消',
      onOk() {
        setIsEdit(false);

        if (changeTabVal) {
          changeTab(changeTabVal);
        } else {
          convertPrepaidData();
        }
      },
      onCancel() { },
    });
  }

  const removePrepaid = (prepaidId) => {
    dispatch({
      type: 'albumPrepaidList/fetchRemovePrepaid',
      payload: {
        album_prepaid_id: prepaidId,
      },
      callback: res => {
        if (res && res != 'error') {
          getPrepaidData(form.getFieldsValue().ui_song);
        }
      }
    });
  }

  // removePrepaid
  const showRemoveConfirm = (prepaidId) => {
    confirm({
      title: '',
      icon: '',
      content: '確定要刪除嗎？',
      okText: '確定',
      cancelText: '取消',
      onOk() {
        removePrepaid(prepaidId);
      },
      onCancel() { },
    });
  }

  // tabList
  const tabList = [
    { key: 'isOurs', tab: '內部合約' },
    { key: 'notIsOurs', tab: '外部合約' }
  ];

  return (
    <Spin
      tip="Loading..."
      spinning={loadingGetContent || loadingGetPrepaid || loadingEditExternalContract || loadingEditInternalContract || loadingRemovePrepaid || viewLoading}
    >
      <Form
        form={form}
        layout="horizontal"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <PageHeaderWrapper
          title="專輯詞曲預付"
        >
          <ComSongSetting
            form={form}
            isParams={match.params}
            getPrepaidData={getPrepaidData}
            setShowRightList={setShowRightList}
            setIsEdit={setIsEdit}
          />
          <Card
            bordered={false}
            title="預付設定"
            tabList={tabList}
            activeTabKey={nowTab}
            onTabChange={(key) => {
              if (key != nowTab) {
                if (isEdit) {
                  showConfirm(key);
                } else {
                  changeTab(key);
                }
              }
            }}
            extra={
              <Button
                type="primary"
                style={{ display: (isEdit) ? ('none') : ('inline-block') }}
                onClick={() => {
                  setIsEdit(true);
                  convertPrepaidData();
                }}
              >設定</Button>
            }
          >
            {
              (nowTab == 'notIsOurs')
                ? (
                  <FormNotIsOursPrepaidSetting
                    form={form}
                    isEdit={isEdit}
                    setIsEdit={setIsEdit}
                    showRightList={showRightList}
                    setShowRightList={setShowRightList}
                    setIsDisabledSubmit={setIsDisabledSubmit}
                    pageId={match.params.id}
                    showRemoveConfirm={showRemoveConfirm}
                  />
                )
                : (
                  <FormIsOursPrepaidSetting
                    form={form}
                    isEdit={isEdit}
                    showRemoveConfirm={showRemoveConfirm}
                  />
                )
            }
          </Card>
        </PageHeaderWrapper>
        {
          (isEdit)
            ? (
              <FooterToolbar>
                {getErrorInfo(error)}
                <Button
                  onClick={() => {
                    showConfirm();
                  }}
                >取消</Button>
                <Button
                  type="primary"
                  className={styles.submitBtnWidth}
                  onClick={() => form?.submit()}
                  disabled={isDisabledSubmit}
                >送出</Button>
              </FooterToolbar>
            )
            : ('')
        }
      </Form>
    </Spin>
  );
}

export default connect(({ albumPrepaidList, loading }) => ({
  albumPrepaidList,
  loadingGetContent: loading.effects['albumList/fetchGetContent'],
  loadingGetPrepaid: loading.effects['albumPrepaidList/fetchMultiGetContractList'],
  loadingEditExternalContract: loading.effects['albumPrepaidList/fetchEditExternalContract'],
  loadingEditInternalContract: loading.effects['albumPrepaidList/fetchEditInternalContract'],
  loadingRemovePrepaid: loading.effects['albumPrepaidList/fetchRemovePrepaid'],
}))(prepaid);