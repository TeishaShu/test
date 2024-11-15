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
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, history } from 'umi';
import { CloseCircleOutlined } from "@ant-design/icons";
import moment from 'moment';
import styles from '@/style/style.less';
import errorStyles from '@/style/error_style.less';
import ComInfo from './components/ComInfo';
import FooterToolbar from '@/components/FooterToolbar';
import FormAlbums from '../../components/FormAlbums';
import FormIsrcs from '../../components/FormIsrcs';
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
    contractAuthorList: { multiChangeId, info, prepaid },
    match,
  } = props;
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const [error, setError] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [viewLoading, setViewLoading] = useState(true);
  const dateFormat = 'YYYY-MM-DD';
  // hasData
  const [hasData, setHasData] = useState(true);
  // album_coverage, specified_albums
  const [albumsSelectVal, setAlbumsSelectVal] = useState('0');
  const [albumsSelectList, setAlbumsSelectList] = useState([]);
  const [albumsCodeList, setAlbumsCodeList] = useState([]);
  // song_coverage, specified_songs
  const [songsSelectVal, setSongsSelectVal] = useState('0');
  const [songsSelectList, setSongsSelectList] = useState([]);
  const [songsCodeList, setSongsCodeList] = useState([]);

  // api -----
  // getData
  const getData = (edit) => {
    dispatch({
      type: 'contractAuthorList/fetchMultiGetPrepaidInfo',
      payload: {
        isEdit: edit,
        contract_author_id: match.params.contract_id,
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
      song_coverage: '0',  // 適用單曲/ISRC
      specified_songs: [{ isrc_id: '', song_name: '', singer: '', isrc: '' }],
    };

    form.setFieldsValue({
      ...initObj
    });

    if (match.path.toString().indexOf('/contract/contract_author/prepaid/contract_id/:contract_id/prepaid_id/:prepaid_id') >= 0) {
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

        // 適用專輯 -----
        // album_coverage
        form.setFieldsValue({
          album_coverage: (convertData.album_coverage) ? (convertData.album_coverage) : '0'
        });
        setAlbumsSelectVal((convertData.album_coverage) ? (convertData.album_coverage) : '0');
        // specified_albums
        let tmpPrepaidSpecifiedAlbums = [];
        let tmpPrepaidSpAlbums = [];  // option
        let tmpPrepaidSpAlbumCode = [];  // code
        if (convertData.album_coverage == '2' && convertData.specified_albums.length > 0) {
          for (let i = 0; i < convertData.specified_albums.length; i++) {
            let alItem = convertData.specified_albums[i];
            tmpPrepaidSpecifiedAlbums.push({ ...alItem });
            tmpPrepaidSpAlbums.push([{ id: alItem.album_id, album_name_zh: alItem.album_name_zh, album_code: alItem.album_code }]);
            tmpPrepaidSpAlbumCode.push(alItem.album_code);
          }
        } else {
          tmpPrepaidSpecifiedAlbums.push({ album_id: '', album_code: '', album_name_zh: '' });
          tmpPrepaidSpAlbums.push([{ id: '', album_name_zh: '', album_code: '' }]);
          tmpPrepaidSpAlbumCode.push('');
        }
        setAlbumsSelectList(tmpPrepaidSpAlbums);
        setAlbumsCodeList(tmpPrepaidSpAlbumCode);
        form.setFieldsValue({
          specified_albums: tmpPrepaidSpecifiedAlbums
        });


        // 適用單曲/ISRC -----
        // song_coverage
        form.setFieldsValue({
          song_coverage: (convertData.song_coverage) ? (convertData.song_coverage) : '0'
        });
        setSongsSelectVal((convertData.song_coverage) ? (convertData.song_coverage) : '0');
        // specified_songs
        let tmpSpecfiedSongs = [];
        let tmpSongsSelectList = [];  // option
        let tmpSongsCodeList = [];  // code
        if (convertData.song_coverage == '2' && convertData.specified_songs.length > 0) {
          for (let i = 0; i < convertData.specified_songs.length; i++) {
            let soItem = convertData.specified_songs[i];
            tmpSpecfiedSongs.push({ ...soItem });
            tmpSongsSelectList.push([{ isrc_id: soItem.isrc_id, song_name: soItem.song_name, singer: soItem.singer, isrc: soItem.isrc }]);
            tmpSongsCodeList.push(`${soItem.singer} | ${soItem.isrc}`);
          }
        } else {
          tmpSpecfiedSongs.push({ isrc_id: '', song_name: '', singer: '', isrc: '' });
          tmpSongsSelectList.push([{ isrc_id: '', song_name: '', singer: '', isrc: '' }]);
          tmpSongsCodeList.push('');
        }
        setSongsSelectList(tmpSongsSelectList);
        setSongsCodeList(tmpSongsCodeList);
        form.setFieldsValue({
          specified_songs: tmpSpecfiedSongs
        });
        setHasData(true);
      } else {
        // 顯示查無資料
        setHasData(false);
      }
    } else {
      // 適用專輯
      setAlbumsSelectList([[{ id: '', album_name_zh: '', album_code: '' }]]);
      setAlbumsCodeList(['']);

      // 適用單曲/ISRC
      setSongsSelectList([[{ isrc_id: '', song_name: '', singer: '', isrc: '' }]]);
      setSongsCodeList(['']);
      setHasData(true);
    }

    setViewLoading(false);
  }, [multiChangeId]);

  // save
  const onFinish = values => {
    setError([]);

    let formObj = Object.assign({}, values);
    let saveObj = {
      contract_author_id: null,
      contract_prepaid_id: null,  // (optional, edit 才有)
      payable_date: null,　　// 應支付日期
      payment_date: null,　　// 實際支付日期
      debited_start_date: null,　// 可扣抵區間 - 開始
      debited_end_date: null,　　// 可扣抵區間 - 結束
      before_tax: null,　　// 台幣金額 (未稅)
      album_coverage: null,  // 適用專輯 - 選項
      specified_albums: {　　// 適用專輯
        new_album_ids: [],
        delete_ids: []
      },
      song_coverage: null,　　// 適用單曲/ISRC - 選項
      specified_songs: {  // 適用單曲/ISRC
        new_isrc_ids: [],
        delete_ids: []
      }
    };


    // contract_author_id
    saveObj.contract_author_id = match.params.contract_id;

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

    // 適用專輯 - 選項
    saveObj.album_coverage = formObj.album_coverage;
    if (saveObj.album_coverage == '2') {
      let checkAlbums = formObj.specified_albums.filter((aElem) => aElem.album_name_zh && (!aElem.is_delete || aElem.is_delete == '0'));

      if (checkAlbums.length == 0) {
        saveObj.album_coverage = '0';
      }
    }

    // 適用專輯
    for (let i = 0; i < formObj.specified_albums.length; i++) {
      let alItem = formObj.specified_albums[i];
      if (saveObj.album_coverage == '2') {
        if (alItem.id && (alItem.is_delete == '1' || alItem.is_edit == '1')) {
          saveObj.specified_albums.delete_ids.push(alItem.id);
        }

        if (alItem.is_edit == '1' && alItem.album_id) {
          saveObj.specified_albums.new_album_ids.push(alItem.album_id);
        }
      } else {
        if (alItem.id) {
          saveObj.specified_albums.delete_ids.push(alItem.id);
        }
      }
    }

    // 適用單曲/ISRC - 選項
    saveObj.song_coverage = formObj.song_coverage;
    if (saveObj.song_coverage == '2') {
      let checkSongs = formObj.specified_songs.filter((aElem) => aElem.song_name && (!aElem.is_delete || aElem.is_delete == '0'));

      if (checkSongs.length == 0) {
        saveObj.song_coverage = '0';
      }
    }

    // 適用單曲/ISRC
    for (let i = 0; i < formObj.specified_songs.length; i++) {
      let soItem = formObj.specified_songs[i];
      if (saveObj.song_coverage == '2') {
        if (soItem.id && (soItem.is_delete == '1' || soItem.is_edit == '1')) {
          saveObj.specified_songs.delete_ids.push(soItem.id);
        }

        if (soItem.is_edit == '1' && soItem.isrc_id) {
          saveObj.specified_songs.new_isrc_ids.push(soItem.isrc_id);
        }
      } else {
        if (soItem.id) {
          saveObj.specified_songs.delete_ids.push(soItem.id);
        }
      }
    }

    dispatch({
      type: (isEdit) ? ('contractAuthorList/fetchEditPrepaidForm') : ('contractAuthorList/fetchAddPrepaidForm'),
      payload: saveObj,
      callback: res => {
        if (res && res != 'error') {
          history.push(`/contract/contract_author/adv/${match.params.contract_id}`);
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
        history.push(`/contract/contract_author/adv/${match.params.contract_id}`);
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
      type: 'contractAuthorList/fetchDeletePrepaid',
      payload: {
        contract_author_id: match.params.contract_id,
        contract_prepaid_id: match.params.prepaid_id,
      },
      callback: res => {
        if (res && res != 'error') {
          history.push(`/contract/contract_author/adv/${match.params.contract_id}`);
        }
      }
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
          title={isEdit ? '藝人發行合約 - 修改預付' : '藝人發行合約 - 新增預付'}
          extra={isEdit ? buttonsList : ''}
        >
          <ComInfo />
          {
            (!isEdit || hasData)
              ? (
                <Card
                  bordered={false}
                  className={`${styles.card} ${styles.cardTopSpace}`}
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
                              if (valid.checkDateRequired(form.getFieldValue()['debited_date'][0]) && (info && info.basic_info && info.basic_info.contract_start_date) && new Date(form.getFieldValue()['debited_date'][0].format(dateFormat)) - new Date(info.basic_info.contract_start_date) < 0) {
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
                  <Row gutter={[64, 24]}>
                    <Col
                      xs={24}
                      lg={8}
                    >
                      <FormAlbums
                        form={form}
                        isSelectName="album_coverage"
                        isName="specified_albums"
                        isLabel="適用專輯"
                        isList={albumsSelectList}
                        setIsList={setAlbumsSelectList}
                        selectVal={albumsSelectVal}
                        setSelectVal={setAlbumsSelectVal}
                        isCodeList={albumsCodeList}
                        setIsCodeList={setAlbumsCodeList}
                      />
                    </Col>
                    <Col
                      xs={24}
                      lg={8}
                    >
                      <FormIsrcs
                        form={form}
                        isSelectName="song_coverage"
                        isName="specified_songs"
                        isLabel="適用單曲/ISRC"
                        isList={songsSelectList}
                        setIsList={setSongsSelectList}
                        selectVal={songsSelectVal}
                        setSelectVal={setSongsSelectVal}
                        isCodeList={songsCodeList}
                        setIsCodeList={setSongsCodeList}
                      />
                    </Col>
                  </Row>
                </Card>
              )
              : (
                <Card>
                  <Result
                    status="warning"
                    title="查無資料"
                  />
                </Card>
              )
          }
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
            disabled={(!isEdit || hasData) ? false : true}
          >送出</Button>
        </FooterToolbar>
      </Form>
    </Spin >
  );
}

export default connect(({ contractAuthorList, loading }) => ({
  contractAuthorList,
  loadingMultiGetPrepaidInfo: loading.effects['contractAuthorList/fetchMultiGetPrepaidInfo'],
  loadingEditPrepaidForm: loading.effects['contractAuthorList/fetchEditPrepaidForm'],
  loadingAddPrepaidForm: loading.effects['contractAuthorList/fetchAddPrepaidForm'],
  loadingDeletePrepaid: loading.effects['contractAuthorList/fetchDeletePrepaid'],
}))(update);