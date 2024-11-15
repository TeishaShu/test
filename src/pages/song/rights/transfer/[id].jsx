import React, { useState, useEffect, Fragment } from 'react';
import {
  Form,
  Card,
  Row,
  Col,
  Input,
  Select,
  Button,
  Modal,
  Popover,
  Spin,
  Result,
  message,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, history } from 'umi';
import { CloseCircleOutlined } from "@ant-design/icons";
import styles from '@/style/style.less';
import errorStyles from '@/style/error_style.less';
import ComInfo from '../components/ComInfo';
import ComOrgRight from './components/ComOrgRight';
import ComContract from './components/ComContract';
import FooterToolbar from '@/components/FooterToolbar';
import commFn from '@/fn/comm';

const { Option } = Select;

export const update = props => {
  const {
    loadingMultiGetSongRightTransfer,
    dispatch,
    songList,
    contractSongList,
    authorizedCountryList,
    songRightsList: { multiChangeId, song_rights },
    match,
  } = props;
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const [error, setError] = useState([]);
  // right
  const [uiRightAgency, setUiRightAgency] = useState('');
  // new_contract_code
  const [hasContractData, setHasContractData] = useState(true);
  const [optContractCode, setOptContractCode] = useState([]);
  const [uiContractAgencyList, setUiContractAgencyList] = useState([]);
  const [selectContractIdx, setSelectContractIdx] = useState(0);

  // api -----
  // getData
  const getData = () => {
    dispatch({
      type: 'songRightsList/fetchMultiGetSongRightTransfer',
      payload: {
        right_id: match.params.id,
        song_code: match.params.song_code,
      }
    });
  }

  // mount
  useEffect(() => {
    let initObj = {
      new_contract_code: '',
      notes: '',
    };

    form.setFieldsValue({
      ...initObj
    });
    getData();
  }, [match.params.id]);

  // convert agency function
  const convertAgencyFn = (isRights, datalist) => {
    let tmpArr = [];
    const keyName = {
      agency_area_type: (isRights) ? 'agency_area_type' : 'authorized_area_type',
      area_name: (isRights) ? 'area_name' : 'area_name',
      agency_country: (isRights) ? 'agency_country' : 'country_ids',
    };


    for (let i = 0; i < datalist.length; i++) {
      let item = datalist[i];
      let showText = '';

      if (item[keyName.agency_area_type] == '2' || item[keyName.agency_area_type] == '3' || item[keyName.agency_area_type] == '4') {
        showText += (item[keyName.area_name] ? item.[keyName.area_name] : '');
      }

      if (item[keyName.agency_area_type] == '3') {
        showText += '，包含';
      }

      if (item[keyName.agency_area_type] == '4') {
        showText += '，除了';
      }

      if (item[keyName.agency_area_type] == '1' || item[keyName.agency_area_type] == '3' || item[keyName.agency_area_type] == '4') {

        for (let j = 0; j < item[keyName.agency_country].length; j++) {
          let countryItem = item[keyName.agency_country][j];

          // isRights(true) is object
          if (isRights) {
            countryItem = item[keyName.agency_country][j]['country_id'];
          }

          showText += commFn.searchToString(authorizedCountryList.countryList, 'id', 'country_name_zh', countryItem);

          if (j < item[keyName.agency_country].length - 1) {
            showText += '、';
          }
        }
      }

      tmpArr.push(showText);
    }

    if (isRights) {
      setUiRightAgency(tmpArr[0]);
    } else {
      setUiContractAgencyList(tmpArr);
    }
  }

  // updateData
  useEffect(() => {
    // right agency
    convertAgencyFn(true, [song_rights]);
    // contract agency
    convertAgencyFn(false, contractSongList.autoCompleteByAuthorId);

    // check hasContractData
    if (song_rights.contract_song_code && contractSongList.autoCompleteByAuthorId && contractSongList.autoCompleteByAuthorId.length > 0) {
      let tmpOpts = contractSongList.autoCompleteByAuthorId.filter((fElem) => fElem.contract_code != song_rights.contract_song_code).map((elem) => ({ label: elem.contract_code, value: elem.contract_code }));

      if (tmpOpts.length > 0) {
        setHasContractData(true);

        // optContractCode
        setOptContractCode(tmpOpts);

        // new_contract_code
        form.setFieldsValue({ new_contract_code: tmpOpts[0]['value'] });
      } else {
        setHasContractData(false);
      }
    } else {
      setHasContractData(false);
    }
  }, [multiChangeId]);

  // save
  const onFinish = values => {
    setError([]);

    const selectContract = contractSongList.autoCompleteByAuthorId.find((elem) => elem.contract_code == values.new_contract_code);
    const saveObj = {
      // right
      song_code: song_rights.song_code,
      author_code: song_rights.author_code,
      contract_song_id: song_rights.contract_song_id,
      contract_song_code: song_rights.contract_song_code,
      // contract
      new_contract_song_id: selectContract.id,
      new_contract_song_code: selectContract.contract_code,
      op_company_id: selectContract.op_company_id,
      op_author_id: selectContract.op_author_id,
      sp_company_id: selectContract.sp_company_id,
      op_company_nickname_id: selectContract.op_nickname_id,
      sp_company_nickname_id: selectContract.sp_nickname_id,
      contract_start_date: selectContract.contract_start_date,
      contract_end_date: selectContract.contract_end_date,
      early_terminate_date: selectContract.early_terminate_date,
      agency_end: selectContract.contract_agency_end,
      authorized_area_type: selectContract.authorized_area_type,
      authorized_area_id: selectContract.authorized_area_id,
      country_ids: selectContract.country_ids,
      type: 'song'
    };

    dispatch({
      type: 'songRightsList/fetchTransferContract',
      payload: saveObj,
      callback: res => {
        let redirect = '/song';

        if (res && res != 'error') {
          redirect = `/song/adv/song_code/${saveObj.song_code}`;
          history.push(redirect);
          // for contract, message moves to page
          message.success('儲存成功');
        }
      }
    });

  }

  // confirm
  const showConfirm = () => {
    confirm({
      title: '',
      icon: '',
      content: '確定要取消修改嗎？',
      okText: '確定',
      cancelText: '取消',
      onOk() {
        history.push(`/song/adv/song_code/${song_rights.song_code}`);
      },
      onCancel() { },
    });
  }

  // valid behavior -----
  // fieldLabels
  const fieldLabels = {
    // contract_code: '合約編號',
  };

  // valid
  const getErrorInfo = errors => {
    const errorCount = errors.filter(item => item.errors.length > 0).length;
    // fix Form.List field
    const cusFields = [];
    const cusFieldId = '';

    if (!errors || errorCount === 0) {
      return null;
    }

    const scrollToField = fieldKey => {
      let labelNode = document.querySelector(`label[for="${fieldKey}"]`);

      if (fieldKey === cusFieldId) {
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

  // ui -----
  const changeContractText = (val) => {  // NOT FINISH
    setSelectContractIdx(contractSongList.autoCompleteByAuthorId.findIndex((elem) => elem.contract_code == val));
  }

  return (
    <Spin
      tip="Loading..."
      spinning={loadingMultiGetSongRightTransfer}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <PageHeaderWrapper
          title="單曲合約轉換"
        >
          <ComInfo />
          <Card
            bordered={false}
            className={`${styles.card} ${styles.cardTopSpace}`}
            title="原有合約"
          >
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
              >
                <ComOrgRight
                  rightData={song_rights}
                  agencyData={uiRightAgency}
                />
              </Col>
            </Row>
          </Card>
          <Card
            bordered={false}
            className={`${styles.card} ${styles.cardTopSpace}`}
            title="轉換合約"
          >
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
              >
                {
                  (hasContractData)
                    ? (
                      <Fragment>
                        <Form.Item
                          name="new_contract_code"
                        >
                          <Select
                            style={{ width: 200 }}
                            onChange={changeContractText}
                            options={optContractCode}
                          />
                        </Form.Item>
                        <ComContract
                          rightData={contractSongList.autoCompleteByAuthorId[selectContractIdx]}
                          agencyData={uiContractAgencyList[selectContractIdx]}
                        />
                      </Fragment>
                    )
                    : (
                      <Result
                        status="warning"
                        title="查無資料"
                      />
                    )
                }
              </Col>
            </Row>
          </Card>
        </PageHeaderWrapper>
        <FooterToolbar>
          {getErrorInfo(error)}
          <Button
            onClick={showConfirm}
          >取消</Button>
          <Button
            type="primary"
            className={styles.submitBtnWidth}
            onClick={() => form?.submit()}
            disabled={(hasContractData) ? false : true}
          >送出</Button>
        </FooterToolbar>
      </Form>
    </Spin >
  );
}

export default connect(({ authorizedAreaList, authorizedCountryList, contractSongList, songList, songRightsList, loading }) => ({
  authorizedAreaList,
  authorizedCountryList,
  contractSongList,
  songList,
  songRightsList,
  loadingMultiGetSongRightTransfer: loading.effects['songRightsList/fetchMultiGetSongRightTransfer'],
}))(update);