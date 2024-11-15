import React, { useState, useEffect } from 'react';
import {
  Form,
  Card,
  Row,
  Col,
  Input,
  Radio,
  Checkbox,
  Select,
  Button,
  Modal,
  Popover,
  Spin,
  DatePicker,
  notification,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, history } from 'umi';
import { CloseCircleOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import moment from 'moment';
import FormSong from './components/FormSong';
import FormAuthorStageName from './components/FormAuthorStageName';
import FormTape from './components/FormTape';
import FormArea from '@/components/FormArea';
import FormBelongAlbum from './components/FormBelongAlbum';
import FooterToolbar from '@/components/FooterToolbar';
import styles from '@/style/style.less';
import errorStyles from '@/style/error_style.less';
import valid from '@/fn/valid';
import commFn from '@/fn/comm';

const { Option } = Select;
const { TextArea } = Input;

export const update = props => {
  const {
    loadingMultiGetISRCInfo,
    loadingAddIsrcForm,
    loadingEditIsrcForm,
    dispatch,
    match,
    authorizedAreaList,
    authorizedCountryList,
    isrcList: { multiChangeId, optDataType, info },
    isrcTypeList,
  } = props;
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const [error, setError] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  // isrc
  const [changeIsrc, setChangeIsrc] = useState('');
  // belong_isrc
  const [changeBelongIsrc, setChangeBelongIsrc] = useState('');
  // song_id
  const [songIdList, setSongIdList] = useState([]);
  // singer
  const [singerList, setSingerList] = useState([]);
  // tape
  const [tapeList, setTapeList] = useState([]);
  const [tapeCodeList, setTapeCodeList] = useState([]);
  // release_date
  const dateFormat = 'YYYY-MM-DD';
  // belong_album_id
  const [belongAlbumList, setBelongAlbumList] = useState([]);
  const [belongAlbumCountry, setBelongAlbumCountry] = useState('');
  const [belongAlbumCode, setBelongAlbumCode] = useState('');
  // for release_area_type, release_area_id, release_area_name, release_country
  const [initReleaseArea, setInitReleaseArea] = useState(true);
  const [initReleaseAreaList, setInitReleaseAreaList] = useState([]);
  const [areaCountry2Disabled, setAreaCountry2Disabled] = useState(false);

  // api -----
  // getData
  const getData = (pageId, songCode) => {
    dispatch({
      type: 'isrcList/fetchMultiGetISRCInfo',
      payload: {
        id: pageId,
        keyword: songCode
      },
      callback: (result) => {
        if (songCode && result && result.length > 0) {
          setSongIdList([{
            id: result[0].id,
            song_name: (result[0].song_name) ? (result[0].song_name) : '',
            song_code: (result[0].song_code) ? (result[0].song_code) : ''
          }]);

          form.setFieldsValue({
            song_id: result[0].id,
            song_name: (result[0].song_name) ? (result[0].song_name) : '',
            song_code: (result[0].song_code) ? (result[0].song_code) : '',
          });
        } else {
          setSongIdList([]);
        }
      }
    });
  }

  // mount
  useEffect(() => {
    let initObj = {
      isrc: '',
      song_id: '',
      song_name: '',
      song_code: '',
      version: '',
      belong_isrc: '',
      belong_isrc_show: false,
      isrc_type_id: '',
      isrc_type: '',
      isrc_type_ui: { value: '', label: '' },  // only for ui
      author_id: '',  // only for add setting json
      singer: '',
      tape: [
        {
          company_id: '',
          company_nickname_id: '',
        }
      ],
      data_type: '',
      arranger: '',
      producer: '',
      director: '',
      length: '',
      release_date: null,
      belong_album_id: '',
      is_settle: '',
      release_area_type: '2',
      release_area_id: '',
      release_country: [],
      release_area_type_radio: '0',  // only for ui
      release_area_id_input_countrys: [],  // only for ui
      release_area_type_select: '2',  // only for ui
      release_area_id_input2_countrys: [],  // only for ui
      notes: '',
    };

    // init object
    form.setFieldsValue({
      ...initObj
    });

    if (match.params.id) {
      setIsEdit(true);
      getData(match.params.id);
    } else if (match.params.song_code) {
      setIsEdit(false);
      getData(null, match.params.song_code);
    } else {
      setIsEdit(false);
      getData();
    }
  }, [match.params.id]);

  // updateData
  useEffect(() => {
    let obj = Object.assign({}, info);

    if (isEdit) {
      // belong_isrc_show
      obj.belong_isrc_show = commFn.convertToBool(obj.belong_isrc_show);

      // song_id - songIdList
      if (obj.song_id) {
        setSongIdList([{
          id: obj.song_id,
          song_name: (obj.song_name) ? (obj.song_name) : '',
          song_code: (obj.song_code) ? (obj.song_code) : ''
        }]);
      } else {
        setSongIdList([]);
      }

      // isrc_type_ui
      if (obj.isrc_type_id) {
        obj.isrc_type_ui = { value: obj.isrc_type_id, label: obj.isrc_type };
      } else {
        obj.isrc_type_ui = { value: '', label: '' };
      }

      // singer - singerList
      setSingerList([]);

      // tape - tapeList, tapeCodeList
      let tmpTapeList = [];
      let tmpTapeCodeList = [];
      if (isEdit && obj.tape.length > 0 && obj.tape[0].id) {
        for (let i = 0; i < obj.tape.length; i++) {
          let item = obj.tape[i];

          tmpTapeList.push([{
            id: item.company_nickname_id,
            company_id: item.company_id,
            nickname: item.company_nickname,
            company_code: item.company_code
          }]);
          tmpTapeCodeList.push(item.company_code);
        }
      }

      if (tmpTapeList.length == 0) {
        obj.tape = [
          {
            company_id: '',
            company_nickname_id: '',
          }
        ];
      };

      setTapeList(tmpTapeList);
      setTapeCodeList(tmpTapeCodeList);

      // release_date
      let tmpReleaseDate = (typeof (obj.release_date) == 'string' && obj.release_date != '') ? (moment(obj.release_date)) : null;
      obj.release_date = tmpReleaseDate;

      // belong_album_id - belongAlbumList, belongAlbumCountry, belongAlbumCode
      if (obj.belong_album_id) {
        setBelongAlbumList([{
          id: obj.belong_album_id,
          album_name_zh: obj.album_name,
          album_code: obj.album_code,
          release_country: obj.album_release_country
        }]);
        setBelongAlbumCountry(obj.album_release_country);
        setBelongAlbumCode(obj.album_code);
      } else {
        setBelongAlbumList([]);
        setBelongAlbumCountry('');
        setBelongAlbumCode('');
      }

      // release_area_type, release_area_id, release_country, release_area_type_radio, release_area_id_input_countrys, release_area_type_select, release_area_id_input2_countrys - initReleaseArea, initReleaseAreaList, areaCountry2Disabled
      let tempCountrysArr = [];
      if (obj.release_area_type == '1') {
        obj.release_area_type_radio = '1';
        obj.release_area_type_select = '2';
      } else {
        obj.release_area_type_radio = '0';
        obj.release_area_type_select = (obj.release_area_type) ? obj.release_area_type : '2';
      }
      setAreaCountry2Disabled(obj.release_area_type_select == '2' ? true : false);
      setInitReleaseArea(true);
      if (obj.release_area_id && obj.release_area_name) {
        setInitReleaseAreaList([{ id: obj.release_area_id, area_name: obj.release_area_name }]);
      } else {
        setInitReleaseAreaList([]);
      }
      obj.release_area_id_input_countrys = [];
      obj.release_area_id_input2_countrys = [];
      if (obj.release_area_type && obj.release_area_type != '2' && obj.release_country && obj.release_country.length > 0) {
        for (let i = 0; i < obj.release_country.length; i++) {
          tempCountrysArr.push(obj.release_country[i].country_id);
        }
        if (obj.release_area_type == '1') {
          obj.release_area_id_input_countrys = tempCountrysArr;
        } else {
          obj.release_area_id_input2_countrys = tempCountrysArr;
        }
      }

      form.setFieldsValue({
        ...obj,
      });
    } else {
      setInitReleaseArea(true);
      setAreaCountry2Disabled(form.getFieldValue()['release_area_type_select'] == '2' ? true : false);
    }
  }, [multiChangeId]);

  // save
  const onFinish = values => {
    setViewLoading(false);
    setError([]);

    let saveObj = Object.assign({}, values);

    // id
    if (isEdit) {
      saveObj.id = match.params.id;
    }

    // author_id
    if (isEdit) {
      delete saveObj.author_id;
    }

    // belong_isrc_show
    saveObj.belong_isrc_show = commFn.convertBoolToNumStr(saveObj.belong_isrc_show);

    // convert to 'isrc_type_id', delete 'isrc_type_ui
    saveObj.isrc_type_id = (saveObj.isrc_type_ui.value) ? saveObj.isrc_type_ui.value : '';
    delete saveObj.isrc_type_ui;

    // tape, valid tape
    let checkTapeNum = 0;
    for (let i = 0; i < saveObj.tape.length; i++) {
      let item = saveObj.tape[i];

      delete item.company_code;
      delete item.company_name;
      delete item.company_nickname;
      delete item.isrc_id;

      if (isEdit && item.id && !item.company_nickname_id) {
        item.is_delete = '1';
      } else if (!item.id && !item.company_nickname_id) {
        saveObj.tape.splice(i, 1);
        i--;
      } else if (!item.is_delete || item.is_delete == '0') {
        checkTapeNum++;
      }
    }
    if (checkTapeNum < 1) {
      notification.error({
        duration: 0,
        icon: <ExclamationCircleFilled style={{ color: '#F9B006' }} />,
        description: '母帶歸屬請至少填一筆',
        message: '"母帶歸屬" 錯誤',
      });
      return;
    }

    // release_date
    if (saveObj.release_date && typeof (saveObj.release_date) == 'object') {
      saveObj.release_date = form.getFieldValue()['release_date'].format(dateFormat);
    } else {
      saveObj.release_date = '';
    }

    // convert 'release_area_type_radio', 'release_area_id_input_countrys', 'release_area_type_select', 'release_area_id_input2_countrys' to 'release_area_type', 'release_area_id', 'release_country'
    if (saveObj.release_area_type_radio == '1') {
      saveObj.release_area_type = '1';
      saveObj.release_area_id = '';
    } else {
      saveObj.release_area_type = saveObj.release_area_type_select;
    }

    delete saveObj.release_area_type_radio;
    delete saveObj.release_area_type_select;

    // convert 'release_area_id_input_countrys', 'release_area_id_input2_countrys' to 'release_country'...
    let OrgCountryList = info.release_country ? info.release_country.slice() : [];
    let tmpCountryList = [];

    if (saveObj.release_area_type == '1') {
      tmpCountryList = saveObj.release_area_id_input_countrys;
    } else if (saveObj.release_area_type != '2') {
      tmpCountryList = saveObj.release_area_id_input2_countrys;
    }

    if (isEdit) {
      for (let i = 0; i < OrgCountryList.length; i++) {
        OrgCountryList[i].is_delete = '1';
      }

      if (saveObj.release_area_type != '2') {
        for (let i = 0; i < tmpCountryList.length; i++) {
          let findItem = false;
          for (let j = 0; j < OrgCountryList.length; j++) {
            if (tmpCountryList[i] == OrgCountryList[j].country_id) {
              delete OrgCountryList[j].is_delete;
              findItem = true;
              break;
            }
          }
          if (!findItem) {
            OrgCountryList.push({ country_id: tmpCountryList[i] });
          }
        }
      }

      saveObj.release_country = OrgCountryList;
    } else {
      saveObj.release_country = tmpCountryList;
    }

    delete saveObj.release_area_id_input_countrys;
    delete saveObj.release_area_id_input2_countrys;

    // obj - null, undefined to string...
    for (let key in saveObj) {
      if (saveObj[key] == null || saveObj[key] == undefined) {
        saveObj[key] = '';
      }
    }

    // set api
    dispatch({
      type: (isEdit) ? 'isrcList/fetchEditIsrcForm' : 'isrcList/fetchAddIsrcForm',
      payload: saveObj,
      callback: (result) => {
        let redirect = '/isrc';

        if (result != '' && result != 'error') {
          if (!isEdit) {
            redirect = `/isrc/adv/${result}`;
          } else {
            redirect = `/isrc/adv/${match.params.id}`;
          }

          history.push(redirect);
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
        if (isEdit) {
          history.push(`/isrc/adv/${match.params.id}`);
        } else {
          history.push('/isrc');
        }
      },
      onCancel() { },
    });
  }

  // valid behavior -----
  // fieldLabels
  const fieldLabels = {
    isrc: 'ISRC',
    song_id: '歌曲名稱',
    belong_isrc: '模擬 ISRC',
    isrc_type_ui: '出版型態',
    singer: '演唱人',
    data_type: '呈現型式',
    is_settle: '新媒體結算 - 錄音',
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
    // console.log('Failed:', errorInfo);
    setViewLoading(false);
    setError(errorInfo.errorFields);
  };

  // ui -----
  const onFieldsChange = () => {
    let formVal = form.getFieldsValue();

    // belong_isrc_show
    if (!formVal.belong_isrc) {
      form.setFieldsValue({ belong_isrc_show: false });
    }
  }

  return (
    <Spin
      tip="Loading..."
      spinning={loadingMultiGetISRCInfo || loadingAddIsrcForm || loadingEditIsrcForm || viewLoading}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        onFieldsChange={onFieldsChange}
      >
        <PageHeaderWrapper
          title={isEdit ? '編輯 ISRC' : '新增 ISRC'}
        >
          <Card
            bordered={false}
            className={styles.card}
            title="基本資料"
          >
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="isrc"
                  label={fieldLabels.isrc}
                  hasFeedback={(!isEdit && changeIsrc && changeIsrc.length == 12) ? true : false}
                  rules={[
                    { required: true, message: '此欄位為必填' },
                    {
                      validator(rule, values, callback) {
                        if (!isEdit && values && values.length != 12) {
                          callback('請輸入 12 個字元');
                        } else {
                          callback();
                        }
                      }
                    },
                    {
                      validator(rule, values, callback) {
                        if (!isEdit && values && values.length == 12) {
                          fetch(`${window.FRONTEND_WEB}/isrc/check_isrc_exists?isrc=${values}&type=isrc`).then(
                            res => res.json()
                          ).then(jsonRes => {
                            if (jsonRes.data && jsonRes.data.toLowerCase() == 'ok') {
                              callback();
                            } else {
                              callback('ISRC 代碼重複');
                            }
                          }).catch(err => {
                            callback();
                          });
                        } else {
                          callback();
                        }
                      }
                    }
                  ]}
                >
                  <Input
                    disabled={(isEdit) ? true : false}
                    onChange={(e) => {
                      setChangeIsrc(e.target.value);
                    }}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <FormSong
                  form={form}
                  isLabel={fieldLabels.song_id}
                  isName="song_id"
                  isSelectText="song_name"
                  isList={songIdList}
                  setIsList={setSongIdList}
                  isCodeName="song_code"
                />
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="song_code"
                  label="歌曲編號"
                >
                  <Input disabled={true} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
                style={{ display: (isEdit) ? 'block' : 'none' }}
              >
                <Form.Item
                  name="belong_isrc"
                  label="模擬 ISRC"
                  style={{ marginBottom: 0 }}
                  hasFeedback={(isEdit && changeBelongIsrc && changeBelongIsrc.length == 12) ? true : false}
                  rules={[
                    {
                      validator(rule, values, callback) {
                        if (isEdit && values && values.length != 12) {
                          callback('請輸入 12 個字元');
                        } else {
                          callback();
                        }
                      }
                    },
                    {
                      validator(rule, values, callback) {
                        if (isEdit && values && values.length == 12) {
                          fetch(`${window.FRONTEND_WEB}/isrc/check_isrc_exists?isrc=${values}&type=belong_isrc&id=${match.params.id}`).then(
                            res => res.json()
                          ).then(jsonRes => {
                            if (jsonRes.data && jsonRes.data.toLowerCase() != 'ok') {
                              callback(jsonRes.data);
                            } else {
                              callback();
                            }
                          }).catch(err => {
                            callback();
                          });
                        } else {
                          callback();
                        }
                      }
                    }
                  ]}
                >
                  <Input
                    onChange={(e) => {
                      setChangeBelongIsrc(e.target.value);
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="belong_isrc_show"
                  label=""
                  valuePropName="checked"
                >
                  <Checkbox>報表以此 ISRC 標示</Checkbox>
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="version"
                  label="錄音版別"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="isrc_type_ui"
                  label={fieldLabels.isrc_type_ui}
                  className={styles.addRequiredStar}
                  rules={[
                    {
                      validator(rule, values, callback) {
                        let result = valid.checkRequired((values ? values.value : values));

                        if (result != false) {
                          callback();
                        } else {
                          callback(valid.checkRequired_msg);
                        }
                      }
                    }
                  ]}
                >
                  <Select labelInValue={true}>
                    {
                      (isrcTypeList.listAutoList)
                        ? (
                          isrcTypeList.listAutoList.map((elem) => (
                            <Option key={elem.id} value={elem.id} label={elem.type}>
                              {elem.type}
                            </Option>
                          ))
                        )
                        : ([])
                    }
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <FormAuthorStageName
                  form={form}
                  isName="singer"
                  isLabel={fieldLabels.singer}
                  isName2="author_id"
                  isList={singerList}
                  setIsList={setSingerList}
                  isHiddenLabel={(isEdit) ? true : false}
                />
              </Col>
              <Col
                xs={24}
                lg={8}
                className={styles.formList}
              >
                <FormTape
                  form={form}
                  tapeList={tapeList}
                  setTapeList={setTapeList}
                  tapeCodeList={tapeCodeList}
                  setTapeCodeList={setTapeCodeList}
                />
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="data_type"
                  label={fieldLabels.data_type}
                  rules={[
                    { required: true, message: '此欄位為必填' },
                  ]}
                >
                  <Radio.Group
                    options={optDataType}
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
                  name="arranger"
                  label="編曲"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="producer"
                  label="製作"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="director"
                  label="導演"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="length"
                  label="秒數"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="release_date"
                  label="發行日期"
                  initialValue={null}
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
                <FormBelongAlbum
                  form={form}
                  isLabel="計算歸屬專輯"
                  isName="belong_album_id"
                  isSelectText="album_name"
                  isList={belongAlbumList}
                  setIsList={setBelongAlbumList}
                  countryLabel={belongAlbumCountry}
                  setCountryLabel={setBelongAlbumCountry}
                  CodeLabel={belongAlbumCode}
                  setCodeLabel={setBelongAlbumCode}
                />
              </Col>
            </Row>
          </Card>
          <Card
            bordered={false}
            className={styles.card}
          >
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={16}
              >
                <Form.Item
                  name="is_settle"
                  // label="新媒體結算 - 錄音"
                  label={fieldLabels.is_settle}
                  rules={[
                    { required: true, message: '此欄位為必填' },
                  ]}
                >
                  <Radio.Group
                    options={[
                      { label: '是', value: '1' },
                      { label: '否', value: '0' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <FormArea
                  form={form}
                  isLabel="可上架地區"
                  isNameAreaRadioTypeRadio="release_area_type_radio"
                  isNameAreaIdInputCountrys="release_area_id_input_countrys"
                  isNameAreaId="release_area_id"
                  isNameAreaTypeSelect="release_area_type_select"
                  isNameAreaIdInput2Countrys="release_area_id_input2_countrys"
                  isInit={initReleaseArea}
                  setIsInit={setInitReleaseArea}
                  initAuthorizedAreaList={
                    (isEdit)
                      ? (initReleaseAreaList)
                      : ([])
                  }
                  authorizedAreaList={authorizedAreaList}
                  authorizedCountryList={authorizedCountryList}
                  isDisabledInput2Countrys={areaCountry2Disabled}
                  setIsDisabledInput2Countrys={setAreaCountry2Disabled}
                  isRequired={true}
                />
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
                lg={16}
              >
                <Form.Item
                  name="notes"
                  label="備註"
                >
                  <TextArea rows={4} />
                </Form.Item>
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
            onClick={() => {
              setViewLoading(true);
              form?.submit();
            }}
          >送出</Button>
        </FooterToolbar>
      </Form>
    </Spin>
  );
}

export default connect(({ authorizedAreaList, authorizedCountryList, isrcList, isrcTypeList, loading }) => ({
  authorizedAreaList,
  authorizedCountryList,
  isrcList,
  isrcTypeList,
  loadingMultiGetISRCInfo: loading.effects['isrcList/fetchMultiGetISRCInfo'],
  loadingAddIsrcForm: loading.effects['isrcList/fetchAddIsrcForm'],
  loadingEditIsrcForm: loading.effects['isrcList/fetchEditIsrcForm'],
}))(update);