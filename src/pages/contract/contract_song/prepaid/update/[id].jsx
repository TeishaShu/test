import React, { useState, useEffect } from 'react';
import {
  Form,
  Card,
  Row,
  Col,
  InputNumber,
  Input,
  Select,
  Button,
  Modal,
  Popover,
  Spin,
  DatePicker,
  Checkbox,
  Result,
  Radio,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, history } from 'umi';
import { CloseCircleOutlined, PlusOutlined } from "@ant-design/icons";
import moment from 'moment';
import styles from '@/style/style.less';
import errorStyles from '@/style/error_style.less';
import ComInfo from '../components/ComInfo';
import ComTest from './components/ComTest';
import ComSong from './components/ComSong';
import FooterToolbar from '@/components/FooterToolbar';
import valid from '@/fn/valid';

const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

export const update = props => {
  const {
    dispatch,
    loadingMultiGetPrepaidInfo,
    loadingEditPrepaidForm,
    loadingAddPrepaidForm,
    loadingDeletePrepaid,
    contractSongList: { multiChangeId, info, prepaid, prepaidFormTmpSong },
    match,
  } = props;
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const [error, setError] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [viewLoading, setViewLoading] = useState(true);
  const dateFormat = 'YYYY-MM-DD';
  // song_coverage
  const [songCoverage, setSongCoverage] = useState('0');

  // api -----
  // getData
  const getData = (edit) => {
    dispatch({
      type: 'contractSongList/fetchMultiGetPrepaidInfo',
      payload: {
        isEdit: edit,
        contract_song_id: match.params.contract_id,
      }
    });
  }

  // mount
  useEffect(() => {
    let initObj = {
      payable_date: null,  // 應支付日期
      payment_date: null,  // 實際支付日期
      debited_date: [null, null],  // 可扣抵區間 (debited_start_date, debited_end_date) (only for ui)
      before_tax: '',  // 台幣金額 (未稅)
      album_coverage: '0',  // 適用專輯
      specified_albums: [{ album_id: '', album_code: '', album_name_zh: '' }],
      song_coverage: '',  // 適用範圍 (1: 全部, 2: 指定)
      specified_songs: [{ id: '', song_name: '', song_code: '' }],
    };

    // mount song
    addSong();

    form.setFieldsValue({
      ...initObj
    });

    if (match.path.toString().indexOf('/contract/contract_song/prepaid/update/contract_id/:contract_id/prepaid_id/:prepaid_id') >= 0) {
      setIsEdit(true);
      getData(true);
    } else {
      setIsEdit(false);
      getData(false);
    }
  }, [match.params.contract_id]);

  // updateData
  useEffect(() => {
    setViewLoading(true);

    if (match.params.prepaid_id) {
      let findData = (prepaid.data_list) ? (prepaid.data_list.filter((elem) => elem.id == match.params.prepaid_id)) : ([]);
      let convertData = {};

      if (findData && findData.length > 0) {
        convertData = findData[0];

        // 應支付日期
        form.setFieldsValue({
          payable_date: (typeof (convertData.payable_date) == 'string') ? (convertData.payable_date != '' ? moment(convertData.payable_date) : null) : convertData.payable_date
        });

        // 實際支付日期
        form.setFieldsValue({
          payment_date: (typeof (convertData.payment_date) == 'string') ? (convertData.payment_date != '' ? moment(convertData.payment_date) : null) : convertData.payment_date
        });

        // 可扣抵區間
        let tmpDebitedStartDate = (typeof (convertData.debited_start_date) == 'string') ? (convertData.debited_start_date != '' ? moment(convertData.debited_start_date) : null) : convertData.debited_start_date;
        let tmpDebitedEndDate = (typeof (convertData.debited_end_date) == 'string') ? (convertData.debited_end_date != '' ? moment(convertData.debited_end_date) : null) : convertData.debited_end_date;
        form.setFieldsValue({
          debited_date: [tmpDebitedStartDate, tmpDebitedEndDate]
        });

        // 台幣金額 (未稅)
        form.setFieldsValue({
          before_tax: convertData.before_tax
        });
      }
    }

    setViewLoading(false);
  }, [multiChangeId]);

  // save
  const onFinish = values => {
    setError([]);

    let formObj = Object.assign({}, values);
    let saveObj = {
      contract_song_id: null,
      contract_prepaid_id: null,  // (optional, edit 才有)
      payable_date: null,　　// 應支付日期
      payment_date: null,　　// 實際支付日期
      debited_start_date: null,　// 可扣抵區間 - 開始
      debited_end_date: null,　　// 可扣抵區間 - 結束
      before_tax: null,　　// 台幣金額 (未稅)
    };

    // contract_song_id
    saveObj.contract_song_id = match.params.contract_id;

    // contract_prepaid_id
    if (isEdit) {
      saveObj.contract_prepaid_id = match.params.prepaid_id;
    }

    // 應支付日期
    if (formObj.payable_date && typeof (formObj.payable_date) == 'object') {
      saveObj.payable_date = form.getFieldValue()['payable_date'].format(dateFormat);
    }

    // 實際支付日期
    if (formObj.payment_date && typeof (formObj.payment_date) == 'object') {
      saveObj.payment_date = form.getFieldValue()['payment_date'].format(dateFormat);
    }

    // 可扣抵區間 - 開始
    if (formObj.debited_date && formObj.debited_date[0] && typeof (formObj.debited_date[0]) == 'object') {
      saveObj.debited_start_date = form.getFieldValue()['debited_date'][0].format(dateFormat);
    }

    // 可扣抵區間 - 結束
    if (formObj.debited_date && formObj.debited_date[1] && typeof (formObj.debited_date[1]) == 'object') {
      saveObj.debited_end_date = form.getFieldValue()['debited_date'][1].format(dateFormat);
    }

    // 台幣金額 (未稅)
    saveObj.before_tax = parseFloat(formObj.before_tax);

    // ONLY FOR TEST
    saveObj.song_coverage = '2';
    saveObj.specified_songs = {
      new_song_ids: ['2545', '2544']
    };

    console.log(saveObj);
    console.log(isEdit);

    dispatch({
      type: (isEdit) ? ('contractSongList/fetchEditPrepaidForm') : ('contractSongList/fetchAddPrepaidForm'),
      payload: saveObj,
      callback: res => {
        if (res && res != 'error') {
          history.push(`/contract/contract_song/adv/id/${match.params.contract_id}`);
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
        history.push(`/contract/contract_song/adv/id/${match.params.contract_id}`);
      },
      onCancel() { },
    });
  }

  // removeData
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
  const removeData = () => {
    dispatch({
      type: 'contractSongList/fetchDeletePrepaid',
      payload: {
        contract_song_id: match.params.contract_id,
        contract_prepaid_id: match.params.prepaid_id,
      },
      callback: res => {
        if (res && res != 'error') {
          history.push(`/contract/contract_song/adv/id/${match.params.contract_id}`);
        }
      }
    });
  }

  // addSong
  const addSong = (obj) => {
    dispatch({
      type: 'contractSongList/setPrepaidFormTmpSong',
      payload: obj,
    });
  }

  // valid behavior -----
  // fieldLabels
  const fieldLabels = {
    // contract_song_code: '合約編號',
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

      // fix 'song_rights_type_id', 'song_rights_type_custom'
      if (fieldKey == 'song_rights_type_id' || fieldKey == 'song_rights_type_custom') {
        fieldKey = 'song_rights_type_radio_id';
        labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      }

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
  // PageHeaderWrapper(extra) - buttonsList
  const buttonsList = (
    <Button onClick={showRemoveConfirm}>刪除</Button>
  );

  return (
    <Spin
      tip="Loading..."
      spinning={loadingDeletePrepaid || loadingEditPrepaidForm || loadingAddPrepaidForm || loadingMultiGetPrepaidInfo}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <PageHeaderWrapper
          title={isEdit ? '詞曲發行合約 - 修改預付' : '詞曲發行合約 - 新增預付'}
          extra={isEdit ? buttonsList : ''}
        >
          <ComInfo />
          <Card
            bordered={false}
            className={styles.card}
            // className={`${styles.card} ${styles.cardTopSpace}`}
            title="權利/合約"
          >
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="payable_date"
                  label="應支付日期"
                >
                  <DatePicker
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="payment_date"
                  label="實際支付日期"
                >
                  <DatePicker
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  className={styles.addRequiredStar}
                  name="debited_date"
                  label="可扣抵區間"
                  rules={[
                    {
                      validator(rule, values, callback) {
                        if (!form.getFieldValue()['debited_date'] || !valid.checkDateRequired(form.getFieldValue()['debited_date'][0]) || !valid.checkDateRequired(form.getFieldValue()['debited_date'][1])) {
                          callback('此欄位為必填');
                        } else {
                          callback();
                        }
                      }
                    },
                    {
                      validator(rule, values, callback) {
                        // 可扣抵期別開始日 - 合約開始日 < 0 則出錯誤
                        if (valid.checkDateRequired(form.getFieldValue()['debited_date'][0]) && (info && info.contract_start_date) && new Date(form.getFieldValue()['debited_date'][0].format(dateFormat)) - new Date(info.contract_start_date) < 0) {
                          callback('\'可扣抵期別開始日\' 須大於或等於 \'合約開始日\'');
                        } else {
                          callback();
                        }
                      }
                    },
                  ]}
                >
                  <RangePicker
                    format={dateFormat}
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="author_id"
                  label="簽約對象"
                >
                  <Select />
                  {/* TODO: 要放詞曲合約取得的簽約對象當選項 */}
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="before_tax"
                  label="台幣金額 (未稅)"
                  rules={[
                    { required: true, message: '此欄位為必填' },
                    {
                      validator(rule, values, callback) {
                        if (!valid.checkPostiveNumberAndZero(values)) {
                          callback(valid.checkPostiveNumberAndZero_msg);
                        } else {
                          callback();
                        }
                      }
                    }
                  ]}
                >
                  <InputNumber
                    style={{ width: '100%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col xs={24}>
                <div className={styles.contentBBd} />
              </Col>
            </Row>
          </Card>


          {/* ONLY FOR TEST */}
          <Card
            bordered={false}
            // className={`${styles.card} ${styles.cardTopSpace}`}
            className={`${styles.card}`}
            title="扣抵範圍"
          >
            <Row gutter={[64, 24]}>
              <Col xs={24}>
                <Form.Item
                  name="test1"
                >
                  <Radio.Group
                    options={[
                      { value: '1', label: '全部' },
                      { value: '2', label: '限定歌曲' },
                    ]}
                    onChange={() => {
                      console.log('change');
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[12, 24]}>
              <Col xs={16}>
                <Form.Item
                  label="匯入專輯歌曲"
                >
                  <ComTest />
                </Form.Item>
              </Col>
              <Col
                xs={8}
                style={{ textAlign: 'relative' }}
              >
                <Button
                  className={styles.om_sp_m_lt}
                  // onClick={setData}
                  style={{ position: 'absolute', left: '0', bottom: '24px' }}
                >
                  匯入
                </Button>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                className={styles.om_overflow_auto}
                style={{ paddingBottom: '24px' }}
              >
                <p>限定歌曲</p>
                <table className={styles.formTable}>
                  <thead>
                    <tr>
                      <th>歌曲編號</th>
                      <th>歌曲名稱</th>
                      <th>ISWC</th>
                      <th>&nbsp;</th>
                      <th>&nbsp;</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      prepaidFormTmpSong.map((elem, idx) => (
                        <ComSong key={idx} />
                      ))
                    }
                  </tbody>
                </table>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col xs={24}>
                <Button
                  type="dashed"
                  block
                  onClick={() => {
                    addSong({
                      id: '',
                      song_code: '',
                      song_name: '',
                      iswc: '',
                      info: '',
                    });
                  }}>
                  <PlusOutlined />新增
                </Button>
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
          // disabled={(!isEdit) ? false : true}
          >送出</Button>
        </FooterToolbar>
      </Form>
    </Spin >
  );
}

export default connect(({ contractSongList, loading }) => ({
  contractSongList,
  loadingMultiGetPrepaidInfo: loading.effects['contractSongList/fetchMultiGetPrepaidInfo'],
  loadingEditPrepaidForm: loading.effects['contractSongList/fetchEditPrepaidForm'],
  loadingAddPrepaidForm: loading.effects['contractSongList/fetchAddPrepaidForm'],
  loadingDeletePrepaid: loading.effects['contractSongList/fetchDeletePrepaid'],
}))(update);