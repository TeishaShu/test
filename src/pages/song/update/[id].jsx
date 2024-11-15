import React, { useState, useEffect } from 'react';
import {
  Form,
  Card,
  Row,
  Col,
  Input,
  Radio,
  Select,
  Button,
  Modal,
  Popover,
  Spin,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect, history } from 'umi';
import pinyin4js from 'pinyin4js';
import { CloseCircleOutlined } from "@ant-design/icons";
import styles from '@/style/style.less';
import errorStyles from '@/style/error_style.less';
import FooterToolbar from '@/components/FooterToolbar';
import FormSongType from './components/FormSongType';
import FormRelatedSong from './components/FormRelatedSong';

const { Option } = Select;
const { TextArea } = Input;

export const update = props => {
  const {
    loadingMultiGetSong,
    loadingAddForm,
    loadingEditForm,
    dispatch,
    match,
    songList: { multiChangeId, optLanguage, optSongType, optSongCategory, info, updateDataResult, },
  } = props;
  const [form] = Form.useForm();
  const { confirm } = Modal;
  const [error, setError] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [viewLoading, setViewLoading] = useState(true);
  const [isSongTypeRadioId, setIsSongTypeRadioId] = useState('0');
  const [isSongCategoryId, setIsSongCategoryId] = useState('1');
  const [songCodeList, setSongCodeList] = useState([]);
  // for FormRelatedSong
  const [isSongNum, setIsSongNum] = useState(0);
  const [isSongPercent, setIsSongPercent] = useState(0);

  // fieldLabels
  const fieldLabels = {
    song_type_custom: '型態 - 自訂',
    song_name: '系統顯示',
    song_name_original: '原始歌名',
    song_name_zh: '中文歌名',
    is_settle: '新媒體結算 - 詞曲',
    song_table: {
      song_code: '歌曲名稱',
    }
  };

  // api -----
  // getData
  const getData = (editId) => {
    dispatch({
      type: 'songList/fetchMultiGetSong',
      payload: {
        id: editId
      },
    });
  }

  // mount
  useEffect(() => {
    let initObj = {
      song_name: '',
      song_name_original: '',
      song_name_zh: '',
      song_name_en: '',
      song_name_pingyin: '',
      iswc: '',
      song_language_id: '',
      song_version: '',
      is_settle: '1',
      song_category_id: '1',
      song_type_radio_id: '0',  // only for ui
      song_type_id: '',
      song_type_custom: '',
      origin_list: [],
      notes: '',
    };

    // init object
    form.setFieldsValue({
      ...initObj
    });

    if (match.params.id) {
      setIsEdit(true);
      getData(match.params.id);
    } else {
      setIsEdit(false);
      getData();
    }
  }, [match.params.id]);


  // updateData
  const updateData = () => {
    let getForm = form.getFieldValue();
    let getSongCategoryId = getForm.song_category_id;
    let getOriginList = getForm.origin_list;
    let tmpSongCodeList = [];

    setViewLoading(true);

    // add song_type_radio_id value
    if (getForm.song_type_id == '5') {
      setIsSongTypeRadioId('1');
      form.setFieldsValue({
        song_type_radio_id: '1',
        song_type_id: '',
      });
    } else {
      setIsSongTypeRadioId('0');
      form.setFieldsValue({
        song_type_radio_id: '0',
      });
    }

    // song_category_id (need use origin_list)
    changeSongCategoryId(getSongCategoryId);

    // song_code (need use origin_list)
    getOriginList = form.getFieldValue().origin_list;
    if (getOriginList) {
      for (let i = 0; i < getOriginList.length; i++) {
        let item = getOriginList[i];

        item.song_code = item.related_song_code;
        tmpSongCodeList.push([{ id: item.id, song_code: item.related_song_code, song_name: item.song_name }]);
      }
    }
    setSongCodeList(tmpSongCodeList);

    // songInfo (need use origin_list)
    changeSongInfo();

    setViewLoading(false);
  }
  useEffect(() => {
    if (isEdit) {
      let obj = Object.assign({}, info);

      form.setFieldsValue({
        ...obj,
      });
    }
    updateData();
  }, [multiChangeId]);

  // save
  const onFinish = values => {
    setError([]);

    let saveObj = Object.assign({}, values);

    if (isEdit) {
      saveObj.id = match.params.id;
    } else {
      delete saveObj.song_code;
    }

    // obj - null to string
    for (let key in saveObj) {
      if (saveObj[key] == null) {
        saveObj[key] = '';
      }
    }

    // remove 'song_type_radio_id'
    if (saveObj.song_type_radio_id == '1') {
      saveObj.song_type_id = '5';
    } else {
      saveObj.song_type_custom = '';
    }
    delete saveObj.song_type_radio_id;

    // convert iswc, ex: 'T-928.914.864-7' > 'T9289148647'
    const iswcToStr = (val) => {
      let iswcOut = val.replace(/\-/g, '');
      iswcOut = iswcOut.replace(/\./g, '');
      return iswcOut;
    }
    if (saveObj.iswc) {
      saveObj.iswc = iswcToStr(saveObj.iswc);
    }

    // change 'song_code' to 'related_song_code', delete 'song_name', null to string
    for (let i = 0; i < saveObj.origin_list.length; i++) {
      let item = saveObj.origin_list[i];

      item.related_song_code = item.song_code;
      delete item.song_code;
      delete item.song_name;

      if (item.related_song_ratio == null) {
        item.related_song_ratio = '';
      }
    }

    // change 'origin_list' to 'related_song'
    saveObj.related_song = saveObj.origin_list.slice();
    delete saveObj.origin_list;

    dispatch({
      type: (isEdit) ? 'songList/fetchEditForm' : 'songList/fetchAddForm',
      payload: saveObj,
    });
  }

  // saved, then redirect
  useEffect(() => {
    let redirect = '/song';

    if (updateDataResult != '' && updateDataResult != 'error') {
      if (!isEdit) {
        redirect = `/song/adv/id/${updateDataResult}`;
      } else {
        redirect = `/song/adv/id/${match.params.id}`;
      }

      history.push(redirect);
    }
  }, [updateDataResult]);

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
          history.push(`/song/adv/id/${match.params.id}`);
        } else {
          history.push('/song');
        }
      },
      onCancel() { },
    });
  }


  // valid -----
  const getErrorInfo = errors => {
    const errorCount = errors.filter(item => item.errors.length > 0).length;
    // fix Form.List field
    const cusFields = ['song_code'];
    const cusFieldId = 'song_table';

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
    setError(errorInfo.errorFields);
  };

  // ui -----
  // changeSongCategoryId
  const changeSongCategoryId = (val) => {
    let arrOriginList = [];
    let notDeleteNum = 0;

    setIsSongCategoryId(val);

    if (form.getFieldsValue().origin_list) {
      arrOriginList = form.getFieldsValue().origin_list.slice();
    }

    if (val == '1') {
      for (let i = 0; i < arrOriginList.length; i++) {
        if (arrOriginList[i].id) {
          arrOriginList[i].is_delete = '1';
        } else {
          arrOriginList.splice(i, 1);
          i--;
        }
      }
    } else if (val == '2') {
      for (let i = 0; i < arrOriginList.length; i++) {
        if (arrOriginList[i].id && arrOriginList[i].is_delete && arrOriginList[i].is_delete == '1') {
          continue;
        } else if (notDeleteNum == 0) {
          notDeleteNum++;
        } else {
          if (arrOriginList[i].id) {
            arrOriginList[i].is_delete = '1';
          } else {
            arrOriginList.splice(i, 1);
            i--;
          }
        }
      }
    }

    form.setFieldsValue({ origin_list: arrOriginList });
  }

  // changeSongInfo
  const changeSongInfo = () => {
    let songNum = 0;
    let songPercent = 0;
    let songPercentOut = 0;
    let arrOriginList = form.getFieldsValue().origin_list;

    // songNum
    if (arrOriginList) {
      for (let i = 0; i < arrOriginList.length; i++) {
        if (arrOriginList[i] && arrOriginList[i].is_delete && arrOriginList[i].is_delete == '1') {
          continue;
        }
        songNum++;
      }
    }
    setIsSongNum(songNum);

    // songPercent
    if (arrOriginList) {
      for (let i = 0; i < arrOriginList.length; i++) {
        if (arrOriginList[i] && arrOriginList[i].is_delete && arrOriginList[i].is_delete == '1') {
          continue;
        }
        if (arrOriginList[i] && arrOriginList[i].related_song_ratio) {
          songPercent += parseFloat(arrOriginList[i].related_song_ratio)
        }
      }
    }
    // 無條件捨去到小數點第 4 位，四捨五入到第 3 位
    songPercentOut = (Math.floor(songPercent * 10000) / 10000).toFixed(3);
    setIsSongPercent(songPercentOut);
  }

  return (
    <Spin
      tip="Loading..."
      spinning={isEdit ? (loadingEditForm || loadingMultiGetSong || viewLoading) : (loadingAddForm || loadingMultiGetSong || viewLoading)}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        onFieldsChange={changeSongInfo}
      >
        <PageHeaderWrapper
          title={isEdit ? '編輯歌曲' : '新增歌曲'}
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
                style={{ display: (isEdit) ? 'block' : 'none' }}
              >
                <Form.Item
                  name="song_code"
                  label="歌曲編號"
                >
                  <Input disabled={true} />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="song_name"
                  label={fieldLabels.song_name}
                  rules={[
                    { required: true, message: '此欄位為必填' }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="song_name_original"
                  label={fieldLabels.song_name_original}
                  rules={[
                    { required: true, message: '此欄位為必填' }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="song_name_zh"
                  label={fieldLabels.song_name_zh}
                  rules={[
                    { required: true, message: '此欄位為必填' }
                  ]}
                >
                  <Input
                    onChange={(e) => {
                      let pinyinVal = pinyin4js.convertToPinyinString(e.target.value, ' ', pinyin4js.WITHOUT_TONE).toUpperCase();

                      form.setFieldsValue({ song_name_pingyin: pinyinVal });
                    }}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="song_name_en"
                  label="英文歌名"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="song_name_pingyin"
                  label="拼音歌名 (以中文歌名為準)"
                >
                  <Input />
                </Form.Item>
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
                lg={8}
              >
                <Form.Item
                  name="iswc"
                  label="ISWC"
                  rules={[
                    {
                      validator(rule, values, callback) {
                        let result = true;
                        // for iswc spec, ex: 'T-928.914.864-7' or 'T9289148647'
                        const iswcReg = /^T(|\-)\d{3}(|\.)\d{3}(|\.)\d{3}(|\-)\d{1}$/;

                        if (values && !iswcReg.test(values)) {
                          result = false;
                        }

                        if (result) {
                          callback();
                        } else {
                          callback('ISWC 格式錯誤');
                        }
                      }
                    }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="song_language_id"
                  label="語言"
                  rules={[
                    { required: true, message: '此欄位為必填' }
                  ]}
                >
                  <Select
                    options={optLanguage}
                  />
                </Form.Item>
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="song_version"
                  label="版別"
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
                <FormSongType
                  form={form}
                  fieldLabels={fieldLabels}
                  isSongTypeRadioId={isSongTypeRadioId}
                  setIsSongTypeRadioId={setIsSongTypeRadioId}
                  optSongType={optSongType}
                />
              </Col>
              <Col
                xs={24}
                lg={8}
              >
                <Form.Item
                  name="is_settle"
                  label={fieldLabels.is_settle}
                  rules={[
                    { required: true, message: '此欄位為必填' }
                  ]}
                >
                  <Radio.Group>
                    <Radio value="1">是</Radio>
                    <Radio value="0">否</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          </Card>
          <Card
            bordered={false}
            className={styles.card}
            title="OT/組曲/節錄"
          >
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
              >
                <Form.Item
                  name="song_category_id"
                >
                  <Radio.Group
                    options={optSongCategory}
                    onChange={(e) => {
                      changeSongCategoryId(e.target.value);
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[64, 24]}>
              <Col
                xs={24}
              >
                <FormRelatedSong
                  form={form}
                  songCodeList={songCodeList}
                  setSongCodeList={setSongCodeList}
                  isSongCategoryId={isSongCategoryId}
                  isSongNum={isSongNum}
                  isSongPercent={isSongPercent}
                  changeSongInfo={changeSongInfo}
                />
              </Col>
            </Row>
          </Card>
          <Card
            bordered={false}
            className={styles.card}
            title="其他"
          >
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
            onClick={() => form?.submit()}
          >送出</Button>
        </FooterToolbar>
      </Form>
    </Spin>
  );
}

export default connect(({ songList, loading }) => ({
  songList,
  loadingMultiGetSong: loading.effects['songList/fetchMultiGetSong'],
  loadingAddForm: loading.effects['songList/fetchAddForm'],
  loadingEditForm: loading.effects['songList/fetchEditForm'],
}))(update);